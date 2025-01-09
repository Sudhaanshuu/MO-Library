import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 6);

      const { error } = await supabase.from('bookings').insert([
        {
          user_id: user.id,
          seat_id: seatId,
          expires_at: expiresAt.toISOString(),
        },
      ]);

      if (error) throw error;
      await fetchSeats();
      setSelectedSeat(null);
    } catch (err) {
      setError('Failed to book seat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Book Your Seat</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-10 gap-4 mb-8">
            {seats.map((seat) => (
              <button
                key={seat.id}
                className={`
                  p-4 rounded-lg text-center
                  ${
                    !seat.is_available
                      ? 'bg-gray-300 cursor-not-allowed'
                      : selectedSeat === seat.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-100 hover:bg-primary-200'
                  }
                `}
                onClick={() => seat.is_available && setSelectedSeat(seat.id)}
                disabled={!seat.is_available}
              >
                {seat.row_number}-{seat.seat_number}
              </button>
            ))}
          </div>

          {selectedSeat && (
            <div className="text-center">
              <button
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
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