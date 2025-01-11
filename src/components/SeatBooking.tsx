import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Seat {
  id: string;
  row_num: number;
  col_num: number;
  is_booked: boolean;
  user_id: string | null;
}

export const SeatBooking = () => {
  const { user } = useAuthStore();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSeats();
    // Subscribe to realtime changes
    const subscription = supabase
      .channel('seats_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, () => {
        fetchSeats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchSeats = async () => {
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .order('row_num')
        .order('col_num');

      if (error) throw error;
      setSeats(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = async (seat: Seat) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // First verify the user exists
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id);

      if (userError) throw userError;

      // If user doesn't exist in the users table, create them
      if (!users || users.length === 0) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ 
            id: user.id,
            email: user.email
          }]);
          
        if (insertError) throw insertError;
      }

      // Now update the seat
      const { error } = await supabase
        .from('seats')
        .update({
          is_booked: !seat.is_booked,
          user_id: !seat.is_booked ? user.id : null,
          booking_time: !seat.is_booked ? new Date().toISOString() : null,
          expiry_time: !seat.is_booked ? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('id', seat.id);

      if (error) throw error;

      // Add to booking history
      if (!seat.is_booked) {
        await supabase
          .from('bookings_history')
          .insert({
            user_id: user.id,
            seat_id: seat.id,
          });
      } else {
        await supabase
          .from('bookings_history')
          .update({ released_at: new Date().toISOString() })
          .match({ seat_id: seat.id, released_at: null });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
            Select Your Seat
          </h2>
          <p className="mt-2 text-gray-400">
            Click on an available seat to make your reservation
          </p>
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="bg-black/50 backdrop-blur-lg border border-purple-500/20 rounded-lg p-8">
          <div className="grid grid-cols-5 gap-4">
            {seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.is_booked && seat.user_id !== user?.id}
                className={`
                  aspect-square rounded-lg flex items-center justify-center
                  transition-all duration-300
                  ${
                    seat.is_booked
                      ? seat.user_id === user?.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-red-500/50 cursor-not-allowed'
                      : 'bg-blue-500/20 hover:bg-blue-500/40 text-white'
                  }
                `}
              >
                {seat.row_num}-{seat.col_num}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500/20 rounded"></div>
              <span className="text-gray-400">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-gray-400">Your Selection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500/50 rounded"></div>
              <span className="text-gray-400">Booked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};