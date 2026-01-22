const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

// --- IMPORTS FOR AI & MAPS ---
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client } = require("@googlemaps/google-maps-services-js");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Initialize Clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const mapsClient = new Client({});
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());

// FIXED: Removed trailing slash from Vercel URL to prevent CORS mismatches
app.use(cors({ 
    origin: ['https://service-sync-website.vercel.app'],
    credentials: true 
}));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Error:', err));

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, 
    role: { type: String, default: 'user' },
    googleId: { type: String }
});
const User = mongoose.model('User', UserSchema);

const ServiceSchema = new mongoose.Schema({
    name: String,
    category: String,
    contact: String,
    price: { type: Number, default: 99 },
    location: { lat: Number, lng: Number, address: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        name: String,
        price: Number
    }]
});
const Service = mongoose.model('Service', ServiceSchema);

// --- CONFIGURATION: ROLE LOGIC ---
const ALLOWED_DEVS = [
    "tanmoyaj35@gmail.com",
    "karankatowal80@gmail.com", 
    "harshtiwari809259@gmail.com",
    "bikiborah896@gmail.com",
    "admin@service-sync.com"
];

const getRoleFromEmail = (email) => {
    const lowerEmail = email.toLowerCase();
    if (ALLOWED_DEVS.includes(lowerEmail)) return 'developer';
    if (lowerEmail.endsWith('@business.com')) return 'business';
    return 'user';
};

// --- AUTH ROUTES ---
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });
        const role = getRoleFromEmail(email);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, role: user.role });
    } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });
        if (!user.password) return res.status(400).json({ msg: 'Please use Google Login' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, role: user.role });
    } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/google-login', async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
        const { name, email, sub } = ticket.getPayload();
        let user = await User.findOne({ email });
        if (!user) {
            const role = getRoleFromEmail(email);
            user = new User({ name, email, googleId: sub, role });
            await user.save();
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, role: user.role });
    } catch (err) { res.status(500).send('Google Auth Error'); }
});

// --- CORE API ROUTES ---
app.get('/api/services', async (req, res) => {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const services = await Service.find(filter);
    res.json(services);
});

app.get('/api/my-services', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const services = await Service.find({ owner: decoded.id });
        res.json(services);
    } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/services', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'user') return res.status(403).json({ msg: "Users cannot create services." });
        const newService = new Service({ ...req.body, owner: decoded.id });
        await newService.save();
        res.json(newService);
    } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/services/:id/items', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const service = await Service.findById(req.params.id);
        if (decoded.role !== 'developer' && service.owner.toString() !== decoded.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        service.items.push({ name: req.body.name, price: req.body.price });
        await service.save();
        res.json(service);
    } catch (err) { res.status(500).send('Server Error'); }
});

app.delete('/api/services/:id', async (req, res) => {
    const token = req.header('x-auth-token');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const service = await Service.findById(req.params.id);
        if (decoded.role !== 'developer' && service.owner.toString() !== decoded.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        await Service.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/services/:id', async (req, res) => {
    const token = req.header('x-auth-token');
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- ADMIN ROUTES ---
app.get('/api/users', async (req, res) => {
    const token = req.header('x-auth-token');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'developer') return res.status(403).json({ msg: 'Access Denied' });
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) { res.status(500).send('Server Error'); }
});

app.delete('/api/users/:id', async (req, res) => {
    const token = req.header('x-auth-token');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'developer') return res.status(403).json({ msg: 'Access Denied' });
        await User.findByIdAndDelete(req.params.id);
        await Service.deleteMany({ owner: req.params.id });
        res.json({ msg: 'User deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- PAYMENT & AI ROUTES ---
app.post('/api/create-checkout-session', async (req, res) => {
    const { serviceName, price } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: { name: `Booking: ${serviceName}` },
                    unit_amount: price * 100, 
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/`,
        });
        res.json({ id: session.id });
    } catch (err) { res.status(500).json({ error: 'Payment error' }); }
});

// --- NEW SURVEY ASSISTANT CHAT ROUTE ---
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    try {
        if (!message) return res.status(400).json({ error: "Message is required" });
        
        const prompt = `You are a helpful Survey Sync assistant. Help the user with services, navigation, and emergency contacts. User says: ${message}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (err) {
        console.error("Chat Error:", err);
        res.status(500).json({ error: "Chatbot connection error" });
    }
});

// Existing AI Logic (Gemini + Maps)
const tools = [
  {
    functionDeclarations: [
      { name: "searchPlaces", description: "Find places based on a query.", parameters: { type: "OBJECT", properties: { query: { type: "STRING" } }, required: ["query"] } },
      { name: "getDirections", description: "Get directions between two locations.", parameters: { type: "OBJECT", properties: { origin: { type: "STRING" }, destination: { type: "STRING" } }, required: ["origin", "destination"] } },
    ],
  },
];

async function searchPlaces(query) { try { const response = await mapsClient.textSearch({ params: { query: query, key: process.env.GOOGLE_MAPS_API_KEY } }); return response.data.results.slice(0, 3).map(p => ({ name: p.name, address: p.formatted_address, rating: p.rating })); } catch (error) { return "Error fetching places."; } }
async function getDirections(origin, destination) { try { const response = await mapsClient.directions({ params: { origin, destination, key: process.env.GOOGLE_MAPS_API_KEY } }); const route = response.data.routes[0].legs[0]; return { distance: route.distance.text, duration: route.duration.text, steps: route.steps.map(s => s.html_instructions.replace(/<[^>]*>?/gm, '')) }; } catch (error) { return "Error fetching directions."; } }

app.post('/api/chat-with-maps', async (req, res) => {
  const { userMessage } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-pro", tools: tools });
  try {
    const chat = model.startChat();
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      let apiResult;
      if (call.name === "searchPlaces") apiResult = await searchPlaces(call.args.query);
      else if (call.name === "getDirections") apiResult = await getDirections(call.args.origin, call.args.destination);
      const finalResult = await chat.sendMessage([{ functionResponse: { name: call.name, response: { name: call.name, content: apiResult } } }]);
      return res.json({ reply: finalResult.response.text() });
    }
    res.json({ reply: response.text() });
  } catch (err) { res.status(500).send('AI Error'); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));