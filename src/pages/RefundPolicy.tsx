import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, DollarSign, Calendar, Clock, HelpCircle } from 'lucide-react';

const RefundPolicy: React.FC = () => {
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
            Refund <span className="gradient-text">Policy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Last updated: June 15, 2025
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect p-8 rounded-xl mb-12"
        >
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <RefreshCw className="w-6 h-6 text-primary mr-2" />
              Refund Policy Overview
            </h2>
            
            <p>
              At Mo-Library, we strive to ensure your complete satisfaction with our services. This Refund Policy outlines the terms and conditions for refunds related to seat bookings and membership plans.
            </p>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <Calendar className="w-6 h-6 text-primary mr-2" />
              Seat Booking Cancellations and Refunds
            </h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Cancellation Timeframes</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>More than 1 hour before start time:</strong> Full refund (100%)</li>
              <li><strong>Less than 1 hour before start time:</strong> No refund</li>
              <li><strong>After booking start time:</strong> No refund</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">How to Cancel a Booking</h3>
            <p>
              To cancel a booking and request a refund:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Log in to your Mo-Library account</li>
              <li>Navigate to the Dashboard section</li>
              <li>Find the booking you wish to cancel</li>
              <li>Click the "Cancel" button next to the booking</li>
              <li>Confirm the cancellation when prompted</li>
            </ol>
            
            <p>
              Refunds will be processed automatically to the original payment method used for the booking.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Special Circumstances</h3>
            <p>
              In case of unexpected library closures, technical issues, or other circumstances beyond your control that prevent you from using your booking, please contact our customer support team for assistance. We will evaluate these situations on a case-by-case basis.
            </p>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <DollarSign className="w-6 h-6 text-primary mr-2" />
              Membership Plan Refunds
            </h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Monthly Memberships</h3>
            <p>
              For monthly membership plans:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Within 7 days of purchase:</strong> Full refund if no services have been used</li>
              <li><strong>After 7 days or if services have been used:</strong> No refund</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Annual Memberships</h3>
            <p>
              For annual membership plans:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Within 14 days of purchase:</strong> Full refund if no services have been used</li>
              <li><strong>After 14 days but within 30 days:</strong> Partial refund (prorated minus a 10% administrative fee)</li>
              <li><strong>After 30 days:</strong> No refund</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">How to Request a Membership Refund</h3>
            <p>
              To request a refund for a membership plan:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Contact our customer support team at refunds@mo-library.com</li>
              <li>Include your full name, email address, and membership details</li>
              <li>Explain the reason for your refund request</li>
              <li>Our team will review your request and respond within 2 business days</li>
            </ol>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <Clock className="w-6 h-6 text-primary mr-2" />
              Refund Processing Time
            </h2>
            
            <p>
              Once a refund is approved:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Credit/Debit Card refunds: 5-10 business days</li>
              <li>UPI/Net Banking refunds: 3-7 business days</li>
              <li>Wallet refunds: 1-3 business days</li>
            </ul>
            
            <p>
              Please note that while we process refunds promptly, the actual time it takes for the refund to appear in your account depends on your payment provider's policies and processing times.
            </p>
            
            <h2 className="text-2xl font-bold my-6">Non-Refundable Items</h2>
            
            <p>
              The following are not eligible for refunds:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Promotional or discounted bookings marked as non-refundable</li>
              <li>Booking fees and service charges</li>
              <li>Membership plans after the specified refund period</li>
              <li>No-shows for confirmed bookings</li>
            </ul>
            
            <h2 className="text-2xl font-bold my-6">Modifications to This Policy</h2>
            
            <p>
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to our website. It is your responsibility to review this Refund Policy periodically for changes.
            </p>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <HelpCircle className="w-6 h-6 text-primary mr-2" />
              Contact Us
            </h2>
            
            <p>
              If you have any questions about our Refund Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>By email: refunds@mo-library.com</li>
              <li>By phone: (+91) 8252228793</li>
              <li>By mail: Library CGU, Retang, Mahura, India</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;