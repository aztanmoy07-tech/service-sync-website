import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ✅ Pages
import Main from './pages/Main'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddService from './pages/AddService';
import DeveloperPanel from './pages/DeveloperPanel';

// ✅ RESTORE CHATBOT
import ChatBot from './components/ChatBot'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative"> 
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/dev" element={<DeveloperPanel />} />
        </Routes>

        {/* ✅ CHATBOT IS BACK */}
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;