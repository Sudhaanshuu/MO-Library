-- Sample Quizzes and Learning Paths
-- Run this after your books are imported

-- ============================================
-- SAMPLE LEARNING PATHS
-- ============================================

-- 1. Backend Development Path
INSERT INTO learning_paths (id, title, description, category, difficulty_level, estimated_duration_days, is_published)
VALUES 
(
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'Backend Development Mastery',
  'Master backend development from fundamentals to advanced concepts. Learn server-side programming, databases, APIs, and scalable architecture.',
  'Backend Development',
  'intermediate',
  120,
  true
);

-- 2. Frontend Development Path
INSERT INTO learning_paths (id, title, description, category, difficulty_level, estimated_duration_days, is_published)
VALUES 
(
  'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  'Modern Frontend Development',
  'Become a frontend expert with modern frameworks, responsive design, and best practices. Build beautiful, performant user interfaces.',
  'Frontend Development',
  'beginner',
  90,
  true
);

-- 3. Full Stack Development Path
INSERT INTO learning_paths (id, title, description, category, difficulty_level, estimated_duration_days, is_published)
VALUES 
(
  'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
  'Full Stack Web Development',
  'Complete full stack journey covering both frontend and backend. Build end-to-end web applications with modern technologies.',
  'Full Stack Development',
  'advanced',
  180,
  true
);

-- 4. DevOps & Cloud Path
INSERT INTO learning_paths (id, title, description, category, difficulty_level, estimated_duration_days, is_published)
VALUES 
(
  'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
  'DevOps & Cloud Engineering',
  'Learn deployment, CI/CD, containerization, and cloud platforms. Master the tools that power modern software delivery.',
  'DevOps',
  'intermediate',
  100,
  true
);

-- ============================================
-- SAMPLE BOOKS FOR PATHS
-- Note: Replace these book_ids with actual IDs from your books table
-- You'll need to run: SELECT id, title FROM books WHERE title LIKE '%keyword%';
-- ============================================

-- Example: Adding books to Backend Development Path
-- IMPORTANT: Replace these UUIDs with actual book IDs from your database

-- Backend Path Books (adjust book_ids to match your actual books)
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
-- Replace 'book-uuid-1' with actual book ID for a Node.js or Python book
(
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'book-uuid-1', -- Replace with actual book ID
  1,
  true,
  'Start with server-side programming fundamentals. Learn about HTTP, REST APIs, and basic server architecture.'
),
(
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'book-uuid-2', -- Replace with actual book ID
  2,
  true,
  'Deep dive into databases. Understand SQL, NoSQL, data modeling, and query optimization.'
),
(
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'book-uuid-3', -- Replace with actual book ID
  3,
  true,
  'Learn API design patterns, authentication, and security best practices.'
),
(
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'book-uuid-4', -- Replace with actual book ID
  4,
  false,
  'Advanced topics: microservices, caching, message queues, and scalability.'
);

-- Frontend Path Books (adjust book_ids to match your actual books)
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
(
  'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  'book-uuid-5', -- Replace with actual book ID for HTML/CSS
  1,
  true,
  'Master HTML5 and CSS3. Learn semantic markup, flexbox, grid, and responsive design.'
),
(
  'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  'book-uuid-6', -- Replace with actual book ID for JavaScript
  2,
  true,
  'JavaScript fundamentals: ES6+, DOM manipulation, async programming, and modern syntax.'
),
(
  'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  'book-uuid-7', -- Replace with actual book ID for React/Vue
  3,
  true,
  'Learn a modern framework. Understand components, state management, and routing.'
),
(
  'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  'book-uuid-8', -- Replace with actual book ID
  4,
  false,
  'Advanced: Performance optimization, testing, and accessibility.'
);

-- ============================================
-- SAMPLE QUIZ QUESTIONS
-- Note: Replace book_id with actual IDs from your books table
-- ============================================

-- Quiz for a Backend/Node.js Book (replace book_id)
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
(
  'book-uuid-1', -- Replace with actual book ID
  'What is the primary purpose of Express.js in Node.js development?',
  'Database management',
  'Web application framework for routing and middleware',
  'Frontend rendering',
  'File system operations',
  'B',
  'easy'
),
(
  'book-uuid-1', -- Replace with actual book ID
  'Which method is used to handle POST requests in Express.js?',
  'app.get()',
  'app.post()',
  'app.send()',
  'app.request()',
  'B',
  'easy'
),
(
  'book-uuid-1', -- Replace with actual book ID
  'What is middleware in Express.js?',
  'A database connector',
  'Functions that execute during the request-response cycle',
  'A frontend library',
  'A testing framework',
  'B',
  'medium'
),
(
  'book-uuid-1', -- Replace with actual book ID
  'Which of the following is NOT a valid HTTP method?',
  'GET',
  'POST',
  'FETCH',
  'DELETE',
  'C',
  'easy'
),
(
  'book-uuid-1', -- Replace with actual book ID
  'What does REST stand for in RESTful APIs?',
  'Representational State Transfer',
  'Remote Execution State Transfer',
  'Rapid Execution Service Technology',
  'Resource Execution State Technology',
  'A',
  'medium'
);

-- Quiz for a Database Book (replace book_id)
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
(
  'book-uuid-2', -- Replace with actual book ID
  'What does SQL stand for?',
  'Structured Query Language',
  'Simple Question Language',
  'Standard Query Logic',
  'System Query Language',
  'A',
  'easy'
),
(
  'book-uuid-2', -- Replace with actual book ID
  'Which SQL command is used to retrieve data from a database?',
  'GET',
  'FETCH',
  'SELECT',
  'RETRIEVE',
  'C',
  'easy'
),
(
  'book-uuid-2', -- Replace with actual book ID
  'What is a primary key in a database?',
  'The first column in a table',
  'A unique identifier for each record',
  'The most important data field',
  'A password for database access',
  'B',
  'medium'
),
(
  'book-uuid-2', -- Replace with actual book ID
  'Which of these is a NoSQL database?',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Oracle',
  'C',
  'easy'
),
(
  'book-uuid-2', -- Replace with actual book ID
  'What is database normalization?',
  'Making all data uppercase',
  'Organizing data to reduce redundancy',
  'Encrypting sensitive data',
  'Backing up the database',
  'B',
  'hard'
);

-- Quiz for a Frontend/JavaScript Book (replace book_id)
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
(
  'book-uuid-6', -- Replace with actual book ID
  'What is the correct way to declare a variable in modern JavaScript?',
  'var x = 5',
  'let x = 5 or const x = 5',
  'variable x = 5',
  'int x = 5',
  'B',
  'easy'
),
(
  'book-uuid-6', -- Replace with actual book ID
  'What is the difference between let and const?',
  'No difference',
  'let is for numbers, const is for strings',
  'const cannot be reassigned, let can be',
  'let is faster than const',
  'C',
  'medium'
),
(
  'book-uuid-6', -- Replace with actual book ID
  'What does DOM stand for?',
  'Document Object Model',
  'Data Object Management',
  'Digital Optimization Method',
  'Document Orientation Mode',
  'A',
  'easy'
),
(
  'book-uuid-6', -- Replace with actual book ID
  'Which method is used to add an event listener in JavaScript?',
  'attachEvent()',
  'addEventListener()',
  'addListener()',
  'onEvent()',
  'B',
  'easy'
),
(
  'book-uuid-6', -- Replace with actual book ID
  'What is a Promise in JavaScript?',
  'A guarantee that code will work',
  'An object representing eventual completion or failure of an async operation',
  'A type of variable',
  'A debugging tool',
  'B',
  'medium'
);

-- Quiz for a React/Frontend Framework Book (replace book_id)
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
(
  'book-uuid-7', -- Replace with actual book ID
  'What is JSX in React?',
  'A JavaScript extension',
  'A syntax extension that allows writing HTML in JavaScript',
  'A CSS framework',
  'A testing library',
  'B',
  'easy'
),
(
  'book-uuid-7', -- Replace with actual book ID
  'What is the purpose of useState hook in React?',
  'To style components',
  'To manage component state',
  'To fetch data from APIs',
  'To route between pages',
  'B',
  'easy'
),
(
  'book-uuid-7', -- Replace with actual book ID
  'What is the Virtual DOM in React?',
  'A physical server',
  'A lightweight copy of the actual DOM for efficient updates',
  'A database',
  'A CSS framework',
  'B',
  'medium'
),
(
  'book-uuid-7', -- Replace with actual book ID
  'Which hook is used for side effects in React?',
  'useState',
  'useEffect',
  'useContext',
  'useReducer',
  'B',
  'medium'
),
(
  'book-uuid-7', -- Replace with actual book ID
  'What is prop drilling in React?',
  'A debugging technique',
  'Passing props through multiple component levels',
  'A performance optimization',
  'A routing method',
  'B',
  'hard'
);

-- ============================================
-- HELPER QUERY: Find your book IDs
-- ============================================

-- Run this to find book IDs for your actual books:
-- SELECT id, title, author FROM books WHERE title ILIKE '%node%' OR title ILIKE '%javascript%' OR title ILIKE '%react%';
-- SELECT id, title, author FROM books WHERE title ILIKE '%database%' OR title ILIKE '%sql%';
-- SELECT id, title, author FROM books WHERE title ILIKE '%python%' OR title ILIKE '%backend%';

-- Then replace 'book-uuid-1', 'book-uuid-2', etc. with actual IDs

-- ============================================
-- INSTRUCTIONS FOR USE:
-- ============================================

-- 1. First, find your actual book IDs:
--    SELECT id, title FROM books ORDER BY title;

-- 2. Replace all 'book-uuid-X' placeholders with real book IDs

-- 3. Run this script in Supabase SQL Editor

-- 4. Verify the data:
--    SELECT * FROM learning_paths;
--    SELECT * FROM roadmap_books;
--    SELECT * FROM reading_quiz_questions;

-- 5. Test in the app:
--    - Go to Admin → Learning Paths (should see 4 paths)
--    - Go to Admin → Quizzes (should see questions)
--    - Go to Learning Paths page as user (should see published paths)
