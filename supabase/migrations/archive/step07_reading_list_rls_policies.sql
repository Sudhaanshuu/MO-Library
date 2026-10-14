-- Safe migration: Only add policies if they don't exist
-- Run this in Supabase SQL Editor

-- Enable RLS on user_reading_list table
ALTER TABLE user_reading_list ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own reading list" ON user_reading_list;
DROP POLICY IF EXISTS "Users can insert own reading entries" ON user_reading_list;
DROP POLICY IF EXISTS "Users can update own reading entries" ON user_reading_list;
DROP POLICY IF EXISTS "Users can delete own reading entries" ON user_reading_list;

-- Create policies for user_reading_list
CREATE POLICY "Users can view own reading list"
ON user_reading_list
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading entries"
ON user_reading_list
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading entries"
ON user_reading_list
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading entries"
ON user_reading_list
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
