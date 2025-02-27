import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect p-8 rounded-xl w-full max-w-md relative z-10 text-center"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block"
        >
          <BookOpen className="w-16 h-16 text-primary mx-auto" />
        </motion.div>
        
        <h1 className="text-6xl font-bold mt-6 gradient-text">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-gray-300 mt-2 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link
            to="/"
            className="px-6 py-2 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
          <Link
            to="/"
            className="px-6 py-2 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors flex items-center justify-center"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-400">
          <p>Lost in the library? Don't worry, even the best readers get lost sometimes.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;