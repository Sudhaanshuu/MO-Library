-- Fix all issues in one migration
-- This file combines all necessary fixes

-- 1. Add payment columns to bookings table
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS payment_id TEXT,
  ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(10, 2);

-- 2. Add index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON bookings(payment_id);

-- 3. Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 4. Drop existing admin policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;

-- 5. Create policies for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- 6. Create policies for admins to view all bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- 7. Add comments for documentation
COMMENT ON COLUMN bookings.payment_id IS 'Razorpay payment ID for this booking';
COMMENT ON COLUMN bookings.amount_paid IS 'Amount paid for this booking in rupees';
COMMENT ON COLUMN profiles.is_admin IS 'Flag to identify admin users';
