-- Step 1: Check current books in each roadmap
-- This query shows all learning paths and their associated books

SELECT 
    lp.id as roadmap_id,
    lp.title as roadmap_title,
    lp.description as roadmap_description,
    lp.difficulty_level,
    COUNT(DISTINCT rb.book_id) as total_books,
    STRING_AGG(DISTINCT b.title, ', ' ORDER BY b.title) as book_titles
FROM learning_paths lp
LEFT JOIN roadmap_books rb ON lp.id = rb.learning_path_id
LEFT JOIN books b ON rb.book_id = b.id
GROUP BY lp.id, lp.title, lp.description, lp.difficulty_level
ORDER BY lp.title;

-- Detailed view: Show each book in each roadmap
SELECT 
    lp.title as roadmap_title,
    lp.difficulty_level,
    b.title as book_title,
    b.author,
    b.genre,
    rb.sequence_order,
    rb.is_required
FROM learning_paths lp
LEFT JOIN roadmap_books rb ON lp.id = rb.learning_path_id
LEFT JOIN books b ON rb.book_id = b.id
ORDER BY lp.title, rb.sequence_order;

-- Check if books have quizzes
SELECT 
    lp.title as roadmap_title,
    b.title as book_title,
    COUNT(q.id) as quiz_count
FROM learning_paths lp
LEFT JOIN roadmap_books rb ON lp.id = rb.learning_path_id
LEFT JOIN books b ON rb.book_id = b.id
LEFT JOIN reading_quiz_questions q ON b.id = q.book_id
GROUP BY lp.title, b.title
ORDER BY lp.title, b.title;
