import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      
      {/* Decorative Gradient Background (Subtle) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

      {/* Header: Category Badge, Name, Price */}
      <div className="flex justify-between items-start mb-4 mt-2">
        <div>
           <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full mb-2">
            {service.category}
           </span>
           <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1" title={service.name}>
             {service.name}
           </h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">₹{service.price || '99'}</p>
        </div>
      </div>
      
      {/* Body: Location & Contact Details with Icons */}
      <div className="space-y-3 text-gray-500 mb-6">
        <p className="flex items-start text-sm gap-2">
          {/* Location Icon */}
          <svg className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span className="line-clamp-2">{service.location?.address || 'Location unavailable'}</span>
        </p>
        <p className="flex items-center text-sm gap-2">
          {/* Phone Icon */}
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          {service.contact}
        </p>
      </div>

      {/* Footer: Action Button */}
      <a 
        href={`tel:${service.contact}`}
        className="block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-transform duration-200 active:scale-95 shadow-lg flex items-center justify-center gap-2"
      >
        <span>Contact Now</span>
        {/* Arrow Icon */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </a>
    </div>
  );
};

export default ServiceCard;