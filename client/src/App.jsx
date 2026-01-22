import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ✅ IMPORT THE NEW FILE NAME
import Landing from './pages/Landing'; 

import Login from './pages/Login';
import Signup from './pages/Signup';
import AddService from './pages/AddService';
import DeveloperPanel from './pages/DeveloperPanel'; // ensuring this is here if you need it

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50"> 
        <Routes>
          {/* ✅ USE THE NEW COMPONENT */}
          <Route path="/" element={<Landing />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/dev" element={<DeveloperPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;