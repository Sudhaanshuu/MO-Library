/*
  # Add admin functionality

  1. Changes
    - Add `is_admin` column to profiles table
    - Create admin-specific policies for viewing all bookings
    - Add admin user (optional - uncomment to create an admin)
  
  2. Security
    - Add policies for admins to view all profiles and bookings
*/

-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create policies for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Create policies for admins to view all bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Uncomment and modify this to create an admin user
-- UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';