-- Automated Sample Data Population
-- This script will automatically find books and create quizzes/paths

-- ============================================
-- STEP 1: Create Learning Paths
-- ============================================

DO $$
DECLARE
  backend_path_id uuid := gen_random_uuid();
  frontend_path_id uuid := gen_random_uuid();
  fullstack_path_id uuid := gen_random_uuid();
  devops_path_id uuid := gen_random_uuid();
BEGIN

-- Insert Learning Paths
INSERT INTO learning_paths (id, title, description, category, difficulty_level, estimated_duration_days, is_published)
VALUES 
(
  backend_path_id,
  'Backend Development Mastery',
  'Master backend development from fundamentals to advanced concepts. Learn server-side programming, databases, APIs, and scalable architecture.',
  'Backend Development',
  'intermediate',
  120,
  true
),
(
  frontend_path_id,
  'Modern Frontend Development',
  'Become a frontend expert with modern frameworks, responsive design, and best practices. Build beautiful, performant user interfaces.',
  'Frontend Development',
  'beginner',
  90,
  true
),
(
  fullstack_path_id,
  'Full Stack Web Development',
  'Complete full stack journey covering both frontend and backend. Build end-to-end web applications with modern technologies.',
  'Full Stack Development',
  'advanced',
  180,
  true
),
(
  devops_path_id,
  'DevOps & Cloud Engineering',
  'Learn deployment, CI/CD, containerization, and cloud platforms. Master the tools that power modern software delivery.',
  'DevOps',
  'intermediate',
  100,
  true
);

RAISE NOTICE 'Learning paths created successfully!';
RAISE NOTICE 'Backend Path ID: %', backend_path_id;
RAISE NOTICE 'Frontend Path ID: %', frontend_path_id;
RAISE NOTICE 'Fullstack Path ID: %', fullstack_path_id;
RAISE NOTICE 'DevOps Path ID: %', devops_path_id;

END $$;

-- ============================================
-- STEP 2: Find and Display Available Books
-- ============================================

-- Show books that might be good for backend path
SELECT 
  'BACKEND BOOKS:' as category,
  id, 
  title, 
  author 
FROM books 
WHERE 
  title ILIKE ANY(ARRAY['%node%', '%python%', '%java%', '%backend%', '%api%', '%server%', '%express%', '%django%', '%spring%'])
  OR description ILIKE ANY(ARRAY['%backend%', '%server%', '%api%'])
LIMIT 10;

-- Show books that might be good for frontend path
SELECT 
  'FRONTEND BOOKS:' as category,
  id, 
  title, 
  author 
FROM books 
WHERE 
  title ILIKE ANY(ARRAY['%javascript%', '%react%', '%vue%', '%angular%', '%html%', '%css%', '%frontend%', '%web design%'])
  OR description ILIKE ANY(ARRAY['%frontend%', '%javascript%', '%react%'])
LIMIT 10;

-- Show books that might be good for database/backend
SELECT 
  'DATABASE BOOKS:' as category,
  id, 
  title, 
  author 
FROM books 
WHERE 
  title ILIKE ANY(ARRAY['%database%', '%sql%', '%mongodb%', '%postgres%', '%mysql%', '%redis%'])
  OR description ILIKE ANY(ARRAY['%database%', '%sql%'])
LIMIT 10;

-- Show books that might be good for DevOps
SELECT 
  'DEVOPS BOOKS:' as category,
  id, 
  title, 
  author 
FROM books 
WHERE 
  title ILIKE ANY(ARRAY['%docker%', '%kubernetes%', '%devops%', '%cloud%', '%aws%', '%azure%', '%ci/cd%', '%jenkins%'])
  OR description ILIKE ANY(ARRAY['%devops%', '%cloud%', '%deployment%'])
LIMIT 10;

-- ============================================
-- STEP 3: Manual Book Assignment Template
-- ============================================

-- Copy the book IDs from above and use this template:

/*
-- Get the path IDs first
SELECT id, title FROM learning_paths ORDER BY created_at DESC LIMIT 4;

-- Then add books to paths (replace the UUIDs):

-- Backend Path Books
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('BACKEND_PATH_ID', 'BOOK_ID_1', 1, true, 'Introduction to backend development'),
('BACKEND_PATH_ID', 'BOOK_ID_2', 2, true, 'Database fundamentals'),
('BACKEND_PATH_ID', 'BOOK_ID_3', 3, true, 'API design and development'),
('BACKEND_PATH_ID', 'BOOK_ID_4', 4, false, 'Advanced backend concepts');

-- Frontend Path Books
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('FRONTEND_PATH_ID', 'BOOK_ID_5', 1, true, 'HTML and CSS fundamentals'),
('FRONTEND_PATH_ID', 'BOOK_ID_6', 2, true, 'JavaScript essentials'),
('FRONTEND_PATH_ID', 'BOOK_ID_7', 3, true, 'Modern frontend frameworks'),
('FRONTEND_PATH_ID', 'BOOK_ID_8', 4, false, 'Advanced frontend topics');
*/

-- ============================================
-- STEP 4: Create Sample Quiz Questions
-- ============================================

-- Generic programming quiz (works for any programming book)
-- Replace 'YOUR_BOOK_ID' with an actual book ID

/*
-- Example: Create quiz for a programming book
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
(
  'YOUR_BOOK_ID',
  'What is a variable in programming?',
  'A function that changes',
  'A container for storing data values',
  'A type of loop',
  'A programming language',
  'B',
  'easy'
),
(
  'YOUR_BOOK_ID',
  'What does API stand for?',
  'Application Programming Interface',
  'Advanced Programming Integration',
  'Automated Program Interaction',
  'Application Process Integration',
  'A',
  'easy'
),
(
  'YOUR_BOOK_ID',
  'What is the purpose of version control systems like Git?',
  'To write code faster',
  'To track changes and collaborate on code',
  'To compile programs',
  'To debug applications',
  'B',
  'medium'
),
(
  'YOUR_BOOK_ID',
  'What is the difference between frontend and backend?',
  'Frontend is harder than backend',
  'Frontend is client-side, backend is server-side',
  'Frontend uses databases, backend uses HTML',
  'There is no difference',
  'B',
  'easy'
),
(
  'YOUR_BOOK_ID',
  'What is a framework in software development?',
  'A physical structure for computers',
  'A reusable platform for building applications',
  'A type of programming language',
  'A debugging tool',
  'B',
  'medium'
);
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check created paths
SELECT 
  title, 
  category, 
  difficulty_level, 
  is_published,
  created_at
FROM learning_paths 
ORDER BY created_at DESC 
LIMIT 10;

-- Check books in paths
SELECT 
  lp.title as path_title,
  rb.sequence_order,
  b.title as book_title,
  rb.is_required,
  rb.notes
FROM roadmap_books rb
JOIN learning_paths lp ON lp.id = rb.learning_path_id
JOIN books b ON b.id = rb.book_id
ORDER BY lp.title, rb.sequence_order;

-- Check quiz questions
SELECT 
  b.title as book_title,
  COUNT(rqq.id) as question_count
FROM reading_quiz_questions rqq
JOIN books b ON b.id = rqq.book_id
GROUP BY b.title
ORDER BY question_count DESC;

-- ============================================
-- QUICK START GUIDE
-- ============================================

/*
1. Run this script to create the 4 learning paths

2. Look at the output to see available books

3. Use the Admin UI to:
   - Go to "Learning Paths" tab
   - Click on each path
   - Click "Add Book" to add books
   - Reorder as needed

4. Use the Admin UI to create quizzes:
   - Go to "Quizzes" tab
   - Select a book
   - Add 5-10 questions per book

OR manually add books and quizzes using the templates above!
*/
