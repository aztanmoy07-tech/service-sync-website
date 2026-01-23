import React, { useState } from 'react'; // ✅ CORRECTION: Added missing 'import'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // ✅ Backend URL
  const API_URL = 'https://service-sync-website.onrender.com';

  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Route matches server.js
      const res = await axios.post(`${API_URL}/api/signup`, formData);
      
      // ✅ CORRECTION: Save Token AND Role (Critical for Navbar/Dashboards)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role || 'user'); // Default to 'user' if server doesn't send it

      alert("Signup Successful! Redirecting...");

      // ✅ CORRECTION: Redirect based on role (Future-proofing)
      if(res.data.role === 'developer') {
          navigate('/dev');
      } else if (res.data.role === 'business') {
          navigate('/business');
      } else {
          navigate('/'); 
      }

    } catch (err) {
      console.error("Signup Error:", err);
      const errorMsg = err.response?.data?.msg || 'Error signing up. Please try again.';
      alert(errorMsg);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google Signup coming soon! Please use Email/Password.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join Service Sync today</p>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={name} 
              onChange={onChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required 
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={email} 
              onChange={onChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              value={password} 
              onChange={onChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required 
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
            Sign Up
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* ✅ GOOGLE SIGNUP BUTTON */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.04-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-8 text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;