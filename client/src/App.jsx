import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './pages/Main'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddService from './pages/AddService';
import EditService from './pages/EditService'; // ✅ ADDED: Import Edit Page
import DeveloperPanel from './pages/DeveloperPanel';

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
          
          {/* ✅ ADDED: The Route for Editing Services */}
          <Route path="/edit-service/:id" element={<EditService />} />
          
          <Route path="/dev" element={<DeveloperPanel />} />
        </Routes>

        <ChatBot />
      </div>
    </Router>
  );
}

export default App;