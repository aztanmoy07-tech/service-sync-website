import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', isBusiness: false });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, role: form.isBusiness ? 'business' : 'user' };
      const res = await axios.post('https://service-sync-website.onrender.com/api/signup', payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate(res.data.role === 'business' ? '/business-dashboard' : '/');
    } catch (err) { alert('Signup Failed'); }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Join Us</h2>
        <input className="w-full mb-4 p-3 border rounded" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
        <input className="w-full mb-4 p-3 border rounded" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input className="w-full mb-4 p-3 border rounded" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <div className="flex items-center mb-6">
          <input type="checkbox" className="mr-2" onChange={e => setForm({...form, isBusiness: e.target.checked})} />
          <label>I am a Business Owner</label>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded font-bold">Sign Up</button>
      </form>
    </div>
  );
}