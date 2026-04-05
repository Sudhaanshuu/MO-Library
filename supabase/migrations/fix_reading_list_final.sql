-- Final fix for reading list and roadmap functionality
-- This migration corrects all RLS policies and ensures proper column names

-- Enable RLS on user_reading_list table
ALTER TABLE user_reading_list ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own reading list" ON user_reading_list;
DROP POLICY IF EXISTS "Users can insert own reading entries" ON user_reading_list;
DROP POLICY IF EXISTS "Users can update own reading entries" ON user_reading_list;
DROP POLICY IF EXISTS "Users can delete own reading entries" ON user_reading_list;
DROP POLICY IF EXISTS "Users can view their own reading list" ON user_reading_list;
DROP POLICY IF EXISTS "Users can manage their own reading list" ON user_reading_list;

-- Create correct policies for user_reading_list
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

-- Fix RLS policies for reading_quiz_questions
ALTER TABLE reading_quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view quiz questions" ON reading_quiz_questions;
DROP POLICY IF EXISTS "Only admins can manage quiz questions" ON reading_quiz_questions;

CREATE POLICY "Anyone can view quiz questions"
ON reading_quiz_questions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage quiz questions"
ON reading_quiz_questions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Fix RLS policies for user_quiz_attempts
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quiz attempts" ON user_quiz_attempts;
DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON user_quiz_attempts;
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON user_quiz_attempts;
DROP POLICY IF EXISTS "Users can create their own quiz attempts" ON user_quiz_attempts;

CREATE POLICY "Users can view own quiz attempts"
ON user_quiz_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
ON user_quiz_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix RLS policies for learning_paths
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Only admins can manage learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Anyone can view published learning paths" ON learning_paths;
DROP POLICY IF EXISTS "Admins can manage all learning paths" ON learning_paths;

CREATE POLICY "Anyone can view published learning paths"
ON learning_paths
FOR SELECT
TO authenticated
USING (
  is_published = true 
  OR created_by = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

CREATE POLICY "Admins can manage learning paths"
ON learning_paths
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Fix RLS policies for roadmap_books
ALTER TABLE roadmap_books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view roadmap books" ON roadmap_books;
DROP POLICY IF EXISTS "Only admins can manage roadmap books" ON roadmap_books;

CREATE POLICY "Anyone can view roadmap books"
ON roadmap_books
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage roadmap books"
ON roadmap_books
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Fix RLS policies for user_roadmap_progress
ALTER TABLE user_roadmap_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own roadmap progress" ON user_roadmap_progress;
DROP POLICY IF EXISTS "Users can insert own roadmap progress" ON user_roadmap_progress;
DROP POLICY IF EXISTS "Users can update own roadmap progress" ON user_roadmap_progress;
DROP POLICY IF EXISTS "Users can view their own roadmap progress" ON user_roadmap_progress;
DROP POLICY IF EXISTS "Users can manage their own roadmap progress" ON user_roadmap_progress;

CREATE POLICY "Users can view own roadmap progress"
ON user_roadmap_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roadmap progress"
ON user_roadmap_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmap progress"
ON user_roadmap_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure the trigger functions are correct
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE books
  SET rating = (
    SELECT COALESCE(AVG(user_rating), 0)
    FROM user_reading_list
    WHERE book_id = NEW.book_id AND user_rating IS NOT NULL
  )
  WHERE id = NEW.book_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_book_rating ON user_reading_list;
CREATE TRIGGER trigger_update_book_rating
  AFTER INSERT OR UPDATE OF user_rating ON user_reading_list
  FOR EACH ROW
  EXECUTE FUNCTION update_book_rating();

-- Ensure roadmap progress trigger is correct
CREATE OR REPLACE FUNCTION update_roadmap_progress()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    -- Update progress for all learning paths that contain this book
    UPDATE user_roadmap_progress
    SET 
      books_completed = books_completed + 1,
      last_activity_at = now()
    WHERE user_id = NEW.user_id
    AND learning_path_id IN (
      SELECT learning_path_id 
      FROM roadmap_books 
      WHERE book_id = NEW.book_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_roadmap_progress ON user_reading_list;
CREATE TRIGGER trigger_update_roadmap_progress
  AFTER INSERT OR UPDATE OF status ON user_reading_list
  FOR EACH ROW
  EXECUTE FUNCTION update_roadmap_progress();
