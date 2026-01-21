import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddService from './pages/AddService'; // <--- MAKE SURE THIS FILE EXISTS
import EditService from './pages/EditService'; // <--- OPTIONAL IF YOU HAVE IT

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes (Business/Dev) */}
        <Route path="/add-service" element={<AddService />} />
        
        {/* Optional: Edit Route (Create this file if you haven't yet) */}
        {/* <Route path="/edit-service/:id" element={<EditService />} /> */}
      </Routes>
    </Router>
  );
}

export default App;