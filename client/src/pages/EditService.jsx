import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: 'shop', price: '', contact: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ideally use a specific GET /:id route, but finding in list works for small apps
    axios.get('/api/services')
      .then(res => {
        const service = res.data.find(s => s._id === id);
        if (service) {
          setForm({
            name: service.name,
            category: service.category || 'shop', // Default to shop if missing
            price: service.price,
            contact: service.contact,
            address: service.location?.address || ''
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
      await axios.put(`https://service-sync-website.onrender.com/api/services/${id}`, form, {
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
          
          {/* STRICT CATEGORY DROPDOWN */}
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price (₹)</label>
                <input className="w-full p-3 border rounded-lg mt-1" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            </div>
            <div className="w-1/2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact</label>
                <input className="w-full p-3 border rounded-lg mt-1" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} required />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Address</label>
            <input className="w-full p-3 border rounded-lg mt-1" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
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
}