import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddService = () => {
  const [formData, setFormData] = useState({
    name: '', category: 'shop', price: '', contact: '', address: '', description: '', lat: 26.1833, lng: 91.7333
  });
  
  const navigate = useNavigate();
  const API_URL = 'https://service-sync-website.onrender.com';

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({ ...prev, lat: position.coords.latitude, lng: position.coords.longitude }));
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/services`, formData, { headers: { Authorization: `Bearer ${token}` } });
      alert("Service added successfully!");
      navigate('/');
    } catch (err) { alert("Error adding service."); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100 h-64 md:h-auto relative">
            <iframe width="100%" height="100%" frameBorder="0" src={`https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sCi9DQUlRQUNvZENodHljRjlvT2sxYVpGRmZNVXBWWTBOMlNVaE1UMFZLTWtSWU1GRRAB!2m1!1s0x375a5a337667a42f:0xd2a0e60c780ed1ad{formData.lat},${formData.lng}&output=embed`} title="Picker"></iframe>
          </div>
          <div className="md:w-1/2 p-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Register Business</h2>
            <p className="text-gray-500 mb-8 font-medium italic text-sm">Join the Service Sync network today.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Business Name" required className="w-full p-4 rounded-2xl bg-gray-50 outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <select className="w-full p-4 rounded-2xl bg-gray-50 outline-none font-bold" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="shop">Shop / Essentials</option>
                <option value="hotel">Hotel / Rooms</option>
                <option value="transport">Transport / Taxi</option>
                <option value="student">Student Zone</option>
                <option value="emergency">Emergency Service</option>
              </select>
              <div className="flex gap-4">
                <input type="number" placeholder="Price (₹)" required className="w-1/2 p-4 rounded-2xl bg-gray-50 outline-none" onChange={(e) => setFormData({...formData, price: e.target.value})} />
                <input type="text" placeholder="Contact No" required className="w-1/2 p-4 rounded-2xl bg-gray-50 outline-none" onChange={(e) => setFormData({...formData, contact: e.target.value})} />
              </div>
              <textarea placeholder="Business Description" className="w-full p-4 rounded-2xl bg-gray-50 outline-none h-24" onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              <textarea placeholder="Full Address" required className="w-full p-4 rounded-2xl bg-gray-50 outline-none h-20" onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
              <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95">PUBLISH TO SERVICE SYNC</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;