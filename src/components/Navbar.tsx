import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Session } from "@supabase/supabase-js";
import { supabase, isAdmin } from "../lib/supabase";
import {
  BookOpen,
  Menu,
  X,
  LogOut,
  User,
  BookMarked,
  Shield,
  Home,
  LayoutDashboard,
  CalendarCheck,
} from "lucide-react";
import toast from "react-hot-toast";

interface NavbarProps {
  session: Session | null;
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (session) {
      const checkAdminStatus = async () => {
        const adminStatus = await isAdmin();
        setUserIsAdmin(adminStatus);
      };

      checkAdminStatus();
    } else {
      setUserIsAdmin(false);
    }
  }, [session]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-effect py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <BookOpen className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">Mo-Library</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
  <Link
    to="/"
    className="text-white hover:text-primary transition-colors flex items-center"
  >
    <Home className="w-4 h-4 mr-1" />
    Home
  </Link>
  {session ? (
    <>
      <Link
        to="/dashboard"
        className="text-white hover:text-primary transition-colors flex items-center"
      >
        <LayoutDashboard className="w-4 h-4 mr-1" />
        Dashboard
      </Link>
      <Link
        to="/seat-booking"
        className="text-white hover:text-primary transition-colors flex items-center"
      >
        <CalendarCheck className="w-4 h-4 mr-1" />
        Book a Seat
      </Link>
      {userIsAdmin && (
        <Link
          to="/admin"
          className="text-white hover:text-primary transition-colors flex items-center"
        >
          <Shield className="w-4 h-4 mr-1" />
          Admin
        </Link>
      )}
      <div className="flex items-center space-x-4">
        <Link
          to="/profile"
          className="flex items-center space-x-2 text-white hover:text-primary transition-colors"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-white hover:text-secondary transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  ) : (
    <div className="flex items-center space-x-4">
      <Link
        to="/login"
        className="px-4 py-2 rounded-md text-white hover:text-primary transition-colors"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="px-4 py-2 rounded-md gradient-bg text-white hover:opacity-90 transition-opacity"
      >
        Sign Up
      </Link>
    </div>
  )}
</div>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden glass-effect mt-2 py-4 px-4"
        >
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-white hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/seat-booking"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Book a Seat
                </Link>
                {userIsAdmin && (
                  <Link
                    to="/admin"
                    className="text-white hover:text-primary transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="text-left text-white hover:text-secondary transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
