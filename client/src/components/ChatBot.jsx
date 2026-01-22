import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, X, MessageSquare } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your Survey Sync assistant. Ask me about services, emergency contacts, or navigation!' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Pointing to your new backend route
      const response = await axios.post('https://service-sync-website.onrender.com/api/chat', { 
        message: input 
      });

      // Match the "reply" key from your server.js
      const botMessage = { role: 'bot', text: response.data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting right now. Try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 p-4 rounded-full shadow-lg text-white hover:bg-blue-700 transition">
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="bg-zinc-900 w-[400px] h-[600px] rounded-2xl shadow-2xl flex flex-col border border-zinc-700 overflow-hidden">
          {/* Header */}
          <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Survey Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-white ${
                  msg.role === 'user' ? 'bg-blue-600' : 'bg-zinc-800 border border-zinc-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-zinc-400 text-sm animate-pulse ml-2">Assistant is thinking...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-zinc-800 border-t border-zinc-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for help..."
              className="flex-1 bg-zinc-700 text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;