import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard'; 

// ✅ Built-in Icons (Ensures they load even if external libs fail)
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
  const [location, setLocation] = useState({ lat: 26.1833, lng: 91.7333 });
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role') || 'user'; 
  const isDeveloper = userRole === 'developer';
  const isBusiness = userRole === 'business' || userRole === 'developer';
  const API_URL = 'https://service-sync-website.onrender.com';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/services`);
        setServices(res.data);
        setFilteredServices(res.data);
      } catch (err) { console.error("Data fetch failed:", err); } 
      finally { setLoading(false); }
    };
    fetchServices();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  useEffect(() => {
    let result = services;
    if (category !== 'All' && category !== 'map') {
      result = result.filter(s => s.category?.toLowerCase() === category.toLowerCase());
    }
    if (searchTerm) {
      result = result.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredServices(result);
  }, [category, searchTerm, services]);

  const categories = [
    { id: 'map', name: 'View Area Map', sub: 'Live GPS Location', icon: <Icons.Map /> }, 
    { id: 'shop', name: 'Shops', sub: 'Essentials', icon: <Icons.Shop /> },
    { id: 'hotel', name: 'Hotels', sub: 'Guest Houses', icon: <Icons.Hotel /> },
    { id: 'transport', name: 'Transport', sub: 'Taxi & Rentals', icon: <Icons.Transport /> },
    { id: 'student', name: 'Student Zone', sub: 'Hostels', icon: <Icons.Student /> },
    { id: 'emergency', name: 'Emergency', sub: 'Medical Aid', icon: <Icons.Emergency /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* --- NAVBAR (Always Visible) --- */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
           <span className="text-2xl font-black tracking-tight">Service Sync</span>
        </div>
        <div className="flex gap-4">
            {token ? (
              <>
                {isDeveloper && <Link to="/dev" className="px-5 py-2 text-sm font-bold text-white bg-red-600 rounded-full">Dev Panel</Link>}
                <button onClick={() => {localStorage.clear(); window.location.reload();}} className="px-5 py-2 text-sm font-bold text-white bg-black rounded-full">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-black">Login</Link>
                <Link to="/signup" className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-full">Sign Up</Link>
              </>
            )}
        </div>
      </nav>

      {/* --- BROAD DASHBOARD CONTENT --- */}
      <div className="container mx-auto px-6 max-w-[95%]">
        <div className="py-14 text-center space-y-4">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Find Services <span className="text-blue-600">Near You</span></h1>
            <div className="pt-8 flex flex-col items-center gap-6">
               {isBusiness && (
                 <button onClick={() => navigate("/add-service")} className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black shadow-lg">
                    <Icons.Plus /> Add New Service
                 </button>
               )}
               <div className="relative w-full max-w-3xl">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center"><Icons.Search /></div>
                  <input 
                    type="text" className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white border border-gray-200 outline-none shadow-xl text-xl"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
        </div>

        {/* --- CATEGORY GRID (Always Visible) --- */}
        <div className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
               {categories.map((cat) => (
                 <button 
                   key={cat.id} 
                   onClick={() => setCategory(cat.id === category ? 'All' : cat.id)} 
                   className={`text-left p-8 rounded-[2rem] border-2 transition-all ${category === cat.id ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white shadow-sm'}`}
                 >
                    <div className="mb-6 inline-block p-4 rounded-2xl bg-gray-50">{cat.icon}</div>
                    <h4 className="text-xl font-extrabold text-gray-900 leading-tight">{cat.name}</h4>
                    <p className="text-sm font-semibold text-gray-400 mt-1">{cat.sub}</p>
                 </button>
               ))}
            </div>
        </div>

        {/* --- RESULTS AREA --- */}
        <div className="pb-32">
            <h2 className="text-3xl font-black text-gray-900 mb-8">{category === 'map' ? 'Live Navigation' : 'Results'}</h2>
            {category === 'map' ? (
                <div className="w-full h-[600px] bg-white rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                  <iframe width="100%" height="100%" frameBorder="0" src={`https://www.google.com/maps/embed/v1/place?key=API_KEY&q=Guwahati3{location.lat},${location.lng}&output=embed`} title="Map"></iframe>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                  {filteredServices.length > 0 ? filteredServices.map((s) => <ServiceCard key={s._id} service={s} />) : <p className="text-gray-400 italic">No services listed yet.</p>}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Main;