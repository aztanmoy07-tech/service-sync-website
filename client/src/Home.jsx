// File: client/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard'; // Adjust path if ServiceCard is in specific folder

const Home = () => {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Categories - Make sure these match what you use in "Add Service"
  const categories = ['All', 'Food', 'Transport', 'Utilities', 'Cleaning', 'Others'];

  // ✅ Fetch Services (Auto-runs when category changes)
  const fetchServices = async () => {
    setLoading(true);
    try {
      // 1. Base URL for your live server
      let url = 'https://service-sync-website.onrender.com/api/services';
      
      // 2. Add category filter if not "All"
      if (category !== 'All') {
        url = `https://service-sync-website.onrender.com/api/services?category=${category}`;
      }

      const res = await axios.get(url);
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category]); 

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with "Add Service" Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Services</h1>
        <Link 
          to="/add-service" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Service
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 border
              ${category === cat 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading services...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-xl text-gray-500">No services found in "{category}"</p>
              <button onClick={() => setCategory('All')} className="text-blue-500 underline mt-2">
                View All Services
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;