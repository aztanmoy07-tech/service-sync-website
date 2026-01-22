iimport React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ✅ IMPORT THE NEW FILE
import Landing from './pages/Landing'; 

import Login from './pages/Login';
import Signup from './pages/Signup';
import AddService from './pages/AddService';
import DeveloperPanel from './pages/DeveloperPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50"> 
        <Routes>
          {/* ✅ USE LANDING COMPONENT */}
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