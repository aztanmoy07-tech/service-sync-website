import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0f1420] text-gray-400 py-10 mt-10 rounded-t-[30px]">
      <div className="max-w-md mx-auto px-8">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-600 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-lg">S</div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            service <span className="font-light">sync</span>
          </h2>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-8">
          Connecting you with essential services, emergency contacts, and local resources instantly.
        </p>
        
        {/* Links */}
        <div className="mb-8">
          <h3 className="text-white font-medium mb-4">Quick Links</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-3 hover:text-white transition cursor-pointer">
              <span className="border border-gray-600 rounded-full p-1">ℹ️</span> About Service Sync
            </li>
            <li className="flex items-center gap-3 hover:text-white transition cursor-pointer">
              <span className="border border-gray-600 rounded-full p-1">📞</span> Contact Us
            </li>
            <li className="flex items-center gap-3 hover:text-white transition cursor-pointer">
              <span className="border border-gray-600 rounded-full p-1">🛡️</span> Privacy Policy
            </li>
          </ul>
        </div>

        {/* Connect Section */}
        <div>
           <h3 className="text-white font-medium mb-2">Connect</h3>
           {/* Add social icons here if needed */}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-[10px] text-gray-600">
          &copy; 2024 Service Sync. All rights reserved.
        </div>
      </div>
    </footer>
  );
}