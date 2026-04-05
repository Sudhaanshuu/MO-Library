-- ============================================
-- Query 1: Books WITH Quizzes (Detailed)
-- ============================================

SELECT 
  b.id,
  b.title,
  b.author,
  b.genre,
  COUNT(rqq.id) as total_questions,
  SUM(CASE WHEN rqq.difficulty = 'easy' THEN 1 ELSE 0 END) as easy_questions,
  SUM(CASE WHEN rqq.difficulty = 'medium' THEN 1 ELSE 0 END) as medium_questions,
  SUM(CASE WHEN rqq.difficulty = 'hard' THEN 1 ELSE 0 END) as hard_questions
FROM books b
INNER JOIN reading_quiz_questions rqq ON rqq.book_id = b.id
GROUP BY b.id, b.title, b.author, b.genre
ORDER BY total_questions DESC, b.title;

-- ============================================
-- Query 2: Books WITHOUT Quizzes
-- ============================================

SELECT 
  b.id,
  b.title,
  b.author,
  b.genre,
  'No quiz yet' as status
FROM books b
LEFT JOIN reading_quiz_questions rqq ON rqq.book_id = b.id
WHERE rqq.id IS NULL
ORDER BY b.title;

-- ============================================
-- Query 3: Simple List - Books with Quiz Count
-- ============================================

SELECT 
  b.title,
  b.author,
  COUNT(rqq.id) as question_count
FROM books b
LEFT JOIN reading_quiz_questions rqq ON rqq.book_id = b.id
GROUP BY b.id, b.title, b.author
HAVING COUNT(rqq.id) > 0
ORDER BY question_count DESC, b.title;

-- ============================================
-- Query 4: Books with Quiz IDs (for copying)
-- ============================================

SELECT 
  b.id as book_id,
  b.title,
  COUNT(rqq.id) as questions
FROM books b
INNER JOIN reading_quiz_questions rqq ON rqq.book_id = b.id
GROUP BY b.id, b.title
ORDER BY b.title;

-- ============================================
-- Query 5: Summary Statistics
-- ============================================

SELECT 
  'Total Books' as metric,
  COUNT(*)::text as value
FROM books
UNION ALL
SELECT 
  'Books with Quizzes' as metric,
  COUNT(DISTINCT book_id)::text as value
FROM reading_quiz_questions
UNION ALL
SELECT 
  'Books without Quizzes' as metric,
  (SELECT COUNT(*) FROM books) - COUNT(DISTINCT book_id)::text as value
FROM reading_quiz_questions
UNION ALL
SELECT 
  'Total Quiz Questions' as metric,
  COUNT(*)::text as value
FROM reading_quiz_questions;

-- ============================================
-- Query 6: Books in Learning Paths with Quiz Status
-- ============================================

SELECT 
  lp.title as learning_path,
  b.title as book_title,
  b.author,
  rb.sequence_order,
  CASE 
    WHEN COUNT(rqq.id) > 0 THEN '✓ Has Quiz (' || COUNT(rqq.id) || ' questions)'
    ELSE '✗ No Quiz'
  END as quiz_status
FROM roadmap_books rb
JOIN learning_paths lp ON lp.id = rb.learning_path_id
JOIN books b ON b.id = rb.book_id
LEFT JOIN reading_quiz_questions rqq ON rqq.book_id = b.id
GROUP BY lp.title, b.title, b.author, rb.sequence_order
ORDER BY lp.title, rb.sequence_order;

-- ============================================
-- Query 7: Show Sample Questions for Each Book
-- ============================================

SELECT 
  b.title as book,
  rqq.question,
  rqq.difficulty,
  rqq.correct_answer
FROM books b
INNER JOIN reading_quiz_questions rqq ON rqq.book_id = b.id
ORDER BY b.title, rqq.created_at
LIMIT 20;

-- ============================================
-- Query 8: Books Ready for Quiz (Completed by Users)
-- ============================================

SELECT DISTINCT
  b.id,
  b.title,
  b.author,
  COUNT(DISTINCT url.user_id) as users_completed,
  CASE 
    WHEN COUNT(rqq.id) > 0 THEN '✓ Quiz Available'
    ELSE '✗ Need to Create Quiz'
  END as quiz_status,
  COUNT(rqq.id) as question_count
FROM books b
INNER JOIN user_reading_list url ON url.book_id = b.id
LEFT JOIN reading_quiz_questions rqq ON rqq.book_id = b.id
WHERE url.status = 'completed'
GROUP BY b.id, b.title, b.author
ORDER BY users_completed DESC, b.title;
