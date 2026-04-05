-- Verification Script - Check Sample Data
-- Run this after populate_with_real_books.sql to verify everything was created

-- ============================================
-- 1. Check Learning Paths
-- ============================================
SELECT 
  '========== LEARNING PATHS ==========' as section;

SELECT 
  title, 
  category, 
  difficulty_level,
  estimated_duration_days as duration_days,
  is_published,
  created_at
FROM learning_paths 
ORDER BY created_at DESC 
LIMIT 10;

-- ============================================
-- 2. Check Books in Each Path
-- ============================================
SELECT 
  '========== BACKEND PATH BOOKS ==========' as section;

SELECT 
  rb.sequence_order as "#",
  b.title,
  b.author,
  CASE WHEN rb.is_required THEN '✓ Required' ELSE 'Optional' END as status,
  rb.notes
FROM roadmap_books rb
JOIN learning_paths lp ON lp.id = rb.learning_path_id
JOIN books b ON b.id = rb.book_id
WHERE lp.title = 'Backend Development Mastery'
ORDER BY rb.sequence_order;

SELECT 
  '========== FRONTEND PATH BOOKS ==========' as section;

SELECT 
  rb.sequence_order as "#",
  b.title,
  b.author,
  CASE WHEN rb.is_required THEN '✓ Required' ELSE 'Optional' END as status,
  rb.notes
FROM roadmap_books rb
JOIN learning_paths lp ON lp.id = rb.learning_path_id
JOIN books b ON b.id = rb.book_id
WHERE lp.title = 'Modern Frontend Development'
ORDER BY rb.sequence_order;

SELECT 
  '========== FULL STACK PATH BOOKS ==========' as section;

SELECT 
  rb.sequence_order as "#",
  b.title,
  b.author,
  CASE WHEN rb.is_required THEN '✓ Required' ELSE 'Optional' END as status,
  rb.notes
FROM roadmap_books rb
JOIN learning_paths lp ON lp.id = rb.learning_path_id
JOIN books b ON b.id = rb.book_id
WHERE lp.title = 'Full Stack Web Development'
ORDER BY rb.sequence_order;

SELECT 
  '========== DEVOPS PATH BOOKS ==========' as section;

SELECT 
  rb.sequence_order as "#",
  b.title,
  b.author,
  CASE WHEN rb.is_required THEN '✓ Required' ELSE 'Optional' END as status,
  rb.notes
FROM roadmap_books rb
JOIN learning_paths lp ON lp.id = rb.learning_path_id
JOIN books b ON b.id = rb.book_id
WHERE lp.title = 'DevOps & Cloud Engineering'
ORDER BY rb.sequence_order;

-- ============================================
-- 3. Check Quiz Questions
-- ============================================
SELECT 
  '========== QUIZ QUESTIONS BY BOOK ==========' as section;

SELECT 
  b.title as book_title,
  COUNT(rqq.id) as total_questions,
  SUM(CASE WHEN rqq.difficulty = 'easy' THEN 1 ELSE 0 END) as easy,
  SUM(CASE WHEN rqq.difficulty = 'medium' THEN 1 ELSE 0 END) as medium,
  SUM(CASE WHEN rqq.difficulty = 'hard' THEN 1 ELSE 0 END) as hard
FROM reading_quiz_questions rqq
JOIN books b ON b.id = rqq.book_id
GROUP BY b.title
ORDER BY total_questions DESC;

-- ============================================
-- 4. Sample Quiz Questions
-- ============================================
SELECT 
  '========== SAMPLE QUIZ QUESTIONS ==========' as section;

SELECT 
  b.title as book,
  rqq.question,
  rqq.difficulty,
  rqq.correct_answer
FROM reading_quiz_questions rqq
JOIN books b ON b.id = rqq.book_id
LIMIT 5;

-- ============================================
-- 5. Summary Statistics
-- ============================================
SELECT 
  '========== SUMMARY ==========' as section;

SELECT 
  'Total Learning Paths' as metric,
  COUNT(*)::text as value
FROM learning_paths
UNION ALL
SELECT 
  'Published Paths' as metric,
  COUNT(*)::text as value
FROM learning_paths
WHERE is_published = true
UNION ALL
SELECT 
  'Total Books in Paths' as metric,
  COUNT(*)::text as value
FROM roadmap_books
UNION ALL
SELECT 
  'Required Books' as metric,
  COUNT(*)::text as value
FROM roadmap_books
WHERE is_required = true
UNION ALL
SELECT 
  'Total Quiz Questions' as metric,
  COUNT(*)::text as value
FROM reading_quiz_questions
UNION ALL
SELECT 
  'Books with Quizzes' as metric,
  COUNT(DISTINCT book_id)::text as value
FROM reading_quiz_questions;

-- ============================================
-- 6. Check for Issues
-- ============================================
SELECT 
  '========== POTENTIAL ISSUES ==========' as section;

-- Check for paths without books
SELECT 
  'Paths without books: ' || COUNT(*) as issue
FROM learning_paths lp
LEFT JOIN roadmap_books rb ON rb.learning_path_id = lp.id
WHERE rb.id IS NULL;

-- Check for books without quizzes
SELECT 
  'Books in paths without quizzes: ' || COUNT(DISTINCT rb.book_id) as issue
FROM roadmap_books rb
LEFT JOIN reading_quiz_questions rqq ON rqq.book_id = rb.book_id
WHERE rqq.id IS NULL;

-- ============================================
-- 7. Next Steps
-- ============================================
SELECT 
  '========== NEXT STEPS ==========' as section;

SELECT 
  '1. Go to your app and login as admin' as step
UNION ALL
SELECT 
  '2. Navigate to Admin Dashboard' as step
UNION ALL
SELECT 
  '3. Click "Learning Paths" tab to see the 4 paths' as step
UNION ALL
SELECT 
  '4. Click "Quizzes" tab to see quiz questions' as step
UNION ALL
SELECT 
  '5. As a user, go to "Learning Paths" page to start a path' as step
UNION ALL
SELECT 
  '6. Mark books as completed to test progress tracking' as step
UNION ALL
SELECT 
  '7. Take a quiz to test the quiz system' as step;
