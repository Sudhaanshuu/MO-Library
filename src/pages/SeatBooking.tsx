import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Monitor, Check, X } from 'lucide-react';

interface Seat {
  id: number;
  row_number: number;
  seat_number: number;
  is_available: boolean;
}

export function SeatBooking() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchSeats();
    const subscription = supabase
      .channel('seat_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, () => {
        fetchSeats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSeats = async () => {
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .order('row_number')
        .order('seat_number');

      if (error) throw error;
      setSeats(data || []);
    } catch (err) {
      setError('Failed to fetch seats');
    } finally {
      setLoading(false);
    }
  };

  const bookSeat = async (seatId: number) => {
    if (!user) return;

    try {
      setLoading(true);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 6);

      const { error: bookingError } = await supabase.from('bookings').insert([
        {
          user_id: user.id,
          seat_id: seatId,
          expires_at: expiresAt.toISOString(),
          is_active: true,
        },
      ]);

      if (bookingError) throw bookingError;

      const { error: seatError } = await supabase
        .from('seats')
        .update({ is_available: false, last_booked_at: new Date().toISOString() })
        .eq('id', seatId);

      if (seatError) throw seatError;

      await fetchSeats();
      setSelectedSeat(null);
    } catch (err) {
      setError('Failed to book seat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-950">
        <div className="text-xl text-primary-200 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-200 mb-4">Select Your Pod</h1>
          <p className="text-primary-300">Choose your preferred study pod for the next 6 hours</p>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="bg-primary-900/50 rounded-2xl p-8 border border-primary-700/50 backdrop-blur-sm">
          <div className="grid grid-cols-10 gap-4 mb-8">
            {seats.map((seat) => (
              <button
                key={seat.id}
                className={`
                  relative p-6 rounded-xl transition-all duration-200 transform hover:scale-105
                  ${
                    !seat.is_available
                      ? 'bg-red-900/30 cursor-not-allowed border border-red-800/50'
                      : selectedSeat === seat.id
                      ? 'bg-primary-600/50 border-2 border-primary-400'
                      : 'bg-primary-800/30 border border-primary-700/50 hover:border-primary-500/50'
                  }
                `}
                onClick={() => seat.is_available && setSelectedSeat(seat.id)}
                disabled={!seat.is_available}
              >
                <Monitor className={`w-6 h-6 mb-2 ${seat.is_available ? 'text-primary-400' : 'text-red-400'}`} />
                <div className="text-sm font-medium text-primary-200">
                  {seat.row_number}-{seat.seat_number}
                </div>
                {!seat.is_available && (
                  <div className="absolute -top-2 -right-2">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                )}
                {selectedSeat === seat.id && (
                  <div className="absolute -top-2 -right-2">
                    <Check className="w-5 h-5 text-primary-400" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {selectedSeat && (
            <div className="text-center">
              <button
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:from-primary-700 hover:to-primary-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary-500/25"
                onClick={() => bookSeat(selectedSeat)}
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}