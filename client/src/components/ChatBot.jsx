import React, { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Service Sync assistant. How can I help you find a service today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Verified Backend URL
  const API_URL = 'https://service-sync-website.onrender.com';

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // ✅ Added explicit headers and timeout to fix connection issues
      const res = await axios.post(
        `${API_URL}/api/chat`, 
        { message: input },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 seconds
        }
      );
      
      const botMsg = { text: res.data.reply, isBot: true };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot Connection Error:", err);
      setMessages((prev) => [...prev, { 
        text: "I'm having trouble reaching the server. Please ensure the backend is active.", 
        isBot: true 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          <div className="bg-blue-600 p-4 flex justify-between items-center">
            <h3 className="text-white font-bold">Service Sync Bot 🤖</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">✕</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                {/* ✅ FONT COLOR FIXED: Bot messages are now text-black */}
                <div className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm ${
                  msg.isBot 
                    ? 'bg-white border border-gray-200 text-black font-medium' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-xs ml-2 animate-pulse">Bot is typing...</div>}
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition">➤</button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        className="bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
      </button>
    </div>
  );
};

export default ChatBot;