import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Service Sync Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // ✅ Uses the HTTPS URL for Render
  const API_URL = 'https://service-sync-website.onrender.com';

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // ✅ FIX: Explicitly sending as a JSON object with 'message' key
      const response = await axios.post(`${API_URL}/api/chat`, 
        { message: input },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessages(prev => [...prev, { text: response.data.reply, isBot: true }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble reaching the server. If I was asleep, please wait 30 seconds and try again.", 
        isBot: true,
        isError: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 z-50 shadow-2xl rounded-[2rem] overflow-hidden border border-gray-100 bg-white">
      {/* Header */}
      <div className="bg-gray-900 p-4 text-white flex items-center gap-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="font-black text-sm uppercase tracking-widest">Service Sync AI</h3>
      </div>

      {/* Chat Window */}
      <div className="h-[400px] overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[80%] p-3 rounded-2xl text-sm font-bold ${
            msg.isBot ? 'bg-white text-gray-800 self-start shadow-sm' : 'bg-blue-600 text-white self-end shadow-md'
          } ${msg.isError ? 'border-2 border-red-200 text-red-500' : ''}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="text-xs text-gray-400 font-bold italic animate-pulse">AI is thinking...</div>}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about services..."
          className="flex-1 bg-gray-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-gray-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </form>
    </div>
  );
};

export default ChatBot;