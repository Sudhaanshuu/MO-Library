import React from 'react';
import { BookOpen, Brain, Rocket, Clock, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text animate-gradient">
                Welcome to the Future
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of learning in our state-of-the-art digital library.
              Reserve your spot in our innovative study spaces.
            </p>
            
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                to="/seats"
                className="px-8 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all"
              >
                Book a Seat
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-lg bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-medium transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Digital Collection',
                description: 'Access millions of digital resources instantly with our AI-powered search system',
              },
              {
                icon: Brain,
                title: 'Smart Spaces',
                description: 'AI-powered study environments that adapt to your learning style',
              },
              {
                icon: Rocket,
                title: 'Future Ready',
                description: 'Stay ahead with cutting-edge facilities and advanced learning tools',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg bg-black/50 border border-purple-500/20 backdrop-blur-lg hover:border-purple-500/40 transition-all"
              >
                <feature.icon className="h-12 w-12 text-purple-500 mx-auto" />
                <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              Why Choose Neo Library?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: '24/7 Access',
                  description: 'Study anytime with our round-the-clock facility access',
                },
                {
                  icon: Users,
                  title: 'Community',
                  description: 'Join a vibrant community of learners and innovators',
                },
                {
                  icon: Shield,
                  title: 'Secure Space',
                  description: 'Advanced security systems for your peace of mind',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start space-x-4 p-6 rounded-lg bg-black/30 border border-purple-500/10 backdrop-blur-sm"
                >
                  <feature.icon className="h-6 w-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-1 text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};