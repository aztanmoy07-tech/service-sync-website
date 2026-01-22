import React from 'react';
import axios from 'axios';

const ServiceCard = ({ service, refreshData }) => {
  // 1. Get current user data from storage
  const currentUserId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');

  // 2. Logic: Show delete if user is a 'developer' OR they own this service
  const canDelete = userRole === 'developer' || service.owner === currentUserId;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await axios.delete(`https://service-sync-website.onrender.com/api/services/${service._id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      alert("Service deleted successfully");
      if (refreshData) refreshData(); // Call this to refresh the main list
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || "Could not delete"));
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all relative">
      {/* Verification Badge (if you have it) */}
      {service.isVerified && (
        <span className="absolute top-4 right-4 text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-xs font-black">
          ✓ Verified
        </span>
      )}

      <h3 className="text-xl font-black text-gray-900 mb-2">{service.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{service.description}</p>
      
      <div className="flex justify-between items-center mt-6">
        <span className="text-lg font-black text-blue-600">₹{service.price}</span>
        
        <div className="flex gap-2">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold">Details</button>
          
          {/* ✅ CONDITIONAL DELETE BUTTON */}
          {canDelete && (
            <button 
              onClick={handleDelete}
              className="bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
              title="Delete Service"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;