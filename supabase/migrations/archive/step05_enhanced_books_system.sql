-- Enhanced Books System Migration
-- This migration adds new fields and tables for the comprehensive book management system

-- Drop existing books table constraints if needed and add new columns
ALTER TABLE books ADD COLUMN IF NOT EXISTS book_type text DEFAULT 'physical' CHECK (book_type IN ('physical', 'ebook', 'both'));
ALTER TABLE books ADD COLUMN IF NOT EXISTS pdf_url text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS genre text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS publication_year int;
ALTER TABLE books ADD COLUMN IF NOT EXISTS pages int;
ALTER TABLE books ADD COLUMN IF NOT EXISTS language text DEFAULT 'English';
ALTER TABLE books ADD COLUMN IF NOT EXISTS publisher text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS rating decimal(3,2) DEFAULT 0.0;

-- Create user reading list table (books user wants to read)
CREATE TABLE IF NOT EXISTS user_reading_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'want_to_read' CHECK (status IN ('want_to_read', 'currently_reading', 'completed', 'on_hold')),
  added_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  user_rating int CHECK (user_rating >= 1 AND user_rating <= 5),
  user_notes text,
  UNIQUE(user_id, book_id)
);

-- Create reading quiz questions table
CREATE TABLE IF NOT EXISTS reading_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at timestamptz DEFAULT now()
);

-- Create user quiz attempts table
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  score int NOT NULL,
  total_questions int NOT NULL,
  passed boolean DEFAULT false,
  attempted_at timestamptz DEFAULT now()
);

-- Create learning paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration_days int,
  cover_image_url text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create roadmap books junction table
CREATE TABLE IF NOT EXISTS roadmap_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id uuid REFERENCES learning_paths(id) ON DELETE CASCADE NOT NULL,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  sequence_order int NOT NULL,
  is_required boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(learning_path_id, book_id)
);

-- Create user roadmap progress table
CREATE TABLE IF NOT EXISTS user_roadmap_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  learning_path_id uuid REFERENCES learning_paths(id) ON DELETE CASCADE NOT NULL,
  current_book_id uuid REFERENCES books(id) ON DELETE SET NULL,
  books_completed int DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_activity_at timestamptz DEFAULT now(),
  UNIQUE(user_id, learning_path_id)
);

-- Enable RLS on new tables
ALTER TABLE user_reading_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_reading_list
CREATE POLICY "Users can view their own reading list"
  ON user_reading_list FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reading list"
  ON user_reading_list FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for reading_quiz_questions
CREATE POLICY "Anyone can view quiz questions"
  ON reading_quiz_questions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage quiz questions"
  ON reading_quiz_questions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- RLS Policies for user_quiz_attempts
CREATE POLICY "Users can view their own quiz attempts"
  ON user_quiz_attempts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts"
  ON user_quiz_attempts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_paths
CREATE POLICY "Anyone can view published learning paths"
  ON learning_paths FOR SELECT TO authenticated
  USING (is_published = true OR created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can manage all learning paths"
  ON learning_paths FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- RLS Policies for roadmap_books
CREATE POLICY "Anyone can view roadmap books"
  ON roadmap_books FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage roadmap books"
  ON roadmap_books FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- RLS Policies for user_roadmap_progress
CREATE POLICY "Users can view their own roadmap progress"
  ON user_roadmap_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own roadmap progress"
  ON user_roadmap_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_book_type ON books(book_type);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating DESC);
CREATE INDEX IF NOT EXISTS idx_user_reading_list_user_id ON user_reading_list(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_list_status ON user_reading_list(status);
CREATE INDEX IF NOT EXISTS idx_reading_quiz_book_id ON reading_quiz_questions(book_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_category ON learning_paths(category);
CREATE INDEX IF NOT EXISTS idx_roadmap_books_path_id ON roadmap_books(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_books_sequence ON roadmap_books(learning_path_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_user_roadmap_progress_user_id ON user_roadmap_progress(user_id);

-- Create function to update book rating based on user ratings
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

-- Create trigger to auto-update book ratings
DROP TRIGGER IF EXISTS trigger_update_book_rating ON user_reading_list;
CREATE TRIGGER trigger_update_book_rating
  AFTER INSERT OR UPDATE OF user_rating ON user_reading_list
  FOR EACH ROW
  EXECUTE FUNCTION update_book_rating();

-- Create function to update roadmap progress
CREATE OR REPLACE FUNCTION update_roadmap_progress()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
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

-- Create trigger to auto-update roadmap progress
DROP TRIGGER IF EXISTS trigger_update_roadmap_progress ON user_reading_list;
CREATE TRIGGER trigger_update_roadmap_progress
  AFTER UPDATE OF status ON user_reading_list
  FOR EACH ROW
  EXECUTE FUNCTION update_roadmap_progress();
