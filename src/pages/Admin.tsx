import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, isAdmin } from '../lib/supabase';
import { BookOpen, Calendar, Clock, User, Search, Download, Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { Booking } from '../lib/supabase';

const Admin: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        const adminStatus = await isAdmin();
        
        if (!adminStatus) {
          toast.error('Unauthorized access');
          navigate('/');
          return;
        }

        await fetchBookings();
      } catch (error: any) {
        toast.error(error.message || 'Failed to load admin data');
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, [navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch all bookings with seat and profile information
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          seat:seats(*),
          profile:profiles(id, email, full_name, avatar_url)
        `)
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const filteredBookings = bookings
    .filter(booking => {
      // Apply search filter
      const userName = booking.profile?.full_name?.toLowerCase() || '';
      const userEmail = booking.profile?.email.toLowerCase() || '';
      const seatNumber = booking.seat?.seat_number.toLowerCase() || '';
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        userName.includes(searchLower) || 
        userEmail.includes(searchLower) || 
        seatNumber.includes(searchLower);
      
      // Apply status filter
      let matchesStatus = true;
      if (filterStatus === 'upcoming') {
        matchesStatus = isUpcoming(booking.start_time);
      } else if (filterStatus === 'past') {
        matchesStatus = !isUpcoming(booking.start_time);
      }
      
      return matchesSearch && matchesStatus;
    });

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['User Name', 'Email', 'Seat', 'Start Time', 'End Time', 'Status'];
    const csvRows = [headers];
    
    filteredBookings.forEach(booking => {
      const row = [
        booking.profile?.full_name || 'Unknown',
        booking.profile?.email || 'Unknown',
        booking.seat?.seat_number || 'Unknown',
        new Date(booking.start_time).toLocaleString(),
        new Date(booking.end_time).toLocaleString(),
        isUpcoming(booking.start_time) ? 'Upcoming' : 'Past'
      ];
      csvRows.push(row);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `library-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="gradient-text">Admin</span> Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Manage all library bookings and user data
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect p-6 rounded-xl mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or seat..."
                className="block w-full pl-10 pr-3 py-2 rounded-md bg-background-light border border-gray-700 focus:ring-primary focus:border-primary text-white"
              />
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'upcoming' | 'past')}
                  className="bg-background-light border border-gray-700 text-white rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Bookings</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
              
              <button
                onClick={fetchBookings}
                className="p-2 rounded-md bg-background-light hover:bg-gray-700 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5 text-gray-300" />
              </button>
              
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 rounded-md gradient-bg text-white hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-background-light">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Seat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-background-light transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            {booking.profile?.avatar_url ? (
                              <img
                                src={booking.profile.avatar_url}
                                alt={booking.profile.full_name || ''}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {booking.profile?.full_name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-300">
                              {booking.profile?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{booking.seat?.seat_number || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatDate(booking.start_time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isUpcoming(booking.start_time)
                            ? 'bg-primary/20 text-primary'
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {isUpcoming(booking.start_time) ? 'Upcoming' : 'Past'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">No bookings found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-gray-400 text-right">
            Total: {filteredBookings.length} bookings
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;