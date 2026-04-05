import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import SeatBooking from './pages/SeatBooking';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import Community from './pages/Community';
import BookSearch from './pages/BookSearch';
import BookRequest from './pages/BookRequest';
import BookDetails from './pages/BookDetails';
import MyReading from './pages/MyReading';
import LearningPaths from './pages/LearningPaths';
import LearningPathDetail from './pages/LearningPathDetail';
import Quiz from './pages/Quiz';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin-slow w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar session={session} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={!session ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
          <Route path="/reset-password" element={!session ? <ResetPassword /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/seat-booking" element={session ? <SeatBooking /> : <Navigate to="/login" />} />
          <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/admin" element={session ? <Admin /> : <Navigate to="/login" />} />
          <Route path="/community" element={session ? <Community /> : <Navigate to="/login" />} />
          <Route path="/book-search" element={session ? <BookSearch /> : <Navigate to="/login" />} />
          <Route path="/book/:id" element={session ? <BookDetails /> : <Navigate to="/login" />} />
          <Route path="/my-reading" element={session ? <MyReading /> : <Navigate to="/login" />} />
          <Route path="/learning-paths" element={session ? <LearningPaths /> : <Navigate to="/login" />} />
          <Route path="/learning-path/:id" element={session ? <LearningPathDetail /> : <Navigate to="/login" />} />
          <Route path="/quiz/:bookId" element={session ? <Quiz /> : <Navigate to="/login" />} />
          <Route path="/book-request" element={<BookRequest />} />
          
          {/* Legal and Info Pages */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;