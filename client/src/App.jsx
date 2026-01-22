import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ✅ WE ARE IMPORTING MAIN NOW (NOT HOME)
import Main from './pages/Main'; 

import Login from './pages/Login';
import Signup from './pages/Signup';
import AddService from './pages/AddService';
import DeveloperPanel from './pages/DeveloperPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50"> 
        <Routes>
          {/* ✅ USING MAIN COMPONENT */}
          <Route path="/" element={<Main />} />
          
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