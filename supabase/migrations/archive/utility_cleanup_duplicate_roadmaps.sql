-- Step 5: Clean up duplicate roadmaps (optional)
-- This removes the duplicate empty roadmaps you have

-- Keep only these roadmap IDs (the ones with books):
-- c34b63f1-9c4b-4a36-a27a-45c0fd2704ff - Backend Development Mastery
-- a1bf7e69-f3c1-4950-8968-77b0ba634e54 - Modern Frontend Development
-- 0a554a2a-f0ff-448a-bf4d-b1727190e478 - Full Stack Web Development
-- 60e7dbb5-f31b-40f8-808a-ada517ef2ca2 - DevOps & Cloud Engineering

-- Delete duplicate roadmaps (the empty ones)
DELETE FROM learning_paths 
WHERE id IN (
    '7afda72e-d0d4-41fa-8d75-a12e3fa763a7',
    '3dbe1b41-8f36-46c3-8723-0732a50f7754',
    '43d36034-2c2f-4cf4-af49-39b01fd66a9e',
    '3eeab789-9e69-4a30-9389-0633cd781979'
);

-- Verify only 4 roadmaps remain
SELECT 
    id,
    title,
    difficulty_level,
    (SELECT COUNT(*) FROM roadmap_books WHERE learning_path_id = learning_paths.id) as book_count
FROM learning_paths
ORDER BY title;
