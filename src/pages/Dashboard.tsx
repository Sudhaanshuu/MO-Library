import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { BookOpen, Calendar, Clock, MapPin, BookMarked, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import type { Booking, Profile } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not found');
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch bookings with seat information
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            seat:seats(*)
          `)
          .eq('user_id', user.id)
          .order('start_time', { ascending: true });
        
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update the bookings state
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin-slow w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
            Welcome to Your <span className="gradient-text">Dashboard</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Manage your library experience and bookings all in one place
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile?.full_name || 'User'}</h2>
                <p className="text-gray-300">{profile?.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/seat-booking"
                    className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg flex flex-col items-center justify-center transition-colors"
                  >
                    <Calendar className="w-6 h-6 text-primary mb-2" />
                    <span className="text-sm">Book a Seat</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg flex flex-col items-center justify-center transition-colors"
                  >
                    <BookMarked className="w-6 h-6 text-primary mb-2" />
                    <span className="text-sm">Edit Profile</span>
                  </Link>
                </div>
              </div>
              
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="text-lg font-medium mb-2">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold gradient-text">{bookings.length}</p>
                    <p className="text-sm text-gray-300">Total Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold gradient-text">
                      {bookings.filter(booking => isUpcoming(booking.start_time)).length}
                    </p>
                    <p className="text-sm text-gray-300">Upcoming</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bookings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-effect p-6 rounded-xl lg:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-6">Your Bookings</h2>
            
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                <p className="text-gray-300 mb-6">You haven't made any seat reservations yet.</p>
                <Link
                  to="/seat-booking"
                  className="px-6 py-2 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity inline-block"
                >
                  Book a Seat
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-4 rounded-lg border ${
                      isUpcoming(booking.start_time)
                        ? 'border-primary/30 bg-primary/10'
                        : 'border-gray-700 bg-background-light'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-background rounded-md">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {booking.seat?.seat_number || 'Seat'}
                          </h3>
                          <div className="flex items-center text-sm text-gray-300 mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(booking.start_time)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-300 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {isUpcoming(booking.start_time) && (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                          aria-label="Cancel booking"
                        >
                          <X className="w-5 h-5 text-gray-400 hover:text-secondary" />
                        </button>
                      )}
                    </div>
                    
                    {isUpcoming(booking.start_time) ? (
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          Upcoming
                        </span>
                        <Link
                          to="/seat-booking"
                          className="text-xs text-primary hover:text-primary-dark"
                        >
                          Modify
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                          Past
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;