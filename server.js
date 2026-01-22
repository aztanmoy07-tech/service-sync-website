const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client } = require("@googlemaps/google-maps-services-js");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const mapsClient = new Client({});
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());

// ✅ CUMULATIVE UPDATE: Broadened CORS to fix "Trouble Reaching Server" error
app.use(cors({ 
    origin: [
        'http://localhost:5173',
        'https://service-sync-website.vercel.app',
        'https://service-sync-website-cgtp94m3q-aztanmoy07-techs-projects.vercel.app' // Your specific build
    ],
    credentials: true 
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Error:', err));

// --- SCHEMAS (Includes All Updates) ---
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
    description: String, // ✅ PRESERVED: From description update
    isVerified: { type: Boolean, default: false }, // ✅ PRESERVED: For Verification Badge
    price: { type: Number, default: 99 },
    location: { lat: Number, lng: Number, address: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ name: String, price: Number }]
});
const Service = mongoose.model('Service', ServiceSchema);

// --- ROLE LOGIC (Preserved for Tanmoy/Karan/Harsh/Biki) ---
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

// --- AUTH ROUTES (Preserved) ---
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, role: user.role });
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- CORE API ROUTES (Includes All Updates) ---
app.get('/api/services', async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

app.post('/api/services', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const newService = new Service({ ...req.body, owner: decoded.id });
        await newService.save();
        res.json(newService);
    } catch (err) { res.status(500).send('Server Error'); }
});

// ✅ CUMULATIVE FIX: Optimized Chat Route with stable model
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        if (!message) return res.status(400).json({ error: "Message is required" });
        const prompt = `You are the Service Sync AI assistant. Help with local services in Guwahati/Athgaon. User: ${message}`;
        const result = await model.generateContent(prompt);
        res.json({ reply: result.response.text() });
    } catch (err) {
        console.error("Chat Error:", err);
        res.status(500).json({ error: "Chatbot connection error" });
    }
});
//// --- 1. DELETE SERVICE ROUTE (Developer & Owner Only) ---
app.delete('/api/services/:id', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ msg: 'Service not found' });

        // Allowed if user is developer OR the owner
        const isDev = ALLOWED_DEVS.includes(decoded.email);
        const isOwner = service.owner && service.owner.toString() === decoded.id;

        if (!isDev && !isOwner) return res.status(403).json({ msg: 'Unauthorized' });

        await Service.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Service deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- 2. DELETE USER/EMAIL ROUTE (Developer Only) ---
app.delete('/api/users/:id', async (req, res) => {
    const token = req.header('x-auth-token');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'developer') return res.status(403).json({ msg: 'Admin only' });

        // Delete user and all their associated services
        await User.findByIdAndDelete(req.params.id);
        await Service.deleteMany({ owner: req.params.id });
        res.json({ msg: 'User and their services deleted from database' });
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- 3. AUTO-WAKE LOGIC (Place right before app.listen) ---
const WAKE_URL = 'https://service-sync-website.onrender.com/api/services';
setInterval(async () => {
    try {
        const response = await fetch(WAKE_URL);
        console.log(`🚀 Auto-Wake: Ping Success (${response.status})`);
    } catch (err) {
        console.error("❌ Auto-Wake Fail:", err.message);
    }
}, 840000); // 14 minutes

// --- 4. START SERVER ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Service Sync Backend running on port ${PORT}`));