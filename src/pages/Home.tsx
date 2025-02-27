import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, BookMarked, Search, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Clock className="w-10 h-10 text-primary" />,
      title: 'Flexible Hours',
      description: 'Book a seat for as long as you need, with options for short visits or extended study sessions.',
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: 'Community Space',
      description: 'Connect with fellow readers and researchers in our collaborative environment.',
    },
    {
      icon: <BookMarked className="w-10 h-10 text-primary" />,
      title: 'Digital Catalog',
      description: 'Access thousands of e-books and digital resources from your seat.',
    },
    {
      icon: <Search className="w-10 h-10 text-primary" />,
      title: 'Smart Search',
      description: 'Find exactly what you need with our advanced search system.',
    },
    {
      icon: <Zap className="w-10 h-10 text-primary" />,
      title: 'Fast Wi-Fi',
      description: 'Stay connected with high-speed internet throughout the library.',
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Welcome to the <span className="gradient-text">Future</span> of Libraries
              </h1>
              <p className="text-xl text-gray-300">
                Mo-Library reimagines the traditional library experience with cutting-edge technology and a focus on
                community.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/seat-booking"
                  className="px-6 py-3 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors text-center"
                >
                  Book a Seat
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                  alt="Modern Library"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              </div>
              <motion.div
                className="absolute -bottom-6 -right-6 glass-effect p-4 rounded-lg neon-shadow"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium">30 seats available now</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Experience the <span className="gradient-text">Next Generation</span> Library
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Discover our innovative features designed to enhance your library experience
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-effect p-6 rounded-xl hover:neon-shadow transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seat Booking Preview */}
      <section className="py-20 bg-background-light">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Reserve Your <span className="gradient-text">Perfect Spot</span>
              </h2>
              <p className="text-xl text-gray-300">
                Our intuitive seat booking system lets you choose the ideal location for your needs, whether you're
                studying, researching, or just enjoying a good book.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Book for the next 2 or 4 hours with one click</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Set custom start and end times</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>See real-time seat availability</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Manage your bookings from your dashboard</span>
                </li>
              </ul>
              <div>
                <Link
                  to="/seat-booking"
                  className="px-6 py-3 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity inline-block"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-effect p-6 rounded-xl neon-shadow">
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`seat ${
                        i % 3 === 0 ? 'booked' : i % 7 === 0 ? 'your-booking' : 'available'
                      } w-12 h-12 rounded-md flex items-center justify-center text-sm`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm seat available"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm seat booked"></div>
                      <span className="text-sm">Booked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-sm seat your-booking"></div>
                      <span className="text-sm">Your Booking</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-effect p-12 rounded-xl text-center max-w-4xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full filter blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience the <span className="gradient-text">Future of Libraries?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join Mo-Library today and discover a new way to learn, research, and connect.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="px-8 py-3 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Sign Up Now
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;