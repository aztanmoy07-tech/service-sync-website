import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard'; 

// ✅ Icons
const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>,
  Plus: () => <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>,
  Map: () => <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>,
  Shop: () => <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>,
  Hotel: () => <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
  Transport: () => <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>,
  Student: () => <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>,
  Emergency: () => <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
};

const Main = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // ✅ AUTH & ROLE CHECK
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const userRole = localStorage.getItem('role') || 'user'; 
  
  // ✅ ACCESS CONTROL
  const isDeveloper = userRole === 'developer';
  const isBusiness = userRole === 'business' || userRole === 'developer';

  const API_URL = 'https://service-sync-website.onrender.com';

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/services`);
      setServices(res.data);
      setFilteredServices(res.data);
    } catch (err) { console.error("Error fetching services:", err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    let result = services;
    if (category !== 'All' && category !== 'map') {
        result = result.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    if (searchTerm) {
        result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.category.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredServices(result);
  }, [category, searchTerm, services]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const categories = [
    { id: 'map', name: 'View Area Map', sub: 'Click to expand visual map', icon: <Icons.Map />, bg: 'bg-white' }, 
    { id: 'shop', name: 'Shops', sub: 'Essentials & Electronics', icon: <Icons.Shop />, bg: 'bg-white' },
    { id: 'hotel', name: 'Hotels', sub: 'Guest Houses & Rooms', icon: <Icons.Hotel />, bg: 'bg-white' },
    { id: 'transport', name: 'Transport', sub: 'Taxi, Bus & Rentals', icon: <Icons.Transport />, bg: 'bg-white' },
    { id: 'student', name: 'Student Zone', sub: 'Hostels & Libraries', icon: <Icons.Student />, bg: 'bg-white' },
    { id: 'emergency', name: 'Emergency', sub: 'Medical & Critical Aid', icon: <Icons.Emergency />, bg: 'bg-white' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
           <span className="text-xl font-bold tracking-tight">Survey Sync</span>
        </div>
        <div className="flex gap-3">
            {isLoggedIn ? (
              <>
                {isDeveloper && (
                  <Link to="/dev" className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition shadow-md">
                    Developer Panel 🛠️
                  </Link>
                )}
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition">Login</Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition">Sign Up</Link>
              </>
            )}
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="py-12 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Find Services <span className="text-blue-600">Near You</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Instant access to emergency help, student resources, and local utilities in your area.
            </p>
            <div className="pt-6 flex flex-col items-center gap-4">
               
               {isBusiness ? (
                 <button onClick={() => navigate("/add-service")} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition transform">
                    <Icons.Plus /> Add New Service
                 </button>
               ) : <div className="h-4"></div>}

               <div className="relative w-full max-w-2xl mt-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Icons.Search />
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm text-lg transition"
                    placeholder="What are you looking for? (e.g. Taxi, Medical)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
        </div>

        <div className="mb-12">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Explore Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
               {categories.map((cat) => (
                 <button 
                   key={cat.id} 
                   onClick={() => setCategory(cat.id === category ? 'All' : cat.id)} 
                   className={`text-left p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group ${category === cat.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'}`}
                 >
                    <div className="flex items-start justify-between mb-4">
                       <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-white transition">{cat.icon}</div>
                       {cat.id === 'map' && <span className="text-[10px] bg-gray-200 px-2 py-1 rounded-full font-bold text-gray-600">VISUAL</span>}
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-gray-800">{cat.name}</h4>
                       <p className="text-sm text-gray-500">{cat.sub}</p>
                    </div>
                 </button>
               ))}
            </div>
        </div>

        <div className="pb-20">
            <div className="flex justify-between items-end mb-6">
               <h2 className="text-2xl font-bold text-gray-900">
                  {category === 'map' ? 'Live Area Map' : 'Available Services'}
               </h2>
               {category !== 'All' && <button onClick={() => setCategory('All')} className="text-sm text-red-500 font-bold hover:underline">Clear Filter</button>}
            </div>
            
            {/* ✅ MAP IMPLEMENTATION */}
            {category === 'map' ? (
                <div className="w-full h-96 bg-gray-200 rounded-3xl overflow-hidden shadow-inner border border-gray-300">
                  {/* Embedded Google Map (Defaulting to a central location, usually Guwahati based on context, or generic) */}
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src="https://maps.google.com/maps?q=Guwahati&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    title="Area Map"
                  ></iframe>
                </div>
            ) : (
                loading ? <div className="text-center py-20 text-gray-400">Loading services...</div> : filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredServices.map((service) => (
                        <ServiceCard key={service._id} service={service} />
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No services found for "{searchTerm || category}".</p>
                        <button onClick={() => {setCategory('All'); setSearchTerm('');}} className="mt-2 text-blue-600 font-bold">Show All</button>
                    </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default Main;