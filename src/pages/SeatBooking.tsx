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
  const [bookingDate, setBookingDate] = useState<string>('');
  const [startHour, setStartHour] = useState<string>('');
  const [startMinute, setStartMinute] = useState<string>('');
  const [endHour, setEndHour] = useState<string>('');
  const [endMinute, setEndMinute] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Library operating hours
  const OPENING_HOUR = 8; // 8 AM
  const CLOSING_HOUR = 21; // 9 PM

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
        const currentTime = new Date().toISOString();
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .gte('end_time', currentTime);
        
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);

        // Set user's bookings
        if (user) {
          const userBookings = bookingsData?.filter(booking => booking.user_id === user.id) || [];
          setUserBookings(userBookings);
        }

        // Set default to current time
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Set today's date
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        setBookingDate(`${year}-${month}-${day}`);
        
        // Set current time or opening time
        if (currentHour < OPENING_HOUR) {
          setStartHour(String(OPENING_HOUR));
          setStartMinute('00');
          setEndHour(String(OPENING_HOUR + 2));
          setEndMinute('00');
        } else if (currentHour >= CLOSING_HOUR) {
          // Next day
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowYear = tomorrow.getFullYear();
          const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
          const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0');
          setBookingDate(`${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`);
          setStartHour(String(OPENING_HOUR));
          setStartMinute('00');
          setEndHour(String(OPENING_HOUR + 2));
          setEndMinute('00');
        } else {
          // Use current time
          setStartHour(String(currentHour));
          setStartMinute(String(currentMinute).padStart(2, '0'));
          
          // End time 2 hours later
          const endHourValue = Math.min(currentHour + 2, CLOSING_HOUR);
          setEndHour(String(endHourValue));
          setEndMinute(String(currentMinute).padStart(2, '0'));
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load seat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStartDateTime = (): Date => {
    // Parse date string properly to avoid timezone issues
    // bookingDate format: "YYYY-MM-DD"
    const [year, month, day] = bookingDate.split('-').map(Number);
    // month is 0-indexed in JavaScript Date
    const localDate = new Date(year, month - 1, day, parseInt(startHour) || 0, parseInt(startMinute) || 0, 0, 0);
    return localDate;
  };

  const getEndDateTime = (): Date => {
    // Parse date string properly to avoid timezone issues
    const [year, month, day] = bookingDate.split('-').map(Number);
    // month is 0-indexed in JavaScript Date
    const localDate = new Date(year, month - 1, day, parseInt(endHour) || 0, parseInt(endMinute) || 0, 0, 0);
    return localDate;
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(selectedSeat === seatId ? null : seatId);
  };

  const handleBookingTypeChange = (type: '2hours' | '4hours' | 'custom') => {
    setBookingType(type);
    
    if (type === 'custom') return;
    
    const hours = type === '2hours' ? 2 : 4;
    const currentStartHour = parseInt(startHour) || 0;
    const newEndHour = Math.min(currentStartHour + hours, CLOSING_HOUR);
    
    setEndHour(String(newEndHour));
    setEndMinute(startMinute);
  };

  const isSeatAvailable = (seatId: string): boolean => {
    if (!bookingDate || !startHour || !endHour) return true;
    
    const selectedStart = getStartDateTime().getTime();
    const selectedEnd = getEndDateTime().getTime();
    
    return !bookings.some(booking => {
      if (booking.seat_id !== seatId) return false;
      
      const bookingStart = new Date(booking.start_time).getTime();
      const bookingEnd = new Date(booking.end_time).getTime();
      
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

  const calculatePrice = (): number => {
    const start = getStartDateTime();
    const end = getEndDateTime();
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return hours * 5; // 5 rupees per hour
  };

  const validateBookingTime = (start: Date, end: Date): { valid: boolean; message?: string } => {
    // Check if start time is before end time
    if (start >= end) {
      return { valid: false, message: 'End time must be after start time' };
    }
    
    // Check if start time is in the future
    if (start < new Date()) {
      return { valid: false, message: 'Start time must be in the future' };
    }
    
    // Check if booking is within operating hours
    if (start.getHours() < OPENING_HOUR) {
      return { valid: false, message: `Library opens at ${OPENING_HOUR}:00 AM` };
    }
    
    if (end.getHours() >= CLOSING_HOUR || (end.getHours() === CLOSING_HOUR && end.getMinutes() > 0)) {
      return { valid: false, message: `Library closes at ${CLOSING_HOUR}:00 PM` };
    }
    
    // Check if booking duration is reasonable (e.g., max 8 hours)
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours > 8) {
      return { valid: false, message: 'Maximum booking duration is 8 hours' };
    }
    
    return { valid: true };
  };

  const handleBookSeat = async () => {
    if (!selectedSeat) {
      toast.error('Please select a seat');
      return;
    }
    
    if (!bookingDate || !startHour || !endHour) {
      toast.error('Please enter booking date and time');
      return;
    }
    
    const start = getStartDateTime();
    const end = getEndDateTime();
    
    // Debug: Log the times being used
    console.log('Booking times:', {
      start: start.toISOString(),
      end: end.toISOString(),
      startLocal: start.toLocaleString(),
      endLocal: end.toLocaleString(),
    });
    
    // Validate booking time
    const validation = validateBookingTime(start, end);
    if (!validation.valid) {
      toast.error(validation.message ?? "An error occurred");
      return;
    }
    
    // Double-check seat availability before payment (client-side pre-check)
    if (!isSeatAvailable(selectedSeat)) {
      toast.error('This seat is no longer available for the selected time. Please choose another seat or time.');
      
      // Refresh bookings
      const { data: refreshedBookings } = await supabase
        .from('bookings')
        .select('*')
        .gte('end_time', new Date().toISOString());
      
      if (refreshedBookings) {
        setBookings(refreshedBookings);
      }
      
      return;
    }
    
    // Calculate price
    const price = calculatePrice();
    const seatNumber = seats.find(seat => seat.id === selectedSeat)?.seat_number || 'Unknown Seat';
    
    setProcessingPayment(true);
    
    try {
      // Initiate Razorpay payment
      const paymentResponse = await initiateRazorpayPayment({
        amount: price * 100,
        currency: 'INR',
        name: 'Mo-Library',
        description: `Booking for ${seatNumber} from ${start.toLocaleString()} to ${end.toLocaleString()}`,
        prefill: {
          name: userProfile?.full_name || '',
          email: userProfile?.email || '',
        },
        notes: {
          seat_id: selectedSeat,
          start_time: start.toISOString(),
          end_time: end.toISOString()
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
      
      if (error) {
        // Check if it's a double booking error
        if (error.message && error.message.includes('already booked')) {
          toast.error('This seat was just booked by someone else. Please select a different seat or time.');
          
          // Refresh bookings to show updated availability
          const { data: refreshedBookings } = await supabase
            .from('bookings')
            .select('*')
            .gte('end_time', new Date().toISOString());
          
          if (refreshedBookings) {
            setBookings(refreshedBookings);
          }
          
          return;
        }
        throw error;
      }
      
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

  // Format time for display
  const formatTimeDisplay = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
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
                  Quick Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleBookingTypeChange('2hours')}
                    className={`p-3 rounded-md text-sm font-medium transition-all ${
                      bookingType === '2hours'
                        ? 'gradient-bg text-white'
                        : 'bg-background-light hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    2 Hours
                  </button>
                  <button
                    onClick={() => handleBookingTypeChange('4hours')}
                    className={`p-3 rounded-md text-sm font-medium transition-all ${
                      bookingType === '4hours'
                        ? 'gradient-bg text-white'
                        : 'bg-background-light hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    4 Hours
                  </button>
                  <button
                    onClick={() => handleBookingTypeChange('custom')}
                    className={`p-3 rounded-md text-sm font-medium transition-all ${
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
                <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  id="bookingDate"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="block w-full px-4 py-3 rounded-md bg-background-light border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary text-white text-lg"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="HH"
                    value={startHour}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 23)) {
                        setStartHour(val);
                        if (bookingType !== 'custom' && val) {
                          const hours = bookingType === '2hours' ? 2 : 4;
                          const newEndHour = Math.min(parseInt(val) + hours, CLOSING_HOUR);
                          setEndHour(String(newEndHour));
                        }
                      }
                    }}
                    min="0"
                    max="23"
                    className="flex-1 px-4 py-3 rounded-md bg-background-light border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary text-white text-lg text-center"
                  />
                  <span className="text-2xl text-gray-400 flex items-center">:</span>
                  <input
                    type="number"
                    placeholder="MM"
                    value={startMinute}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
                        setStartMinute(val);
                        if (bookingType !== 'custom') {
                          setEndMinute(val);
                        }
                      }
                    }}
                    min="0"
                    max="59"
                    className="flex-1 px-4 py-3 rounded-md bg-background-light border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary text-white text-lg text-center"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Library: {OPENING_HOUR}:00 - {CLOSING_HOUR}:00
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="HH"
                    value={endHour}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 23)) {
                        setEndHour(val);
                      }
                    }}
                    min="0"
                    max="23"
                    className="flex-1 px-4 py-3 rounded-md bg-background-light border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary text-white text-lg text-center"
                  />
                  <span className="text-2xl text-gray-400 flex items-center">:</span>
                  <input
                    type="number"
                    placeholder="MM"
                    value={endMinute}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
                        setEndMinute(val);
                      }
                    }}
                    min="0"
                    max="59"
                    className="flex-1 px-4 py-3 rounded-md bg-background-light border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary text-white text-lg text-center"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {startHour && endHour && (
                    <>Duration: {Math.abs(parseInt(endHour) - parseInt(startHour))} hours {Math.abs(parseInt(endMinute || '0') - parseInt(startMinute || '0'))} min</>
                  )}
                </p>
              </div>
              
              {selectedSeat ? (
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-md flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Seat {seats.find(seat => seat.id === selectedSeat)?.seat_number.replace('Seat ', '')} selected
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {bookingDate && startHour && endHour && (
                        <>
                          {new Date(parseInt(bookingDate.split('-')[0]), parseInt(bookingDate.split('-')[1]) - 1, parseInt(bookingDate.split('-')[2]), parseInt(startHour), parseInt(startMinute || '0')).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          <br />
                          {startHour.padStart(2, '0')}:{(startMinute || '00').padStart(2, '0')} - {endHour.padStart(2, '0')}:{(endMinute || '00').padStart(2, '0')}
                        </>
                      )}
                    </p>
                    {bookingDate && startHour && endHour && (
                      <p className="text-sm font-medium text-primary mt-2">
                        Price: ₹{calculatePrice()}
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
                  <li>• Library hours: {formatTimeDisplay(OPENING_HOUR)} - {formatTimeDisplay(CLOSING_HOUR)}</li>
                  <li>• You can cancel a booking up to 1 hour before start time</li>
                  <li>• Please arrive on time for your booking</li>
                  <li>• Payment is processed securely via Razorpay</li>
                  <li>• Rate: ₹5 per hour (or part thereof)</li>
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