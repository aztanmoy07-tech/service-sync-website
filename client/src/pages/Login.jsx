import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://service-sync-website.onrender.com/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      // Navigate based on role
      if (res.data.role === 'developer') navigate('/dev');
      else if (res.data.role === 'business') navigate('/business-dashboard');
      else navigate('/dashboard');
      
      window.location.reload();
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    // 1. CONTAINER: min-h-screen & flex center fixes the "too low" positioning
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      {/* 2. CARD: Increased shadow and border for better visibility */}
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        
        {/* Header */}
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-black mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm font-medium">Please enter your details to sign in.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
              <input 
                // 3. INPUTS: Dark text (text-gray-900), Visible Placeholder, Solid Border
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition" 
                placeholder="Enter your email" 
                value={email}
                onChange={e => setEmail(e.target.value)} 
              />
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Password</label>
              <input 
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition" 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={e => setPassword(e.target.value)} 
              />
          </div>
          
          <button className="w-full bg-black text-white py-3.5 rounded-lg font-bold text-base hover:bg-gray-800 transition shadow-md">
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600 font-medium">
            Don't have an account? <a href="/signup" className="text-blue-700 font-bold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}