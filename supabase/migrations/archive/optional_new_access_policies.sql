
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
