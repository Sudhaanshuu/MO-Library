/*
  # Initial Schema Setup for MoLibrary

  1. New Tables
    - `profiles`
      - Extended user profile information
      - Linked to auth.users
    - `seats`
      - Represents the 50 available seats
      - Tracks seat status and booking information
    - `bookings`
      - Records seat reservations
      - Includes booking duration and status
    - `contact_messages`
      - Stores contact form submissions
      
  2. Security
    - Enable RLS on all tables
    - Policies for user access to profiles
    - Policies for seat viewing and booking
    - Admin-only policies for managing bookings
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create seats table
CREATE TABLE seats (
  id serial PRIMARY KEY,
  row_number integer NOT NULL,
  seat_number integer NOT NULL,
  is_available boolean DEFAULT true,
  last_booked_at timestamptz,
  UNIQUE(row_number, seat_number)
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  seat_id integer REFERENCES seats(id) ON DELETE CASCADE,
  booked_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  UNIQUE(seat_id, is_active) WHERE (is_active = true)
);

-- Create contact messages table
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Seats policies
CREATE POLICY "Anyone can view seats"
  ON seats FOR SELECT
  TO authenticated
  USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admin policies
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Initialize seats
DO $$
BEGIN
  FOR r IN 1..5 LOOP
    FOR s IN 1..10 LOOP
      INSERT INTO seats (row_number, seat_number)
      VALUES (r, s);
    END LOOP;
  END LOOP;
END $$;