-- Complete Sample Data with Real Book IDs
-- This script uses your actual book IDs to create learning paths and quizzes

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

-- ============================================
-- STEP 2: Add Books to Backend Path
-- ============================================

-- Backend Path Books (using first 4 book IDs)
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
(
  backend_path_id,
  'ff0cea23-da62-429c-a5ea-515d1cfe806b',
  1,
  true,
  'Start with server-side programming fundamentals. Learn about HTTP, REST APIs, and basic server architecture.'
),
(
  backend_path_id,
  'ca3a121a-0d9d-4cd6-bc71-8db9194e40c1',
  2,
  true,
  'Deep dive into databases. Understand SQL, NoSQL, data modeling, and query optimization.'
),
(
  backend_path_id,
  'ed1602ac-8bab-44de-a9f2-679c98130cce',
  3,
  true,
  'Learn API design patterns, authentication, and security best practices.'
),
(
  backend_path_id,
  '0d30d209-096d-472f-bcd1-868be53ca533',
  4,
  false,
  'Advanced topics: microservices, caching, message queues, and scalability.'
);

RAISE NOTICE 'Added books to Backend path';

-- ============================================
-- STEP 3: Add Books to Frontend Path
-- ============================================

-- Frontend Path Books (using next 4 book IDs)
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
(
  frontend_path_id,
  '53ee34cd-d2f5-4e3b-bb66-a3450e9a41b6',
  1,
  true,
  'Master HTML5 and CSS3. Learn semantic markup, flexbox, grid, and responsive design.'
),
(
  frontend_path_id,
  'ac129d95-20ca-4a3a-9a11-8b3b3ca16f1e',
  2,
  true,
  'JavaScript fundamentals: ES6+, DOM manipulation, async programming, and modern syntax.'
),
(
  frontend_path_id,
  '9a13b91f-2d35-4a2c-b7e5-7add0596d556',
  3,
  true,
  'Learn a modern framework. Understand components, state management, and routing.'
),
(
  frontend_path_id,
  '69c950a2-d599-41bf-a479-e19bc6ec2b69',
  4,
  false,
  'Advanced: Performance optimization, testing, and accessibility.'
);

RAISE NOTICE 'Added books to Frontend path';

-- ============================================
-- STEP 4: Add Books to Full Stack Path
-- ============================================

-- Full Stack Path Books (using next 6 book IDs)
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
(
  fullstack_path_id,
  '7e4c2302-1b7a-45d6-84ed-4d870cd0cbaa',
  1,
  true,
  'Full stack overview: Understanding the complete web development ecosystem.'
),
(
  fullstack_path_id,
  '54b2b0ac-b534-4d4c-aa4b-f0c911e9bfe8',
  2,
  true,
  'Frontend fundamentals: Building user interfaces and client-side logic.'
),
(
  fullstack_path_id,
  'd0753d75-7457-4798-91ed-2b9682d911a8',
  3,
  true,
  'Backend development: Server-side programming and business logic.'
),
(
  fullstack_path_id,
  'f198fded-2505-444e-8e6e-780e31c83ade',
  4,
  true,
  'Database design and management for full stack applications.'
),
(
  fullstack_path_id,
  'ed325015-eaff-4ee9-961c-351b1a7485fa',
  5,
  false,
  'Deployment and DevOps basics for full stack developers.'
),
(
  fullstack_path_id,
  '9db7191c-9990-474c-be67-7efb184bb506',
  6,
  false,
  'Advanced full stack topics: Real-time features, microservices, and scaling.'
);

RAISE NOTICE 'Added books to Full Stack path';

-- ============================================
-- STEP 5: Add Books to DevOps Path
-- ============================================

-- DevOps Path Books (using next 4 book IDs)
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
(
  devops_path_id,
  'd6540187-9878-4a84-830b-d4e9637d531d',
  1,
  true,
  'Introduction to DevOps: Culture, practices, and tools.'
),
(
  devops_path_id,
  'be423428-8c32-47fc-899f-2e8077c4246c',
  2,
  true,
  'Containerization with Docker: Building and managing containers.'
),
(
  devops_path_id,
  'cb83a4af-63fd-4446-9eb7-fa1a0459883e',
  3,
  true,
  'CI/CD pipelines: Automating build, test, and deployment.'
),
(
  devops_path_id,
  'c0cacfcd-0163-43cf-ad8f-e021e90b1602',
  4,
  false,
  'Cloud platforms and orchestration: Kubernetes, AWS, Azure.'
);

RAISE NOTICE 'Added books to DevOps path';

END $$;

-- ============================================
-- STEP 6: Create Quiz Questions
-- ============================================

-- Quiz for Book 1 (Backend fundamentals)
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
(
  'ff0cea23-da62-429c-a5ea-515d1cfe806b',
  'What is the primary purpose of a backend server?',
  'Display web pages',
  'Process business logic and manage data',
  'Style user interfaces',
  'Run JavaScript in the browser',
  'B',
  'easy'
),
(
  'ff0cea23-da62-429c-a5ea-515d1cfe806b',
  'Which HTTP method is used to retrieve data?',
  'POST',
  'PUT',
  'GET',
  'DELETE',
  'C',
  'easy'
),
(
  'ff0cea23-da62-429c-a5ea-515d1cfe806b',
  'What does REST stand for in RESTful APIs?',
  'Representational State Transfer',
  'Remote Execution State Transfer',
  'Rapid Execution Service Technology',
  'Resource Execution State Technology',
  'A',
  'medium'
),
(
  'ff0cea23-da62-429c-a5ea-515d1cfe806b',
  'What is middleware in backend development?',
  'A database connector',
  'Functions that execute during request-response cycle',
  'A frontend library',
  'A testing framework',
  'B',
  'medium'
),
(
  'ff0cea23-da62-429c-a5ea-515d1cfe806b',
  'Which status code indicates a successful HTTP request?',
  '404',
  '500',
  '200',
  '301',
  'C',
  'easy'
);

-- Quiz for Book 2 (Database)
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
(
  'ca3a121a-0d9d-4cd6-bc71-8db9194e40c1',
  'What does SQL stand for?',
  'Structured Query Language',
  'Simple Question Language',
  'Standard Query Logic',
  'System Query Language',
  'A',
  'easy'
),
(
  'ca3a121a-0d9d-4cd6-bc71-8db9194e40c1',
  'Which SQL command is used to retrieve data?',
  'GET',
  'FETCH',
  'SELECT',
  'RETRIEVE',
  'C',
  'easy'
),
(
  'ca3a121a-0d9d-4cd6-bc71-8db9194e40c1',
  'What is a primary key in a database?',
  'The first column in a table',
  'A unique identifier for each record',
  'The most important data field',
  'A password for database access',
  'B',
  'medium'
),
(
  'ca3a121a-0d9d-4cd6-bc71-8db9194e40c1',
  'Which of these is a NoSQL database?',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Oracle',
  'C',
  'easy'
),
(
  'ca3a121a-0d9d-4cd6-bc71-8db9194e40c1',
  'What is database normalization?',
  'Making all data uppercase',
  'Organizing data to reduce redundancy',
  'Encrypting sensitive data',
  'Backing up the database',
  'B',
  'hard'
);

-- Quiz for Book 5 (Frontend/HTML/CSS)
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
(
  '53ee34cd-d2f5-4e3b-bb66-a3450e9a41b6',
  'What does HTML stand for?',
  'Hyper Text Markup Language',
  'High Tech Modern Language',
  'Home Tool Markup Language',
  'Hyperlinks and Text Markup Language',
  'A',
  'easy'
),
(
  '53ee34cd-d2f5-4e3b-bb66-a3450e9a41b6',
  'Which CSS property is used for text color?',
  'text-color',
  'font-color',
  'color',
  'text-style',
  'C',
  'easy'
),
(
  '53ee34cd-d2f5-4e3b-bb66-a3450e9a41b6',
  'What is the purpose of CSS Flexbox?',
  'Add animations',
  'Create flexible layouts',
  'Style text',
  'Add images',
  'B',
  'medium'
),
(
  '53ee34cd-d2f5-4e3b-bb66-a3450e9a41b6',
  'Which HTML tag is used for the largest heading?',
  '<heading>',
  '<h6>',
  '<h1>',
  '<head>',
  'C',
  'easy'
),
(
  '53ee34cd-d2f5-4e3b-bb66-a3450e9a41b6',
  'What does CSS stand for?',
  'Computer Style Sheets',
  'Cascading Style Sheets',
  'Creative Style Sheets',
  'Colorful Style Sheets',
  'B',
  'easy'
);

-- Quiz for Book 6 (JavaScript)
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
(
  'ac129d95-20ca-4a3a-9a11-8b3b3ca16f1e',
  'What is the correct way to declare a variable in modern JavaScript?',
  'var x = 5',
  'let x = 5 or const x = 5',
  'variable x = 5',
  'int x = 5',
  'B',
  'easy'
),
(
  'ac129d95-20ca-4a3a-9a11-8b3b3ca16f1e',
  'What does DOM stand for?',
  'Document Object Model',
  'Data Object Management',
  'Digital Optimization Method',
  'Document Orientation Mode',
  'A',
  'easy'
),
(
  'ac129d95-20ca-4a3a-9a11-8b3b3ca16f1e',
  'Which method is used to add an event listener?',
  'attachEvent()',
  'addEventListener()',
  'addListener()',
  'onEvent()',
  'B',
  'easy'
),
(
  'ac129d95-20ca-4a3a-9a11-8b3b3ca16f1e',
  'What is a Promise in JavaScript?',
  'A guarantee that code will work',
  'An object representing eventual completion of async operation',
  'A type of variable',
  'A debugging tool',
  'B',
  'medium'
),
(
  'ac129d95-20ca-4a3a-9a11-8b3b3ca16f1e',
  'What is the difference between == and === in JavaScript?',
  'No difference',
  '== checks value, === checks value and type',
  '=== is faster',
  '== is deprecated',
  'B',
  'medium'
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check created paths
SELECT 
  id,
  title, 
  category, 
  difficulty_level, 
  is_published
FROM learning_paths 
ORDER BY created_at DESC 
LIMIT 10;

-- Check books in paths with titles
SELECT 
  lp.title as path_title,
  rb.sequence_order,
  b.title as book_title,
  b.author,
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

-- Summary
SELECT 
  'Learning Paths Created' as item,
  COUNT(*) as count
FROM learning_paths
WHERE created_at > NOW() - INTERVAL '1 minute'
UNION ALL
SELECT 
  'Books Added to Paths' as item,
  COUNT(*) as count
FROM roadmap_books
WHERE created_at > NOW() - INTERVAL '1 minute'
UNION ALL
SELECT 
  'Quiz Questions Created' as item,
  COUNT(*) as count
FROM reading_quiz_questions
WHERE created_at > NOW() - INTERVAL '1 minute';
