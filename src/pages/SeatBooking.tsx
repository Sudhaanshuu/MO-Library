import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, Info, Check, AlertCircle, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Seat, Booking } from '../lib/supabase';
import { initiateRazorpayPayment } from '../lib/razorpay';

const SeatBooking: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<'2hours' | '4hours' | 'custom'>('2hours');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          
          // Fetch user profile for payment details
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileData) {
            setUserProfile(profileData);
          }
        }

        // Fetch all seats
        const { data: seatsData, error: seatsError } = await supabase
          .from('seats')
          .select('*')
          .order('seat_number');
        
        if (seatsError) throw seatsError;
        setSeats(seatsData || []);

        // Fetch current bookings
        const now = new Date().toISOString();
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .gte('end_time', now);
        
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);

        // Set user's bookings
        if (user) {
          const userBookings = bookingsData?.filter(booking => booking.user_id === user.id) || [];
          setUserBookings(userBookings);
        }

        // Set default times
        const currentDate = new Date();
        currentDate.setMinutes(Math.ceil(currentDate.getMinutes() / 15) * 15);
        
        const defaultStartTime = new Date(currentDate);
        defaultStartTime.setMinutes(defaultStartTime.getMinutes() + 15);
        
        const defaultEndTime = new Date(defaultStartTime);
        defaultEndTime.setHours(defaultEndTime.getHours() + 2);
        
        setStartTime(formatDateTimeForInput(defaultStartTime));
        setEndTime(formatDateTimeForInput(defaultEndTime));
      } catch (error: any) {
        toast.error(error.message || 'Failed to load seat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDateTimeForInput = (date: Date): string => {
    return date.toISOString().slice(0, 16);
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(selectedSeat === seatId ? null : seatId);
  };

  const handleBookingTypeChange = (type: '2hours' | '4hours' | 'custom') => {
    setBookingType(type);
    
    const currentDate = new Date();
    currentDate.setMinutes(Math.ceil(currentDate.getMinutes() / 15) * 15);
    
    const newStartTime = new Date(currentDate);
    newStartTime.setMinutes(newStartTime.getMinutes() + 15);
    
    const newEndTime = new Date(newStartTime);
    
    if (type === '2hours') {
      newEndTime.setHours(newEndTime.getHours() + 2);
    } else if (type === '4hours') {
      newEndTime.setHours(newEndTime.getHours() + 4);
    }
    
    setStartTime(formatDateTimeForInput(newStartTime));
    setEndTime(formatDateTimeForInput(newEndTime));
  };

  const isSeatAvailable = (seatId: string): boolean => {
    // Check if the seat is already booked during the selected time
    const selectedStart = new Date(startTime).getTime();
    const selectedEnd = new Date(endTime).getTime();
    
    return !bookings.some(booking => {
      if (booking.seat_id !== seatId) return false;
      
      const bookingStart = new Date(booking.start_time).getTime();
      const bookingEnd = new Date(booking.end_time).getTime();
      
      // Check if there's an overlap
      return (
        (selectedStart >= bookingStart && selectedStart < bookingEnd) ||
        (selectedEnd > bookingStart && selectedEnd <= bookingEnd) ||
        (selectedStart <= bookingStart && selectedEnd >= bookingEnd)
      );
    });
  };

  const isUserSeat = (seatId: string): boolean => {
    return userBookings.some(booking => booking.seat_id === seatId);
  };

  const calculatePrice = (startTime: string, endTime: string): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return hours * 60; // 60 rubles per hour
  };

  const handleBookSeat = async () => {
    if (!selectedSeat) {
      toast.error('Please select a seat');
      return;
    }
    
    if (!startTime || !endTime) {
      toast.error('Please select start and end times');
      return;
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      toast.error('End time must be after start time');
      return;
    }
    
    if (start < new Date()) {
      toast.error('Start time must be in the future');
      return;
    }

    // Calculate price
    const price = calculatePrice(startTime, endTime);
    const seatNumber = seats.find(seat => seat.id === selectedSeat)?.seat_number || 'Unknown Seat';
    
    setProcessingPayment(true);
    
    try {
      // Initiate Razorpay payment
      const paymentResponse = await initiateRazorpayPayment({
        amount: price * 100, // Convert to paise (1 ruble = 100 paise for this example)
        currency: 'INR',
        name: 'Mo-Library',
        description: `Booking for ${seatNumber} from ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()}`,
        prefill: {
          name: userProfile?.full_name || '',
          email: userProfile?.email || '',
        },
        notes: {
          seat_id: selectedSeat,
          start_time: startTime,
          end_time: endTime
        },
        theme: {
          color: '#8b5cf6'
        }
      });

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || 'Payment failed');
      }

      // If payment successful, create booking
      setSubmitting(true);
      
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: userId,
            seat_id: selectedSeat,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            payment_id: paymentResponse.data?.razorpay_payment_id,
            amount_paid: price
          },
        ]);
      
      if (error) throw error;
      
      toast.success('Seat booked successfully!');
      
      // Refresh bookings
      const { data: newBookings } = await supabase
        .from('bookings')
        .select('*')
        .gte('end_time', new Date().toISOString());
      
      if (newBookings) {
        setBookings(newBookings);
        setUserBookings(newBookings.filter(booking => booking.user_id === userId));
      }
      
      // Reset selection
      setSelectedSeat(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to book seat');
    } finally {
      setSubmitting(false);
      setProcessingPayment(false);
    }
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
            Book Your <span className="gradient-text">Perfect Spot</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Select a seat and time that works for you
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-effect p-6 rounded-xl lg:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-6">Select a Seat</h2>
            
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 mb-6">
              {seats.map((seat) => {
                const isAvailable = isSeatAvailable(seat.id);
                const isUserBooked = isUserSeat(seat.id);
                const isSelected = selectedSeat === seat.id;
                
                return (
                  <button
                    key={seat.id}
                    onClick={() => isAvailable && handleSeatSelect(seat.id)}
                    disabled={!isAvailable && !isUserBooked}
                    className={`seat w-12 h-12 rounded-md flex items-center justify-center text-sm ${
                      isSelected
                        ? 'selected'
                        : isUserBooked
                        ? 'your-booking'
                        : isAvailable
                        ? 'available'
                        : 'booked'
                    }`}
                  >
                    {seat.seat_number.replace('Seat ', '')}
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm seat available"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm seat booked"></div>
                  <span className="text-sm">Booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm seat your-booking"></div>
                  <span className="text-sm">Your Booking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm seat selected"></div>
                  <span className="text-sm">Selected</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-effect p-6 rounded-xl"
          >
            <h2 className="text-xl font-semibold mb-6">Booking Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleBookingTypeChange('2hours')}
                    className={`p-2 rounded-md text-sm text-center transition-colors ${
                      bookingType === '2hours'
                        ? 'gradient-bg text-white'
                        : 'bg-background-light hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    2 Hours
                  </button>
                  <button
                    onClick={() => handleBookingTypeChange('4hours')}
                    className={`p-2 rounded-md text-sm text-center transition-colors ${
                      bookingType === '4hours'
                        ? 'gradient-bg text-white'
                        : 'bg-background-light hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    4 Hours
                  </button>
                  <button
                    onClick={() => handleBookingTypeChange('custom')}
                    className={`p-2 rounded-md text-sm text-center transition-colors ${
                      bookingType === 'custom'
                        ? 'gradient-bg text-white'
                        : 'bg-background-light hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md bg-background-light border border-gray-700 focus:ring-primary focus:border-primary text-white"
                    min={formatDateTimeForInput(new Date())}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-300 mb-2">
                  End Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md bg-background-light border border-gray-700 focus:ring-primary focus:border-primary text-white"
                    min={startTime}
                  />
                </div>
              </div>
              
              {selectedSeat ? (
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-md flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Seat {seats.find(seat => seat.id === selectedSeat)?.seat_number.replace('Seat ', '')} selected
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Ready to book for {new Date(startTime).toLocaleString()} to {new Date(endTime).toLocaleString()}
                    </p>
                    {startTime && endTime && (
                      <p className="text-sm font-medium text-primary mt-2">
                        Price: ₹{calculatePrice(startTime, endTime)}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-background-light rounded-md flex items-start">
                  <Info className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Please select a seat from the seating chart
                  </p>
                </div>
              )}
              
              <button
                onClick={handleBookSeat}
                disabled={!selectedSeat || submitting || processingPayment}
                className="w-full py-2 px-4 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting || processingPayment ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay & Book Seat
                  </>
                )}
              </button>
              
              <div className="p-4 bg-background-light rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 text-primary mr-2" />
                  Booking Guidelines
                </h3>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Bookings can be made up to 7 days in advance</li>
                  <li>• Maximum booking duration is 8 hours</li>
                  <li>• You can cancel a booking up to 1 hour before start time</li>
                  <li>• Please arrive on time for your booking</li>
                  <li>• Payment is processed securely via Razorpay</li>
                  <li>• Rate: ₹60 per hour (or part thereof)</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;