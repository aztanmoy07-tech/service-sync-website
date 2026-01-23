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

// ✅ 1. IMPROVED CORS CONFIGURATION
const allowedOrigins = [
    'http://localhost:5173',
    'https://service-sync-website.vercel.app',
    'https://service-sync-website-cgtp94m3q-aztanmoy07-techs-projects.vercel.app'
];

// ✅ REPLACE YOUR CURRENT CORS BLOCK WITH THIS:
app.use(cors({ 
    origin: '*',  // 🚨 This allows ANY URL to connect (Fixes the error instantly)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    credentials: true 
}));


// ✅ 2. FIX: HANDLE CORS PRE-FLIGHT (OPTIONS)
// This answers the browser's "is it okay to talk to you?" request immediately.
app.options('*', cors()); 

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
    description: String,
    isVerified: { type: Boolean, default: false },
    price: { type: Number, default: 99 },
    location: { lat: Number, lng: Number, address: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ name: String, price: Number }]
});
const Service = mongoose.model('Service', ServiceSchema);

// --- ROLE LOGIC ---
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
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET);
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
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET);
        res.json({ token, role: user.role });
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- CORE API ROUTES ---
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

// ✅ CHAT ROUTE
// ✅ UPDATED CHAT ROUTE
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // 1. Check if API Key exists
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ ERROR: GEMINI_API_KEY is missing from Render Environment!");
            return res.status(500).json({ error: "Server Configuration Error" });
        }

        // 2. Initialize Model inside the route for stability
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        if (!message) return res.status(400).json({ error: "No message provided" });

        const prompt = `You are the Service Sync AI for Guwahati. Help the user: ${message}`;
        
        // 3. Generate Content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (err) {
        // This will show up in your Render "Logs" tab
        console.error("Detailed Gemini Error:", err);
        res.status(500).json({ 
            error: "AI Generation Failed", 
            details: err.message 
        });
    }
});
// --- DELETE SERVICE ---
app.delete('/api/services/:id', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ msg: 'Service not found' });

        const isDev = ALLOWED_DEVS.includes(decoded.email?.toLowerCase());
        const isOwner = service.owner && service.owner.toString() === decoded.id;

        if (!isDev && !isOwner) return res.status(403).json({ msg: 'Unauthorized' });

        await Service.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Service deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});// ✅ ADMIN PASSWORD RESET ROUTE
app.put('/api/users/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const token = req.header('x-auth-token');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Only you (Tanmoy) or other devs can do this
        if (decoded.role !== 'developer') {
            return res.status(403).json({ msg: "Only developers can reset passwords" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findOneAndUpdate({ email: email }, { password: hashedPassword });
        
        res.json({ msg: `Password updated for ${email}` });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// --- DELETE USER ---
app.delete('/api/users/:id', async (req, res) => {
    const token = req.header('x-auth-token');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'developer') return res.status(403).json({ msg: 'Admin only' });

        await User.findByIdAndDelete(req.params.id);
        await Service.deleteMany({ owner: req.params.id });
        res.json({ msg: 'User and their services deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- AUTO-WAKE LOGIC ---
const WAKE_URL = 'https://service-sync-website.onrender.com/api/services';
setInterval(async () => {
    try {
        const response = await fetch(WAKE_URL);
        console.log(`🚀 Auto-Wake: Ping Success (${response.status})`);
    } catch (err) {
        console.error("❌ Auto-Wake Fail:", err.message);
    }
}, 840000); // 14 minutes


// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Service Sync Backend running on port ${PORT}`));