import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard'; 

const Main = () => {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // ✅ Backend URL
  const API_URL = 'https://service-sync-website.onrender.com';
  const categories = ['All', 'Food', 'Transport', 'Utilities', 'Cleaning', 'Others'];

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/services`;
      if (category !== 'All') url = `${API_URL}/api/services?category=${category}`;
      const res = await axios.get(url);
      setServices(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, [category]); 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Services</h1>
        <Link to="/add-service" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">+ Add Service</Link>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full font-semibold border ${category === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>{cat}</button>
        ))}
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => <ServiceCard key={service._id} service={service} />)}
        </div>
      )}
    </div>
  );
};
export default Main;