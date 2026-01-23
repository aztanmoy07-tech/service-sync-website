import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddService = () => {
  const navigate = useNavigate();
  
  // ✅ Backend URL
  const API_URL = 'https://service-sync-website.onrender.com';

  const [formData, setFormData] = useState({
    title: '',        
    description: '',  
    price: '',
    phone: '',        
    location: '',     
    category: 'shop' // Default category
  });

  const { title, description, price, phone, location, category } = formData;

  // ✅ Check if user is allowed (Business OR Developer)
  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else if (role !== 'business' && role !== 'developer') {
      alert("Access Denied: Only Businesses and Developers can add services.");
      navigate('/');
    }
  }, [navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token 
        }
      };

      await axios.post(`${API_URL}/api/services`, formData, config);
      
      alert('Service Added Successfully!');
      
      const role = localStorage.getItem('role');
      if (role === 'developer') {
        navigate('/dev');
      } else {
        navigate('/business'); 
      }
      
    } catch (err) {
      console.error(err);
      alert('Error adding service. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Register Business</h2>
          <p className="text-gray-500">Join the Service Sync network today.</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Business Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Business Name</label>
            <input 
              type="text" 
              name="title" 
              value={title} 
              onChange={onChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. John's Plumbing"
              required 
            />
          </div>

          {/* ✅ RESTORED: Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Category</label>
            <select 
              name="category"
              value={category}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
            >
              <option value="shop">Shops</option>
              <option value="transport">Transport</option>
              <option value="emergency">Emergency</option>
              <option value="student">Student Zone</option>
              <option value="hotel">Hotels</option>
            </select>
          </div>

          {/* Price & Contact Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Price Range (₹)</label>
              {/* ✅ FIXED: Changed type="number" to type="text" to allow ranges like '0-100' */}
              <input 
                type="text" 
                name="price" 
                value={price} 
                onChange={onChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. 100-500"
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Contact No</label>
              <input 
                type="text" 
                name="phone" 
                value={phone} 
                onChange={onChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. 9876543210"
                required 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Business Description</label>
            <textarea 
              name="description" 
              value={description} 
              onChange={onChange} 
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Describe your services..."
              required 
            ></textarea>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Full Address</label>
            <input 
              type="text" 
              name="location" 
              value={location} 
              onChange={onChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. 123 Main St, Mumbai"
              required 
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-lg transition-colors shadow-md text-lg">
            PUBLISH TO SERVICE SYNC
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddService;