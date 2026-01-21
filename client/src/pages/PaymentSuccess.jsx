import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-center font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-sm w-full animate-fade-in-up">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Thank you for your payment. Your service has been successfully booked.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}