-- Step 13: Prevent Double Booking of Seats
-- This migration adds database-level constraints and functions to prevent
-- multiple users from booking the same seat at overlapping times

-- ============================================
-- PART 1: Create function to check booking conflicts
-- ============================================

CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_seat_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz,
  p_booking_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  -- Check if there's any overlapping booking for this seat
  -- Exclude the current booking if updating (p_booking_id is provided)
  RETURN EXISTS (
    SELECT 1
    FROM bookings
    WHERE seat_id = p_seat_id
      AND (p_booking_id IS NULL OR id != p_booking_id)
      AND (
        -- New booking starts during existing booking
        (p_start_time >= start_time AND p_start_time < end_time)
        OR
        -- New booking ends during existing booking
        (p_end_time > start_time AND p_end_time <= end_time)
        OR
        -- New booking completely covers existing booking
        (p_start_time <= start_time AND p_end_time >= end_time)
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 2: Create trigger function to validate bookings
-- ============================================

CREATE OR REPLACE FUNCTION validate_booking_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the seat exists
  IF NOT EXISTS (SELECT 1 FROM seats WHERE id = NEW.seat_id) THEN
    RAISE EXCEPTION 'Seat does not exist';
  END IF;

  -- Check if start time is before end time
  IF NEW.start_time >= NEW.end_time THEN
    RAISE EXCEPTION 'Booking end time must be after start time';
  END IF;

  -- Check if start time is in the future (allow some tolerance for processing time - 1 minute)
  IF NEW.start_time < (NOW() - INTERVAL '1 minute') THEN
    RAISE EXCEPTION 'Cannot book a seat in the past';
  END IF;

  -- Check for booking conflicts
  IF check_booking_conflict(NEW.seat_id, NEW.start_time, NEW.end_time, NEW.id) THEN
    RAISE EXCEPTION 'This seat is already booked for the selected time period. Please choose a different seat or time.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 3: Create trigger for INSERT operations
-- ============================================

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_validate_booking_insert ON bookings;

-- Create trigger for INSERT
CREATE TRIGGER trigger_validate_booking_insert
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_before_insert();

-- ============================================
-- PART 4: Create trigger for UPDATE operations
-- ============================================

CREATE OR REPLACE FUNCTION validate_booking_before_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the seat exists
  IF NOT EXISTS (SELECT 1 FROM seats WHERE id = NEW.seat_id) THEN
    RAISE EXCEPTION 'Seat does not exist';
  END IF;

  -- Check if start time is before end time
  IF NEW.start_time >= NEW.end_time THEN
    RAISE EXCEPTION 'Booking end time must be after start time';
  END IF;

  -- Check for booking conflicts (excluding current booking)
  IF check_booking_conflict(NEW.seat_id, NEW.start_time, NEW.end_time, NEW.id) THEN
    RAISE EXCEPTION 'This seat is already booked for the selected time period. Please choose a different seat or time.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_validate_booking_update ON bookings;

-- Create trigger for UPDATE
CREATE TRIGGER trigger_validate_booking_update
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_before_update();

-- ============================================
-- PART 5: Create index for performance
-- ============================================

-- Add index to speed up conflict checks
CREATE INDEX IF NOT EXISTS idx_bookings_seat_time 
ON bookings(seat_id, start_time, end_time);

-- Add index for active bookings (without WHERE clause to avoid immutability issue)
CREATE INDEX IF NOT EXISTS idx_bookings_active 
ON bookings(seat_id, end_time);

-- ============================================
-- PART 6: Add helpful function for frontend
-- ============================================

-- Function to get available seats for a time range
CREATE OR REPLACE FUNCTION get_available_seats(
  p_start_time timestamptz,
  p_end_time timestamptz
)
RETURNS TABLE(
  seat_id uuid,
  seat_number text
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.seat_number
  FROM seats s
  WHERE NOT check_booking_conflict(s.id, p_start_time, p_end_time)
  ORDER BY s.seat_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 7: Create helper function for checking specific seat availability
-- ============================================

CREATE OR REPLACE FUNCTION is_seat_available(
  p_seat_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz
)
RETURNS boolean AS $$
BEGIN
  RETURN NOT check_booking_conflict(p_seat_id, p_start_time, p_end_time);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Test the conflict detection function
DO $$
BEGIN
  RAISE NOTICE 'Double booking prevention has been installed successfully!';
  RAISE NOTICE 'Available functions:';
  RAISE NOTICE '  - check_booking_conflict(seat_id, start_time, end_time, booking_id?)';
  RAISE NOTICE '  - get_available_seats(start_time, end_time)';
  RAISE NOTICE '  - is_seat_available(seat_id, start_time, end_time)';
  RAISE NOTICE 'Triggers installed on bookings table: INSERT and UPDATE';
END $$;

-- Verify triggers are installed
SELECT 
  trigger_name, 
  event_manipulation as event, 
  action_timing as timing,
  action_statement as action
FROM information_schema.triggers
WHERE event_object_table = 'bookings'
  AND trigger_name LIKE 'trigger_validate_booking%'
ORDER BY trigger_name;

-- Example usage (commented out):
-- Check if a specific seat is available:
-- SELECT is_seat_available(
--   'seat-uuid-here',
--   '2024-03-20 10:00:00+00',
--   '2024-03-20 12:00:00+00'
-- );

-- Get all available seats for a time range:
-- SELECT * FROM get_available_seats(
--   '2024-03-20 10:00:00+00',
--   '2024-03-20 12:00:00+00'
-- );
