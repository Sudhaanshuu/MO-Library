-- Step 2: Remove all incorrect book associations from roadmaps
-- This only removes the associations, NOT the books themselves

-- Delete all entries from roadmap_books table
DELETE FROM roadmap_books;

-- Verify deletion
SELECT 
    lp.title as roadmap_title,
    COUNT(rb.id) as remaining_books
FROM learning_paths lp
LEFT JOIN roadmap_books rb ON lp.id = rb.learning_path_id
GROUP BY lp.title
ORDER BY lp.title;

-- Should show 0 books for all roadmaps
