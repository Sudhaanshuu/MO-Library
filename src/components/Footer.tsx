import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-effect mt-16 py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold gradient-text">Mo-Library</span>
            </div>
            <p className="text-gray-300 text-sm">
              A next-generation open library providing an accessible and interactive library experience.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.github.com/sudhaanshuu" className="text-gray-300 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.x.com/sudhan_shuu" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/sudhan.shuu/" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:sudhaanshuu@gmail.com" className="text-gray-300 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 gradient-text">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/seat-booking" className="text-gray-300 hover:text-primary transition-colors">
                  Book a Seat
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-primary transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 gradient-text">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  Library Catalog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  E-Books
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  Research Papers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  Academic Journals
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 gradient-text">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Library CGU</li>
              <li className="text-gray-300">Retang, Mahura</li>
              <li className="text-gray-300">sudhaanshuu@gmail.com</li>
              <li className="text-gray-300">(+91) 8252228793</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Mo-Library. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;