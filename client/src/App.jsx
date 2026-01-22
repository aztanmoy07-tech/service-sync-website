import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';        // ✅ Replaces 'Dashboard'
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddService from './pages/AddService';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50"> 
        <Routes>
          {/* Main Feed / Home Page (Where services are listed) */}
          <Route path="/" element={<Home />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Business Route */}
          <Route path="/add-service" element={<AddService />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;