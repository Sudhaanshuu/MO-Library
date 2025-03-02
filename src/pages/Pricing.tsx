import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Calendar, CreditCard, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Our <span className="gradient-text">Pricing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Flexible options to meet your needs
          </motion.p>
        </div>

        {/* Seat Booking Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect p-8 rounded-xl mb-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Seat Booking Rates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background-light p-6 rounded-xl border border-gray-700 hover:border-primary transition-colors">
              <div className="text-center mb-6">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">Hourly Rate</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹60</span>
                  <span className="text-gray-300 ml-2">/ hour</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Flexible booking duration</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to high-speed Wi-Fi</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Power outlets at every seat</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Quiet study environment</span>
                </li>
              </ul>
              
              <div className="text-center">
                <Link
                  to="/seat-booking"
                  className="px-6 py-2 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors inline-block"
                >
                  Book Now
                </Link>
              </div>
            </div>
            
            <div className="bg-background-light p-6 rounded-xl border-2 border-primary relative transform hover:scale-105 transition-transform">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              
              <div className="text-center mb-6">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">Day Pass</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹400</span>
                  <span className="text-gray-300 ml-2">/ day</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Full day access (up to 8 hours)</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to high-speed Wi-Fi</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Power outlets at every seat</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Quiet study environment</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Complimentary coffee/tea</span>
                </li>
              </ul>
              
              <div className="text-center">
                <Link
                  to="/seat-booking"
                  className="px-6 py-2 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity inline-block"
                >
                  Book Now
                </Link>
              </div>
            </div>
            
            <div className="bg-background-light p-6 rounded-xl border border-gray-700 hover:border-primary transition-colors">
              <div className="text-center mb-6">
                <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">Weekly Pass</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹2,000</span>
                  <span className="text-gray-300 ml-2">/ week</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>7 consecutive days access</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 8 hours per day</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to high-speed Wi-Fi</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Power outlets at every seat</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Quiet study environment</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Complimentary coffee/tea</span>
                </li>
              </ul>
              
              <div className="text-center">
                <Link
                  to="/seat-booking"
                  className="px-6 py-2 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors inline-block"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Membership Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-8 rounded-xl mb-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Membership Plans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background-light p-6 rounded-xl border border-gray-700 hover:border-primary transition-colors">
              <div className="text-center mb-6">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">Basic</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹999</span>
                  <span className="text-gray-300 ml-2">/ month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>10 hours of seat booking per month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to digital resources</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Borrow up to 5 books at a time</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Wi-Fi access</span>
                </li>
              </ul>
              
              <div className="text-center">
                <Link
                  to="/signup"
                  className="px-6 py-2 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors inline-block"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            <div className="bg-background-light p-6 rounded-xl border-2 border-primary relative transform hover:scale-105 transition-transform">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Best Value
              </div>
              
              <div className="text-center mb-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">Premium</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹1,999</span>
                  <span className="text-gray-300 ml-2">/ month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>30 hours of seat booking per month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to all digital resources</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Borrow up to 10 books at a time</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority seat booking</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to premium study rooms</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Complimentary refreshments</span>
                </li>
              </ul>
              
              <div className="text-center">
                <Link
                  to="/signup"
                  className="px-6 py-2 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity inline-block"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            <div className="bg-background-light p-6 rounded-xl border border-gray-700 hover:border-primary transition-colors">
              <div className="text-center mb-6">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">Annual</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹19,999</span>
                  <span className="text-gray-300 ml-2">/ year</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>All Premium benefits</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Save ₹3,989 compared to monthly</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>50 hours of seat booking per month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Exclusive access to events</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Personal librarian assistance</span>
                </li>
              </ul>
              
              <div className="text-center">
                <Link
                  to="/signup"
                  className="px-6 py-2 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors inline-block"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Group & Corporate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-8 rounded-xl mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Group & Corporate Plans</h2>
          <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
            We offer special rates for groups, schools, and corporate teams. Contact us for customized packages tailored to your organization's needs.
          </p>
          
          <div className="text-center">
            <Link
              to="/contact-us"
              className="px-8 py-3 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity inline-block"
            >
              Contact for Group Rates
            </Link>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-background-light rounded-lg">
              <h3 className="text-lg font-medium mb-2">Can I cancel my booking?</h3>
              <p className="text-gray-300">
                Yes, you can cancel your booking up to 1 hour before the scheduled start time for a full refund.
              </p>
            </div>
            
            <div className="p-4 bg-background-light rounded-lg">
              <h3 className="text-lg font-medium mb-2">Are there any hidden fees?</h3>
              <p className="text-gray-300">
                No, all our prices are transparent and include all amenities mentioned. There are no additional charges.
              </p>
            </div>
            
            <div className="p-4 bg-background-light rounded-lg">
              <h3 className="text-lg font-medium mb-2">Can I upgrade my membership?</h3>
              <p className="text-gray-300">
                Yes, you can upgrade your membership at any time. The price difference will be prorated for the remaining period.
              </p>
            </div>
            
            <div className="p-4 bg-background-light rounded-lg">
              <h3 className="text-lg font-medium mb-2">Do you offer student discounts?</h3>
              <p className="text-gray-300">
                Yes, we offer a 15% discount for students with a valid student ID. Contact us for more information.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;