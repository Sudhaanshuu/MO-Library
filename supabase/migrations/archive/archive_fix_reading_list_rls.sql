-- Enable RLS on user_reading_list table
ALTER TABLE user_reading_list ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reading list
CREATE POLICY "Users can view own reading list"
ON user_reading_list
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own reading entries
CREATE POLICY "Users can insert own reading entries"
ON user_reading_list
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reading entries
CREATE POLICY "Users can update own reading entries"
ON user_reading_list
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own reading entries
CREATE POLICY "Users can delete own reading entries"
ON user_reading_list
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Also add RLS policies for other related tables if not already present

-- Enable RLS on reading_quiz_questions (admin only can manage)
ALTER TABLE reading_quiz_questions ENABLE ROW LEVEL SECURITY;

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
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on user_quiz_attempts
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on learning_paths (everyone can view, admin can manage)
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view learning paths"
ON learning_paths
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage learning paths"
ON learning_paths
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on roadmap_books (everyone can view, admin can manage)
ALTER TABLE roadmap_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view roadmap books"
ON roadmap_books
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage roadmap books"
ON roadmap_books
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on user_roadmap_progress
ALTER TABLE user_roadmap_progress ENABLE ROW LEVEL SECURITY;

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
