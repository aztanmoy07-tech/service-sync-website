import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function BusinessDashboard() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'shop', contact: '', price: '', lat: '', lng: '', address: '' });
  const navigate = useNavigate();
  
  // ✅ 1. DEFINE YOUR BACKEND URL
  const API_URL = 'https://service-sync-website.onrender.com';

  const token = localStorage.getItem('token');
  const config = { headers: { 'x-auth-token': token } };

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      // ✅ Updated GET request
      const res = await axios.get(`${API_URL}/api/my-services`, config);
      setServices(res.data);
    } catch (err) { console.error(err); }
  };

  const addService = async (e) => {
    e.preventDefault();
    const payload = { 
      ...form, 
      price: Number(form.price) || 99, 
      location: { lat: Number(form.lat), lng: Number(form.lng), address: form.address } 
    };
    try {
      // ✅ Updated POST request
      await axios.post(`${API_URL}/api/services`, payload, config);
      setForm({ name: '', category: 'shop', contact: '', price: '', lat: '', lng: '', address: '' });
      fetchServices();
      alert("Business Added Successfully!");
    } catch (err) { alert("Failed to add business"); }
  };

  const deleteService = async (id) => {
    if (confirm("Delete this business?")) {
      // ✅ Updated DELETE request
      await axios.delete(`${API_URL}/api/services/${id}`, config);
      fetchServices();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen bg-gray-50 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Business Manager 💼</h1>
        <button onClick={() => {localStorage.clear(); navigate('/');}} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition">Logout</button>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4 text-indigo-600">Add New Service</h2>
        <form onSubmit={addService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Shop Name" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
          <select className="p-3 border rounded-lg bg-white" value={form.category} onChange={e=>setForm({...form, category: e.target.value})}>
            <option value="shop">Shop / Store</option>
            <option value="transport">Transport / Cab</option>
            <option value="hotel">Hotel / Room</option>
            <option value="emergency">Medical / Emergency</option>
            <option value="student">Student Resource</option>
          </select>
          <input placeholder="Contact" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200" value={form.contact} onChange={e=>setForm({...form, contact: e.target.value})} required />
          
          {/* PRICE INPUT */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input type="number" placeholder="Price (e.g. 200)" className="pl-8 p-3 w-full border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} required />
          </div>

          <input placeholder="Latitude (e.g. 27.1)" className="p-3 border rounded-lg" value={form.lat} onChange={e=>setForm({...form, lat: e.target.value})} required />
          <input placeholder="Longitude (e.g. 93.6)" className="p-3 border rounded-lg" value={form.lng} onChange={e=>setForm({...form, lng: e.target.value})} required />
          <input placeholder="Address" className="md:col-span-2 p-3 border rounded-lg" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} required />
          <button className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition shadow-md">+ Publish Business</button>
        </form>
      </div>

      <div className="space-y-4">
        {services.map(s => (
          <div key={s._id} className="bg-white border border-gray-200 p-5 rounded-xl flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{s.name}</h3>
              <p className="text-sm text-gray-500">{s.category.toUpperCase()} • 📞 {s.contact}</p>
              <p className="text-sm font-bold text-green-600 mt-1">Price: ₹{s.price}</p>
            </div>
            <button onClick={() => deleteService(s._id)} className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg font-bold border border-red-200 transition">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}