import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: 'shop', price: '', contact: '', address: '' });
  const [loading, setLoading] = useState(true);

  // ✅ Backend URL
  const API_URL = 'https://service-sync-website.onrender.com';

  useEffect(() => {
    // ✅ FIXED: Use full URL to avoid 404 errors
    axios.get(`${API_URL}/api/services`)
      .then(res => {
        const service = res.data.find(s => s._id === id);
        if (service) {
          setForm({
            // ✅ Handle different field names (title vs name)
            name: service.title || service.name, 
            category: service.category || 'shop',
            price: service.price,
            contact: service.phone || service.contact,
            // ✅ FIXED: Read address correctly as a string (matches AddService)
            address: service.location || '' 
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      // ✅ Send data using the field names your Backend expects
      const updateData = {
        title: form.name,       // Backend expects 'title'
        name: form.name,        // Sending 'name' too just in case
        category: form.category,
        price: form.price,
        phone: form.contact,    // Backend expects 'phone'
        contact: form.contact,
        location: form.address  // Backend expects 'location'
      };

      await axios.put(`${API_URL}/api/services/${id}`, updateData, {
        headers: { 'x-auth-token': token }
      });
      alert("Service Updated Successfully!");
      navigate('/');
    } catch (err) {
      alert("Update Failed: " + (err.response?.data?.msg || "Server Error"));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-black mb-6 text-center text-black">Edit Service Details</h2>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Service Name</label>
            <input 
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 font-medium" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
            />
          </div>
          
          {/* CATEGORY DROPDOWN */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
            <select 
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white font-medium cursor-pointer" 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})}
            >
              <option value="shop">Shops</option>
              <option value="transport">Transport</option>
              <option value="emergency">Emergency</option>
              <option value="student">Student Zone</option>
              <option value="hotel">Hotels</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price Range (₹)</label>
                {/* ✅ FIXED: Changed to text so you can edit ranges like '100-500' */}
                <input 
                  className="w-full p-3 border rounded-lg mt-1" 
                  type="text" 
                  value={form.price} 
                  onChange={e => setForm({...form, price: e.target.value})} 
                  required 
                />
            </div>
            <div className="w-1/2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact</label>
                <input 
                  className="w-full p-3 border rounded-lg mt-1" 
                  value={form.contact} 
                  onChange={e => setForm({...form, contact: e.target.value})} 
                  required 
                />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Address</label>
            <input 
              className="w-full p-3 border rounded-lg mt-1" 
              value={form.address} 
              onChange={e => setForm({...form, address: e.target.value})} 
              required 
            />
          </div>

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md mt-2">
            Save Changes
          </button>
        </form>
        
        <button onClick={() => navigate('/')} className="w-full mt-4 text-gray-400 font-bold text-xs hover:text-black transition">
            Cancel
        </button>
      </div>
    </div>
  );
};

export default EditService;