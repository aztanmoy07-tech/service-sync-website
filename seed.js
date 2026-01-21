const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 1. Simple User Schema (Must match your server code)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'developer' } // Grants Admin Access
});
const User = mongoose.model('User', UserSchema);

// 2. Connect and Create
const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 MongoDB Connected for Seeding');

    // Check if admin exists
    const exists = await User.findOne({ email: 'admin@service.com' });
    if (exists) {
      console.log('⚠️ Admin already exists!');
      process.exit();
    }

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Super Admin',
      email: 'admin@service.com',
      password: hashedPassword,
      role: 'developer'
    });

    console.log('✅ Admin Account Created Successfully!');
    console.log('👉 Email: admin@service.com');
    console.log('👉 Pass:  admin123');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();