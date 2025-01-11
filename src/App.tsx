import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Auth } from './components/Auth';
import { SeatBooking } from './components/SeatBooking';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/seats" element={<SeatBooking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;