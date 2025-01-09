import React from 'react';
import { Library, Clock, Users, Shield } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-primary-600" />,
      title: '6-Hour Reservations',
      description: 'Book your preferred seat for up to 6 hours, ensuring a dedicated study space.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Spacious Seating',
      description: '50 comfortable seats arranged in a modern layout for optimal studying experience.',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Secure Environment',
      description: 'Safe and monitored study space with controlled access.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to MoLibrary</h1>
            <p className="text-xl mb-8">Your Modern Study Space in Bhubaneswar</p>
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3"
              alt="Library"
              className="rounded-lg shadow-xl mx-auto max-w-4xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MoLibrary?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About Our Library</h2>
              <p className="text-gray-600 mb-4">
                MoLibrary is Bhubaneswar's premier modern library space, designed for students,
                professionals, and anyone seeking a quiet place to study or work. Our facility
                offers 50 well-maintained seats, high-speed internet, and a peaceful environment
                conducive to learning and productivity.
              </p>
              <p className="text-gray-600">
                With our innovative seat booking system, you can reserve your preferred spot
                in advance, ensuring you always have a place to study when you need it.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3"
                alt="Library Interior"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}