import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Globe } from 'lucide-react';

const AboutUs: React.FC = () => {
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
            About <span className="gradient-text">Mo-Library</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Reimagining the library experience for the digital age
          </motion.p>
        </div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect p-8 rounded-xl mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-300 mb-4">
                Mo-Library was founded in 2023 with a vision to transform the traditional library experience. 
              </p>
              <p className="text-gray-300">
                Our team of technologists, librarians, and designers came together to create a space that combines the timeless value of libraries with cutting-edge technology.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-[300px] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1170&q=80"
                  alt="Modern Library Interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-8 rounded-xl mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Our Mission</h2>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
            To create accessible, innovative spaces where knowledge, technology, and community converge.
          </p>
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              icon: <Users className="w-6 h-6 text-white" />, 
              title: "Inclusivity", 
              desc: "We believe knowledge should be accessible to everyone."
            }, {
              icon: <Lightbulb className="w-6 h-6 text-white" />, 
              title: "Innovation", 
              desc: "We explore new technologies to enhance the library experience."
            }, {
              icon: <Globe className="w-6 h-6 text-white" />, 
              title: "Community", 
              desc: "We foster connections where ideas can flourish."
            }].map((value, index) => (
              <div key={index} className="glass-effect p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="text-white">
              <h3 className="text-3xl font-bold">50,000+</h3>
              <p className="text-gray-300">Books Digitized</p>
            </div>
            <div className="text-white">
              <h3 className="text-3xl font-bold">10,000+</h3>
              <p className="text-gray-300">Active Users</p>
            </div>
            <div className="text-white">
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-gray-300">Events Hosted</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
