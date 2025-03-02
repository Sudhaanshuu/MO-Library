import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
            Privacy <span className="gradient-text">Policy</span>
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
              <Shield className="w-6 h-6 text-primary mr-2" />
              Introduction
            </h2>
            
            <p>
              Mo-Library ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.
            </p>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <Lock className="w-6 h-6 text-primary mr-2" />
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Personal Data</h3>
            <p>
              We may collect personal identification information from you in a variety of ways, including, but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>When you register on our site</li>
              <li>When you book a seat or service</li>
              <li>When you subscribe to our newsletter</li>
              <li>When you respond to a survey</li>
              <li>When you fill out a form</li>
            </ul>
            
            <p>
              The personal information we collect may include your name, email address, phone number, billing address, credit card information, and other information you provide to us.
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Usage Data</h3>
            <p>
              We may also collect information on how the website is accessed and used. This usage data may include information such as your computer's Internet Protocol (IP) address, browser type, browser version, the pages of our website that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
            </p>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <Eye className="w-6 h-6 text-primary mr-2" />
              How We Use Your Information
            </h2>
            
            <p>
              We may use the information we collect from you for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To allow you to participate in interactive features of our services</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our services</li>
              <li>To monitor the usage of our services</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To process payments and refunds</li>
              <li>To send you promotional emails about new products, special offers, or other information which we think you may find interesting</li>
            </ul>
            
            <h2 className="text-2xl font-bold my-6 flex items-center">
              <FileText className="w-6 h-6 text-primary mr-2" />
              Disclosure of Your Information
            </h2>
            
            <p>
              We may disclose your personal information in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
              <li><strong>To Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
              <li><strong>To Business Partners:</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
              <li><strong>To Service Providers:</strong> We may share your information with service providers to perform services on our behalf.</li>
              <li><strong>For Legal Purposes:</strong> We may disclose your information where required to do so by law or subpoena.</li>
            </ul>
            
            <h2 className="text-2xl font-bold my-6">Security of Your Information</h2>
            
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
            
            <h2 className="text-2xl font-bold my-6">Your Rights</h2>
            
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Access and receive a copy of the personal data we hold about you</li>
              <li>Rectify any personal data held about you that is inaccurate</li>
              <li>Request the deletion of personal data held about you</li>
              <li>Restrict the processing of your personal data</li>
              <li>Object to the processing of your personal data</li>
              <li>Request the transfer of your personal data to another person or entity</li>
            </ul>
            
            <h2 className="text-2xl font-bold my-6">Changes to This Privacy Policy</h2>
            
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
            
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
            
            <h2 className="text-2xl font-bold my-6">Contact Us</h2>
            
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>By email: privacy@mo-library.com</li>
              <li>By phone: (+91) 8252228793</li>
              <li>By mail: Library CGU, Retang, Mahura, India</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
