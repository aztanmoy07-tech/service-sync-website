import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddService() {
  // Default category is 'shop' to ensure it's never empty or invalid
  const [form, setForm] = useState({ name: '', category: 'shop', price: '', contact: '', address: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/services', form, { headers: { 'x-auth-token': token } });
      alert("Service Added Successfully!");
      navigate('/');
    } catch (err) {
      alert("Failed to add service. " + (err.response?.data?.msg || "Check console"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-black mb-2 text-center text-black">Add New Service</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Fill in the details to list your business.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* SERVICE NAME */}
          <div>
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Service Name</label>
            <input 
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
                placeholder="e.g. Campus Canteen" 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
            />
          </div>
          
          {/* STRICT CATEGORY DROPDOWN */}
          <div>
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Category</label>
            <select 
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                onChange={e => setForm({...form, category: e.target.value})}
                value={form.category}
            >
                {/* These VALUES must match the IDs in Dashboard.jsx exactly */}
                <option value="shop">Shops (Essentials & Electronics)</option>
                <option value="transport">Transport (Taxi, Bus, Rentals)</option>
                <option value="emergency">Emergency (Medical & Aid)</option>
                <option value="student">Student Zone (Hostels & Libraries)</option>
                <option value="hotel">Hotels (Guest Houses)</option>
            </select>
          </div>

          {/* PRICE & CONTACT */}
          <div className="flex gap-4">
            <div className="w-1/2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Base Price (₹)</label>
                <input 
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1" 
                    placeholder="99" 
                    type="number" 
                    onChange={e => setForm({...form, price: e.target.value})} 
                    required 
                />
            </div>
            <div className="w-1/2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Contact No.</label>
                <input 
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1" 
                    placeholder="+91 98765..." 
                    onChange={e => setForm({...form, contact: e.target.value})} 
                    required 
                />
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Location / Address</label>
            <input 
                className="w-full p-3 border border-gray-300 rounded-lg mt-1" 
                placeholder="e.g. Near Main Gate, Nirjuli" 
                onChange={e => setForm({...form, address: e.target.value})} 
                required 
            />
          </div>

          <button className="w-full bg-black text-white p-4 rounded-lg font-bold text-sm hover:bg-gray-800 transition shadow-lg mt-4">
            🚀 Publish Service
          </button>
        </form>
        
        <button onClick={() => navigate('/')} className="w-full mt-4 text-gray-500 font-bold text-xs hover:text-black transition">
            Cancel & Go Back
        </button>
      </div>
    </div>
  );
}