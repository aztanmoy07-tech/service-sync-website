import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false); // ✅ Toggles window open/close
  
  // Define initial message separately so we can restore it easily
  const initialMessage = { text: "Hello! I'm your Service Sync Assistant. How can I help you today?", isBot: true };
  
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const API_URL = 'https://service-sync-website.onrender.com';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ✅ NEW: Function to clear chat history
  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
        setMessages([initialMessage]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, 
        { message: input },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token') 
          } 
        }
      );
      setMessages(prev => [...prev, { text: response.data.reply, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Connection trouble. Please try again.", isBot: true, isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* --- CHAT WINDOW (Only shows if isOpen is true) --- */}
      {isOpen && (
        <div className="w-80 md:w-96 mb-4 shadow-2xl rounded-[2rem] overflow-hidden border border-gray-100 bg-white animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="font-black text-xs uppercase tracking-widest">Service Sync AI</h3>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
                {/* ✅ NEW: Trash/Clear Button */}
                <button 
                    onClick={clearChat} 
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    title="Clear Chat History"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>

                {/* Close Button */}
                <button onClick={() => setIsOpen(false)} className="hover:text-gray-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="h-80 md:h-[400px] overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.isBot 
                  ? 'bg-white text-black font-semibold self-start border border-gray-100' // ✅ Black Font Fix
                  : 'bg-blue-600 text-white font-bold self-end'
              }`}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-gray-400 font-black uppercase ml-2 animate-bounce">AI is typing...</div>}
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-100 p-3 rounded-xl text-sm outline-none text-black"
            />
            <button type="submit" className="bg-gray-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      )}

      {/* --- TOGGLE BUTTON (The Floating Bubble) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white"
      >
        {isOpen ? (
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot;