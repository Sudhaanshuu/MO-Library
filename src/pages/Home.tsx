import React from 'react';
import { Library, Clock, Users, Shield, Wifi, Coffee, Moon, Sun, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-primary-400" />,
      title: 'Smart Reservations',
      description: 'AI-powered seat allocation with 6-hour smart booking system.',
    },
    {
      icon: <Wifi className="h-8 w-8 text-primary-400" />,
      title: 'Quantum-Speed Internet',
      description: 'Ultra-fast 1Gbps fiber connection for seamless connectivity.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary-400" />,
      title: 'Ergonomic Pods',
      description: 'Next-gen seating with ambient lighting and climate control.',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-400" />,
      title: 'Biometric Security',
      description: 'Advanced facial recognition and fingerprint access control.',
    },
    {
      icon: <Coffee className="h-8 w-8 text-primary-400" />,
      title: 'Smart Refreshments',
      description: 'IoT-enabled coffee machines and water dispensers.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-400" />,
      title: 'Power Stations',
      description: 'Wireless charging integrated into every workspace.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/90 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-primary-400">
              Welcome to the Future of Learning
            </h1>
            <p className="text-2xl mb-8 text-primary-200">
              Experience the next generation of study spaces in Bhubaneswar
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary-500/25"
            >
              Book Your Pod Now
              <Zap className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary-200">
            Next-Gen Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-primary-800/50 to-primary-900/50 backdrop-blur-lg border border-primary-700/50 hover:border-primary-600/50 transform hover:scale-105 transition-all duration-200"
              >
                <div className="mb-4 p-3 rounded-full bg-primary-800/50 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary-200">
                  {feature.title}
                </h3>
                <p className="text-primary-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-primary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Users />, value: '5000+', label: 'Active Members' },
              { icon: <Clock />, value: '24/7', label: 'Access' },
              { icon: <Wifi />, value: '1Gbps', label: 'Internet Speed' },
              { icon: <Moon />, value: '100%', label: 'Satisfaction' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-primary-800/30 border border-primary-700/30"
              >
                <div className="flex justify-center mb-4 text-primary-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary-200 mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Parallax */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3')] bg-cover bg-fixed opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary-200">
                The Future is Here
              </h2>
              <p className="text-primary-300 mb-4">
                MoLibrary represents the convergence of traditional learning spaces and
                cutting-edge technology. Our facility features state-of-the-art study pods,
                each equipped with smart environmental controls, integrated power solutions,
                and ergonomic furniture designed for maximum comfort and productivity.
              </p>
              <p className="text-primary-300">
                Experience the future of learning with our AI-powered seat allocation
                system, biometric security, and IoT-enabled amenities. Whether you're a
                student, professional, or researcher, MoLibrary provides the perfect
                environment for focused work and collaborative learning.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-400/20 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3"
                alt="Library Interior"
                className="rounded-2xl shadow-2xl relative z-10 transform -rotate-3 hover:rotate-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}