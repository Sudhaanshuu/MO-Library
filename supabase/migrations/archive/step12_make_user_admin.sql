-- ============================================
-- STEP 12: Make a User an Admin
-- ============================================
-- This script grants admin privileges to a specific user

-- ⚠️ IMPORTANT: Replace 'YOUR_USER_ID_HERE' with the actual user ID
-- 
-- To get your user ID:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to: Authentication → Users
-- 3. Find your email and copy the user ID
-- 4. Paste it below replacing 'YOUR_USER_ID_HERE'

-- Example user ID format: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

UPDATE profiles 
SET is_admin = true 
WHERE id = 'YOUR_USER_ID_HERE';

-- Verify the admin was created successfully
SELECT id, email, full_name, is_admin 
FROM profiles 
WHERE is_admin = true;

-- Expected result: You should see your user with is_admin = true