import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { loadStripe } from '@stripe/stripe-js';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

// --- CONFIGURATION ---
const mapContainerStyle = { width: '100%', height: '500px', borderRadius: '16px' };
const defaultCenter = { lat: 27.1, lng: 93.6 };
const libraries = ['places'];
const stripePromise = loadStripe("pk_test_51Srw3gCYXZCV9gzcWwggQFhB2O5aH9YurXeTXtGo7x43LJRS00496LGYDl7BGoDyluC8Stzl2Ln20FZJPyMBMl8S00gQurtACO"); 

const categories = [
  { id: 'emergency', label: 'Emergency', desc: 'Medical & Critical Aid', color: 'bg-red-500', icon: '⚡' },
  { id: 'student', label: 'Student Zone', desc: 'Hostels & Libraries', color: 'bg-blue-500', icon: '🎓' },
  { id: 'transport', label: 'Transport', desc: 'Taxi, Bus & Rentals', color: 'bg-green-500', icon: '🚗' },
  { id: 'shop', label: 'Shops', desc: 'Essentials & Electronics', color: 'bg-orange-500', icon: '🛒' },
  { id: 'hotel', label: 'Hotels', desc: 'Guest Houses & Rooms', color: 'bg-purple-500', icon: '🛏️' },
];

export default function Dashboard() {
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // --- 1. OPTIMIZED DATA FETCHING (Auto-Refresh every 3s) ---
  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/services');
      // Only update state if data is different to prevent unnecessary re-renders
      setServices(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(res.data)) {
          return res.data;
        }
        return prev;
      });
    } catch (err) {
      console.log("Polling Error (Low Priority)");
    }
  };

  useEffect(() => {
    fetchServices(); // Initial Fetch
    const interval = setInterval(fetchServices, 3000); // Poll every 3 seconds
    
    // Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // --- 2. INSTANT ITEM ADDITION (No Page Reload) ---
  const handleAddItem = async (e, serviceId) => {
    e.preventDefault();
    const name = e.target.itemName.value;
    const price = e.target.itemPrice.value;
    if(!name || !price) return;

    try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`/api/services/${serviceId}/items`, { name, price }, {
            headers: { 'x-auth-token': token }
        });

        // UPDATE STATE INSTANTLY (Optimistic UI)
        setServices(prevServices => 
            prevServices.map(s => s._id === serviceId ? res.data : s)
        );

        // Reset Form
        e.target.reset();
        
    } catch (err) {
        alert("Error adding item");
    }
  };

  const handleBooking = async (service) => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please Login to Book");
    const stripe = await stripePromise;
    const finalPrice = service.price || 99;
    try {
      const response = await axios.post("/api/create-checkout-session", {
        serviceId: service._id, serviceName: service.name, price: finalPrice 
      });
      const result = await stripe.redirectToCheckout({ sessionId: response.data.id });
      if (result.error) alert(result.error.message);
    } catch (err) { alert("Payment failed."); }
  };

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory ? s.category === activeCategory : true;
    return matchSearch && matchCat;
  });

  return (
    <LoadScript googleMapsApiKey="AIzaSyDrlMF5hsjpDxy8SME1OWyaoucC57kU4ZE" libraries={libraries}>
      <div className="bg-gray-50 min-h-screen font-sans text-gray-900 text-sm flex flex-col">
        
        {/* --- NAVBAR --- */}
        <div className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
            <div className="w-[98%] mx-auto py-3 flex justify-between items-center transition-all duration-300">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-black text-white font-bold w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm">S</div>
                    <span className="font-extrabold text-xl tracking-tight text-black">Survey Sync</span>
                </div>
                
                <div className="flex gap-4 text-xs font-bold uppercase tracking-wide items-center">
                    {!isLoggedIn ? (
                        <>
                            <button onClick={() => navigate('/login')} className="text-gray-900 bg-white border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition px-5 py-2 rounded-lg text-sm font-extrabold shadow-sm">Login</button>
                            <button onClick={() => navigate('/signup')} className="bg-black text-white border border-black px-5 py-2 rounded-lg hover:bg-gray-800 shadow-md transition text-sm font-extrabold">Sign Up</button>
                        </>
                    ) : (
                        <>
                            {userRole === 'developer' && <button onClick={() => navigate('/dev')} className="text-purple-800 hover:bg-purple-50 px-3 py-1.5 rounded transition font-bold">Dev Panel</button>}
                            {userRole === 'business' && <button onClick={() => navigate('/business-dashboard')} className="text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition font-bold">My Shop</button>}
                            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition font-bold">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-grow w-[98%] mx-auto pt-12 pb-24 transition-all duration-300">
            
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-black mb-3 tracking-tight">
                    Find Services <span className="text-blue-700">Near You</span>
                </h1>
                <p className="text-gray-600 text-sm max-w-2xl mx-auto font-medium leading-relaxed mb-6">
                    Instant access to emergency help, student resources, and local utilities.
                </p>

                {(userRole === 'developer' || userRole === 'business') && (
                    <button 
                        onClick={() => navigate('/add-service')}
                        className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 hover:scale-105 transition transform flex items-center gap-2 mx-auto"
                    >
                        <span>➕</span> Add New Service
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="relative mb-12 max-w-4xl mx-auto">
                <span className="absolute left-5 top-3 text-gray-500 text-lg">🔍</span>
                <input 
                  className="w-full bg-white border border-gray-300 rounded-full py-3 pl-14 pr-6 text-sm text-gray-900 placeholder-gray-500 font-medium shadow-sm outline-none focus:ring-2 focus:ring-black focus:border-black transition" 
                  placeholder="What are you looking for? (e.g. Taxi, Medical)" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
            </div>

            {/* --- MAP CARD --- */}
            <div className="mb-12">
                <div onClick={() => setIsMapExpanded(!isMapExpanded)} className={`w-full bg-white border border-dashed border-gray-400 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group hover:border-black hover:bg-gray-50 cursor-pointer ${isMapExpanded ? 'h-[500px] border-solid border-gray-300 shadow-xl' : 'h-40 hover:shadow-md'}`}>
                {!isMapExpanded ? (
                    <>
                    <div className="bg-gray-100 p-2.5 rounded-full mb-2 group-hover:scale-110 transition-transform text-black"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 7" /></svg></div>
                    <p className="text-black font-bold text-lg">View Area Map</p>
                    <p className="text-gray-600 text-xs font-medium mt-1">Click to expand visual map</p>
                    </>
                ) : (
                    <>
                    <GoogleMap mapContainerStyle={mapContainerStyle} center={userLocation || defaultCenter} zoom={14}>{userLocation && <Marker position={userLocation} />}</GoogleMap>
                    <button onClick={(e) => {e.stopPropagation(); setIsMapExpanded(false)}} className="absolute top-5 right-5 bg-white text-black text-xs px-4 py-1.5 rounded-full shadow-md font-bold hover:bg-gray-100 z-10 border border-gray-300">✕ Close Map</button>
                    </>
                )}
                </div>
            </div>

            {/* --- CATEGORIES --- */}
            <div className="mb-12">
                <h3 className="font-bold text-black text-sm uppercase tracking-wider mb-6 pl-3 border-l-4 border-black">Explore Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)} className={`flex flex-col items-center p-6 rounded-2xl border cursor-pointer transition-all hover:shadow-lg ${activeCategory === cat.id ? 'bg-gray-50 border-black ring-1 ring-black' : 'bg-white border-gray-200 hover:border-gray-500'}`}>
                            <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center text-white text-lg mb-3 shadow-sm`}>{cat.icon}</div>
                            <h3 className="font-bold text-black text-sm">{cat.label}</h3>
                            <p className="text-xs text-gray-600 text-center leading-relaxed mt-1 font-medium">{cat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- RESULTS SECTION --- */}
            {(activeCategory || searchTerm || filtered.length > 0) && (
                <div className="animate-fade-in-up">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-black text-xl">Available Services</h3>
                        <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{filtered.length} Results</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map(s => (
                            <div key={s._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-black transition-all duration-300 flex flex-col justify-between h-full relative">
                                
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-black text-xl">{s.name}</h4>
                                        <span className="bg-gray-100 text-gray-900 text-xs px-3 py-1 rounded-lg border border-gray-300 uppercase font-bold tracking-wide">{s.category}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-2 font-medium">📍 {s.location?.address || 'Nirjuli, AP'}</p>
                                    <p className="text-blue-800 font-bold text-sm mb-4">📞 {s.contact}</p>

                                    {/* DISPLAY ITEMS LIST */}
                                    {s.items && s.items.length > 0 && (
                                        <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                            <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Menu / Items</h5>
                                            <div className="space-y-1 max-h-24 overflow-y-auto">
                                                {s.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm text-gray-800">
                                                        <span>• {item.name}</span>
                                                        <span className="font-bold">₹{item.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                    {/* ADD ITEM FORM (Optimized: No Reload) */}
                                    {(userRole === 'developer' || userRole === 'business') && (
                                        <form 
                                            onSubmit={(e) => handleAddItem(e, s._id)} // <--- NEW HANDLER
                                            className="bg-gray-100 p-2 rounded-lg border border-dashed border-gray-300 flex gap-2"
                                        >
                                            <input name="itemName" placeholder="Item Name" className="w-full text-xs p-1 rounded border" required />
                                            <input name="itemPrice" placeholder="₹" type="number" className="w-12 text-xs p-1 rounded border" required />
                                            <button type="submit" className="bg-black text-white text-xs px-2 rounded hover:bg-green-600 transition">+</button>
                                        </form>
                                    )}

                                    {/* ACTION BUTTONS */}
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleBooking(s)} 
                                            className="flex-1 bg-black text-white py-2.5 rounded-lg font-bold text-xs shadow hover:bg-gray-800 transition"
                                        >
                                            Book Service
                                        </button>
                                        {(userRole === 'developer' || userRole === 'business') && (
                                            <button 
                                                onClick={() => navigate(`/edit-service/${s._id}`)} 
                                                className="bg-gray-200 text-black px-3 py-2 rounded-lg font-bold text-xs hover:bg-gray-300 transition"
                                            >
                                                ✏️
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <ChatBot />
        <Footer />
      </div>
    </LoadScript>
  );
}