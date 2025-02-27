import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Seat = {
  id: string;
  seat_number: string;
  is_available: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  seat_id: string;
  start_time: string;
  end_time: string;
  created_at: string;
  seat?: Seat;
};