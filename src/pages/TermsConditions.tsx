import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Check, HelpCircle } from 'lucide-react';

const TermsConditions: React.FC = () => {
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
            Terms & <span className="gradient-text">Conditions</span>
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
              <FileText className="w-6 h-6 text-primary mr-2" />
              Introduction
            </h2>
            
            <p>
              These Terms and Conditions ("Terms") govern your use of the Mo-Library website and services operated by Mo-Library ("we," "us," or "our").
            </p>
            
            <p>
              By accessing or using our website and services, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the website or use our services.
            </p>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <Check className="w-6 h-6 text-primary mr-2" />
              Use of Services
            </h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Account Registration</h3>
            <p>
              To access certain features of our website and services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Account Responsibility</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account or password.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Seat Booking</h3>
            <p>
              When booking a seat through our services, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Provide accurate booking information</li>
              <li>Arrive on time for your booking</li>
              <li>Use the seat only for the duration of your booking</li>
              <li>Comply with all library rules and regulations</li>
              <li>Pay all applicable fees</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Prohibited Activities</h3>
            <p>
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Using the services for any illegal purpose or in violation of any local, state, national, or international law</li>
              <li>Harassing, threatening, or intimidating other users</li>
              <li>Interfering with or disrupting the services or servers or networks connected to the services</li>
              <li>Attempting to gain unauthorized access to any portion of the services</li>
              <li>Using the services in a manner that could damage, disable, overburden, or impair the services</li>
              <li>Using any robot, spider, or other automatic device to access the services</li>
            </ul>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-primary mr-2" />
              Intellectual Property
            </h2>
            
            <p>
              The website and its original content, features, and functionality are owned by Mo-Library and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            
            <h2 className="text-2xl font-bold my-6">Payment Terms</h2>
            
            <p>
              By booking a seat or purchasing a membership, you agree to pay all fees and charges associated with your account on a timely basis and in accordance with the rates in effect when the charges were incurred. You agree to provide us with accurate and complete billing information, including full name, address, state, zip code, telephone number, and valid payment method information.
            </p>
            
            <p>
              All payments are processed securely through our payment processor, Razorpay. By providing your payment information, you authorize us to charge your payment method for all fees incurred.
            </p>
            
            <h2 className="text-2xl font-bold my-6">Limitation of Liability</h2>
            
            <p>
              In no event shall Mo-Library, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your access to or use of or inability to access or use the services</li>
              <li>Any conduct or content of any third party on the services</li>
              <li>Any content obtained from the services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            
            <h2 className="text-2xl font-bold my-6">Indemnification</h2>
            
            <p>
              You agree to defend, indemnify, and hold harmless Mo-Library, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the services.
            </p>
            
            <h2 className="text-2xl font-bold my-6">Changes to Terms</h2>
            
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            
            <h2 className="text-2xl font-bold my-6">Governing Law</h2>
            
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <HelpCircle className="w-6 h-6 text-primary mr-2" />
              Contact Us
            </h2>
            
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>By email: terms@mo-library.com</li>
              <li>By phone: (+91) 8252228793</li>
              <li>By mail: Library CGU, Retang, Mahura, India</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsConditions;