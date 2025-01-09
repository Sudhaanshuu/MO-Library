import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Library, LogOut, User } from 'lucide-react';

export function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Library className="h-8 w-8" />
                <span className="text-xl font-bold">MoLibrary</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/booking"
                    className="text-white hover:text-primary-200"
                  >
                    Book Seat
                  </Link>
                  {user.is_admin && (
                    <Link
                      to="/admin"
                      className="text-white hover:text-primary-200"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={signOut}
                    className="flex items-center space-x-1 text-white hover:text-primary-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-white hover:text-primary-200"
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>

      <footer className="bg-primary-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p>MoLibrary</p>
              <p>123 Knowledge Street</p>
              <p>Bhubaneswar, Odisha</p>
              <p>India</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-primary-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="hover:text-primary-200">
                    Book a Seat
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.40927239851!2d85.7669655!3d20.2960587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1709893047983!5m2!1sen!2sin"
                className="w-full h-48 rounded-lg"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; 2024 MoLibrary. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}