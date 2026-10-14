-- Step 10: Insert sample books and create learning paths
-- This creates proper programming books and organizes them into learning paths

-- ============================================
-- FIRST: Create Learning Paths
-- ============================================

INSERT INTO learning_paths (id, title, description, category, difficulty_level, estimated_duration_days, is_published)
VALUES 
(
  'c34b63f1-9c4b-4a36-a27a-45c0fd2704ff',
  'Backend Development Mastery',
  'Master backend development from fundamentals to advanced concepts. Learn server-side programming, databases, APIs, and scalable architecture.',
  'Backend Development',
  'intermediate',
  120,
  true
),
(
  'a1bf7e69-f3c1-4950-8968-77b0ba634e54',
  'Modern Frontend Development',
  'Become a frontend expert with modern frameworks, responsive design, and best practices. Build beautiful, performant user interfaces.',
  'Frontend Development',
  'beginner',
  90,
  true
),
(
  '0a554a2a-f0ff-448a-bf4d-b1727190e478',
  'Full Stack Web Development',
  'Complete full stack journey covering both frontend and backend. Build end-to-end web applications with modern technologies.',
  'Full Stack Development',
  'advanced',
  180,
  true
),
(
  '60e7dbb5-f31b-40f8-808a-ada517ef2ca2',
  'DevOps & Cloud Engineering',
  'Learn deployment, CI/CD, containerization, and cloud platforms. Master the tools that power modern software delivery.',
  'DevOps',
  'intermediate',
  100,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Verify learning paths were created
SELECT id, title, difficulty_level FROM learning_paths ORDER BY title;

-- ============================================
-- BACKEND DEVELOPMENT BOOKS
-- ============================================

-- Book 1: Node.js Fundamentals
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Node.js Design Patterns',
  'Mario Casciaro',
  'Programming',
  'Backend Development',
  'Master Node.js development with proven patterns and best practices. Learn asynchronous programming, streams, and scalable architecture.',
  'both',
  526,
  'English',
  2020,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 2: Database Design
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '11111111-1111-1111-1111-111111111112',
  'Database Design and Implementation',
  'Edward Sciore',
  'Programming',
  'Database',
  'Comprehensive guide to database design, SQL, NoSQL, and data modeling. Learn to build efficient and scalable database systems.',
  'both',
  450,
  'English',
  2021,
  4.3
) ON CONFLICT (id) DO NOTHING;

-- Book 3: RESTful API Design
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '11111111-1111-1111-1111-111111111113',
  'RESTful Web API Design with Node.js',
  'Valentin Bojinov',
  'Programming',
  'API Development',
  'Learn to design and build RESTful APIs with Node.js. Master authentication, security, and API best practices.',
  'both',
  380,
  'English',
  2022,
  4.4
) ON CONFLICT (id) DO NOTHING;

-- Book 4: Microservices Architecture
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '11111111-1111-1111-1111-111111111114',
  'Building Microservices',
  'Sam Newman',
  'Programming',
  'Architecture',
  'Advanced guide to microservices architecture, distributed systems, and scalable backend design.',
  'both',
  615,
  'English',
  2021,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FRONTEND DEVELOPMENT BOOKS
-- ============================================

-- Book 1: HTML & CSS Fundamentals
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '22222222-2222-2222-2222-222222222221',
  'HTML and CSS: Design and Build Websites',
  'Jon Duckett',
  'Programming',
  'Frontend Development',
  'Beautiful introduction to HTML5 and CSS3. Learn semantic markup, responsive design, and modern web standards.',
  'both',
  490,
  'English',
  2021,
  4.7
) ON CONFLICT (id) DO NOTHING;

-- Book 2: JavaScript Mastery
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'JavaScript: The Definitive Guide',
  'David Flanagan',
  'Programming',
  'JavaScript',
  'Complete guide to JavaScript. Master ES6+, async programming, DOM manipulation, and modern JavaScript patterns.',
  'both',
  706,
  'English',
  2020,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 3: React Development
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '22222222-2222-2222-2222-222222222223',
  'Learning React: Modern Patterns for Developing React Apps',
  'Alex Banks & Eve Porcello',
  'Programming',
  'React',
  'Learn React from the ground up. Master hooks, state management, routing, and building production-ready applications.',
  'both',
  310,
  'English',
  2022,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- Book 4: Advanced Frontend
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '22222222-2222-2222-2222-222222222224',
  'Web Performance in Action',
  'Jeremy Wagner',
  'Programming',
  'Performance',
  'Advanced frontend optimization. Learn performance testing, accessibility, and building fast, efficient web applications.',
  'both',
  376,
  'English',
  2021,
  4.4
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FULL STACK DEVELOPMENT BOOKS
-- ============================================

-- Book 1: Full Stack Foundations
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333331',
  'Full Stack JavaScript Development',
  'Eric Bush',
  'Programming',
  'Full Stack',
  'Complete guide to full stack development with JavaScript. Learn both frontend and backend with modern tools.',
  'both',
  420,
  'English',
  2021,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 2: MERN Stack
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333332',
  'Pro MERN Stack: Full Stack Web App Development',
  'Vasan Subramanian',
  'Programming',
  'Full Stack',
  'Build complete web applications with MongoDB, Express, React, and Node.js. Master the MERN stack.',
  'both',
  550,
  'English',
  2022,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- Book 3: Authentication & Security
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Web Security for Developers',
  'Malcolm McDonald',
  'Programming',
  'Security',
  'Essential security practices for full stack developers. Learn authentication, authorization, and protecting web applications.',
  'both',
  390,
  'English',
  2021,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 4: Testing & Deployment
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333334',
  'Testing JavaScript Applications',
  'Lucas da Costa',
  'Programming',
  'Testing',
  'Comprehensive guide to testing full stack applications. Learn unit testing, integration testing, and E2E testing.',
  'both',
  465,
  'English',
  2022,
  4.4
) ON CONFLICT (id) DO NOTHING;

-- Book 5: GraphQL
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333335',
  'Learning GraphQL',
  'Eve Porcello & Alex Banks',
  'Programming',
  'API Development',
  'Modern API development with GraphQL. Learn to build flexible, efficient APIs for full stack applications.',
  'both',
  340,
  'English',
  2021,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 6: Advanced Full Stack
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '33333333-3333-3333-3333-333333333336',
  'Architecting Modern Web Applications',
  'Dino Esposito',
  'Programming',
  'Architecture',
  'Advanced full stack architecture patterns. Learn to design scalable, maintainable web applications.',
  'both',
  520,
  'English',
  2022,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEVOPS & CLOUD BOOKS
-- ============================================

-- Book 1: Docker & Containers
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '44444444-4444-4444-4444-444444444441',
  'Docker Deep Dive',
  'Nigel Poulton',
  'Programming',
  'DevOps',
  'Master Docker and containerization. Learn to build, ship, and run applications in containers.',
  'both',
  380,
  'English',
  2021,
  4.7
) ON CONFLICT (id) DO NOTHING;

-- Book 2: Kubernetes
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '44444444-4444-4444-4444-444444444442',
  'Kubernetes in Action',
  'Marko Luksa',
  'Programming',
  'DevOps',
  'Complete guide to Kubernetes. Learn container orchestration, deployment, and managing cloud-native applications.',
  'both',
  624,
  'English',
  2021,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- Book 3: CI/CD Pipelines
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '44444444-4444-4444-4444-444444444443',
  'Continuous Delivery with Docker and Jenkins',
  'Rafal Leszko',
  'Programming',
  'DevOps',
  'Build automated CI/CD pipelines. Learn continuous integration, deployment, and DevOps best practices.',
  'both',
  340,
  'English',
  2022,
  4.5
) ON CONFLICT (id) DO NOTHING;

-- Book 4: Cloud Platforms
INSERT INTO books (id, title, author, genre, category, description, book_type, pages, language, publication_year, rating)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Cloud Native DevOps with Kubernetes',
  'John Arundel & Justin Domingus',
  'Programming',
  'Cloud Computing',
  'Deploy and manage applications on cloud platforms. Learn AWS, Azure, GCP, and cloud-native architecture.',
  'both',
  450,
  'English',
  2021,
  4.6
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ADD BOOKS TO ROADMAPS
-- ============================================

-- Backend Development Roadmap
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('c34b63f1-9c4b-4a36-a27a-45c0fd2704ff', '11111111-1111-1111-1111-111111111111', 1, true, 'Start with Node.js fundamentals and design patterns'),
('c34b63f1-9c4b-4a36-a27a-45c0fd2704ff', '11111111-1111-1111-1111-111111111112', 2, true, 'Master database design and SQL/NoSQL'),
('c34b63f1-9c4b-4a36-a27a-45c0fd2704ff', '11111111-1111-1111-1111-111111111113', 3, true, 'Learn RESTful API design and implementation'),
('c34b63f1-9c4b-4a36-a27a-45c0fd2704ff', '11111111-1111-1111-1111-111111111114', 4, false, 'Advanced: Microservices and distributed systems');

-- Frontend Development Roadmap
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('a1bf7e69-f3c1-4950-8968-77b0ba634e54', '22222222-2222-2222-2222-222222222221', 1, true, 'Master HTML5 and CSS3 fundamentals'),
('a1bf7e69-f3c1-4950-8968-77b0ba634e54', '22222222-2222-2222-2222-222222222222', 2, true, 'Learn modern JavaScript and ES6+'),
('a1bf7e69-f3c1-4950-8968-77b0ba634e54', '22222222-2222-2222-2222-222222222223', 3, true, 'Build applications with React'),
('a1bf7e69-f3c1-4950-8968-77b0ba634e54', '22222222-2222-2222-2222-222222222224', 4, false, 'Advanced: Performance and optimization');

-- Full Stack Development Roadmap
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333331', 1, true, 'Full stack JavaScript foundations'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333332', 2, true, 'Build with MERN stack'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333333', 3, true, 'Security and authentication'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333334', 4, true, 'Testing strategies'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333335', 5, false, 'Modern APIs with GraphQL'),
('0a554a2a-f0ff-448a-bf4d-b1727190e478', '33333333-3333-3333-3333-333333333336', 6, false, 'Advanced architecture patterns');

-- DevOps & Cloud Roadmap
INSERT INTO roadmap_books (learning_path_id, book_id, sequence_order, is_required, notes)
VALUES 
('60e7dbb5-f31b-40f8-808a-ada517ef2ca2', '44444444-4444-4444-4444-444444444441', 1, true, 'Master Docker and containerization'),
('60e7dbb5-f31b-40f8-808a-ada517ef2ca2', '44444444-4444-4444-4444-444444444442', 2, true, 'Learn Kubernetes orchestration'),
('60e7dbb5-f31b-40f8-808a-ada517ef2ca2', '44444444-4444-4444-4444-444444444443', 3, true, 'Build CI/CD pipelines'),
('60e7dbb5-f31b-40f8-808a-ada517ef2ca2', '44444444-4444-4444-4444-444444444444', 4, false, 'Cloud platforms and deployment');

-- Verify the additions
SELECT 
    lp.title as roadmap_title,
    b.title as book_title,
    rb.sequence_order,
    rb.is_required
FROM learning_paths lp
JOIN roadmap_books rb ON lp.id = rb.learning_path_id
JOIN books b ON rb.book_id = b.id
ORDER BY lp.title, rb.sequence_order;
