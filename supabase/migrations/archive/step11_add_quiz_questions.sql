-- Step 4: Add quizzes for each programming book
-- Each book gets 5 relevant quiz questions

-- ============================================
-- BACKEND BOOK 1: Node.js Design Patterns
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('11111111-1111-1111-1111-111111111111', 'What is the main advantage of the callback pattern in Node.js?', 
 'Synchronous execution', 'Handling asynchronous operations', 'Better memory management', 'Faster code execution', 
 'B', 'easy'),
 
('11111111-1111-1111-1111-111111111111', 'Which pattern is commonly used to avoid callback hell in Node.js?', 
 'Singleton pattern', 'Factory pattern', 'Promise pattern', 'Observer pattern', 
 'C', 'medium'),
 
('11111111-1111-1111-1111-111111111111', 'What does the Event Emitter pattern allow in Node.js?', 
 'Database connections', 'Publishing and subscribing to events', 'File system access', 'HTTP requests', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111111', 'What is the purpose of streams in Node.js?', 
 'To handle large data efficiently', 'To create databases', 'To manage user sessions', 'To compile code', 
 'A', 'medium'),
 
('11111111-1111-1111-1111-111111111111', 'Which module pattern helps in organizing Node.js code?', 
 'Global variables', 'CommonJS modules', 'Inline scripts', 'HTML templates', 
 'B', 'easy');

-- ============================================
-- BACKEND BOOK 2: Database Design
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('11111111-1111-1111-1111-111111111112', 'What is the primary purpose of database normalization?', 
 'Increase data redundancy', 'Reduce data redundancy and improve integrity', 'Make queries slower', 'Add more tables', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111112', 'What does ACID stand for in database transactions?', 
 'Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integration, Data', 'Automatic, Consistent, Indexed, Distributed', 'All, Create, Insert, Delete', 
 'A', 'medium'),
 
('11111111-1111-1111-1111-111111111112', 'Which type of relationship connects two tables where one record relates to many?', 
 'One-to-One', 'One-to-Many', 'Many-to-Many', 'None-to-None', 
 'B', 'easy'),
 
('11111111-1111-1111-1111-111111111112', 'What is an index in a database?', 
 'A backup file', 'A data structure that improves query speed', 'A type of table', 'A user permission', 
 'B', 'easy'),
 
('11111111-1111-1111-1111-111111111112', 'What is the main difference between SQL and NoSQL databases?', 
 'SQL is newer', 'SQL uses structured schemas, NoSQL is more flexible', 'NoSQL is always faster', 'SQL cannot scale', 
 'B', 'medium');

-- ============================================
-- BACKEND BOOK 3: RESTful API Design
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('11111111-1111-1111-1111-111111111113', 'What does REST stand for?', 
 'Remote Execution Service Technology', 'Representational State Transfer', 'Rapid Execution State Transfer', 'Resource Execution System Transfer', 
 'B', 'easy'),
 
('11111111-1111-1111-1111-111111111113', 'Which HTTP method is used to update a resource in REST?', 
 'GET', 'POST', 'PUT or PATCH', 'DELETE', 
 'C', 'easy'),
 
('11111111-1111-1111-1111-111111111113', 'What is the recommended way to version a REST API?', 
 'Never version APIs', 'Include version in URL or headers', 'Use different domains', 'Change port numbers', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111113', 'What is JWT commonly used for in REST APIs?', 
 'Database queries', 'Authentication and authorization', 'File uploads', 'Email sending', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111113', 'What HTTP status code indicates a successful resource creation?', 
 '200 OK', '201 Created', '204 No Content', '301 Moved Permanently', 
 'B', 'easy');

-- ============================================
-- BACKEND BOOK 4: Microservices
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('11111111-1111-1111-1111-111111111114', 'What is the main benefit of microservices architecture?', 
 'Single deployment', 'Independent scaling and deployment of services', 'Simpler codebase', 'Fewer servers needed', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111114', 'How do microservices typically communicate?', 
 'Shared database', 'HTTP/REST or message queues', 'Direct function calls', 'Shared memory', 
 'B', 'medium'),
 
('11111111-1111-1111-1111-111111111114', 'What is service discovery in microservices?', 
 'Finding bugs in services', 'Automatically locating service instances', 'Creating new services', 'Deleting old services', 
 'B', 'hard'),
 
('11111111-1111-1111-1111-111111111114', 'What pattern helps handle failures in microservices?', 
 'Singleton pattern', 'Circuit breaker pattern', 'Factory pattern', 'Observer pattern', 
 'B', 'hard'),
 
('11111111-1111-1111-1111-111111111114', 'What is API Gateway in microservices?', 
 'A database', 'A single entry point for client requests', 'A testing tool', 'A deployment server', 
 'B', 'medium');

-- ============================================
-- FRONTEND BOOK 1: HTML & CSS
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('22222222-2222-2222-2222-222222222221', 'What does HTML stand for?', 
 'Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 
 'A', 'easy'),
 
('22222222-2222-2222-2222-222222222221', 'Which CSS property is used for responsive design?', 
 'font-size', 'media queries', 'color', 'border', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222221', 'What is the purpose of semantic HTML?', 
 'Make pages colorful', 'Provide meaning to content structure', 'Speed up loading', 'Reduce file size', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222221', 'Which CSS layout is best for responsive grids?', 
 'Tables', 'Floats', 'CSS Grid or Flexbox', 'Inline styles', 
 'C', 'medium'),
 
('22222222-2222-2222-2222-222222222221', 'What is the box model in CSS?', 
 'A 3D rendering technique', 'Content, padding, border, and margin', 'A JavaScript framework', 'A database structure', 
 'B', 'easy');

-- ============================================
-- FRONTEND BOOK 2: JavaScript
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('22222222-2222-2222-2222-222222222222', 'What is the difference between let and const?', 
 'No difference', 'let can be reassigned, const cannot', 'const is faster', 'let is for numbers only', 
 'B', 'easy'),
 
('22222222-2222-2222-2222-222222222222', 'What is a closure in JavaScript?', 
 'A loop structure', 'A function with access to outer scope variables', 'A CSS property', 'A database connection', 
 'B', 'hard'),
 
('22222222-2222-2222-2222-222222222222', 'What does async/await do in JavaScript?', 
 'Makes code run faster', 'Simplifies asynchronous code', 'Creates animations', 'Manages databases', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222222', 'What is the purpose of the spread operator (...)?', 
 'Multiply numbers', 'Expand arrays or objects', 'Create comments', 'Delete variables', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222222', 'What is event delegation in JavaScript?', 
 'Deleting events', 'Handling events on parent elements for child elements', 'Creating new events', 'Preventing all events', 
 'B', 'hard');

-- ============================================
-- FRONTEND BOOK 3: React
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('22222222-2222-2222-2222-222222222223', 'What is JSX in React?', 
 'A database', 'JavaScript XML syntax extension', 'A CSS framework', 'A testing library', 
 'B', 'easy'),
 
('22222222-2222-2222-2222-222222222223', 'What is the purpose of useState hook?', 
 'Fetch data', 'Manage component state', 'Style components', 'Route pages', 
 'B', 'easy'),
 
('22222222-2222-2222-2222-222222222223', 'When does useEffect run?', 
 'Never', 'After render and on dependency changes', 'Before render', 'Only once', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222223', 'What is prop drilling in React?', 
 'A debugging tool', 'Passing props through multiple component levels', 'Creating holes in components', 'Deleting props', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222223', 'What is the Virtual DOM?', 
 'A real DOM', 'A lightweight copy of the DOM for efficient updates', 'A database', 'A server', 
 'B', 'medium');

-- ============================================
-- FRONTEND BOOK 4: Performance
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('22222222-2222-2222-2222-222222222224', 'What is lazy loading?', 
 'Slow internet', 'Loading resources only when needed', 'A CSS property', 'A database technique', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222224', 'What does code splitting achieve?', 
 'Breaks the code', 'Reduces initial bundle size', 'Adds more files', 'Slows down the app', 
 'B', 'medium'),
 
('22222222-2222-2222-2222-222222222224', 'What is the purpose of a CDN?', 
 'Store databases', 'Deliver content from geographically closer servers', 'Write code', 'Test applications', 
 'B', 'easy'),
 
('22222222-2222-2222-2222-222222222224', 'What is tree shaking in JavaScript?', 
 'Animating trees', 'Removing unused code from bundles', 'A data structure', 'A testing method', 
 'B', 'hard'),
 
('22222222-2222-2222-2222-222222222224', 'What metric measures time to interactive?', 
 'FPS', 'TTI (Time to Interactive)', 'RAM usage', 'CPU speed', 
 'B', 'medium');

-- ============================================
-- FULLSTACK BOOK 1: Full Stack JavaScript
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333331', 'What does full stack development mean?', 
 'Only backend', 'Both frontend and backend development', 'Only databases', 'Only design', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333331', 'Which language is used throughout the full JavaScript stack?', 
 'Python', 'JavaScript', 'Java', 'C++', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333331', 'What is the role of Express.js in full stack?', 
 'Frontend framework', 'Backend web framework', 'Database', 'CSS library', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333331', 'What is middleware in Express?', 
 'A database', 'Functions that process requests before reaching routes', 'A frontend component', 'A testing tool', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333331', 'What is CORS in web development?', 
 'A database', 'Cross-Origin Resource Sharing for API access', 'A CSS framework', 'A JavaScript library', 
 'B', 'medium');

-- ============================================
-- FULLSTACK BOOK 2: MERN Stack
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333332', 'What does MERN stand for?', 
 'MySQL, Express, React, Node', 'MongoDB, Express, React, Node', 'MongoDB, Ember, Ruby, Node', 'MySQL, Express, Ruby, Node', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333332', 'What type of database is MongoDB?', 
 'SQL', 'NoSQL document database', 'Graph database', 'Key-value store', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333332', 'What is Mongoose in MERN stack?', 
 'A React library', 'MongoDB ODM (Object Data Modeling)', 'A CSS framework', 'A testing tool', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333332', 'How does React communicate with Express backend?', 
 'Direct database access', 'HTTP requests (fetch/axios)', 'Shared files', 'WebSockets only', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333332', 'What is the purpose of environment variables in MERN?', 
 'Style the app', 'Store configuration and secrets', 'Create components', 'Test the app', 
 'B', 'medium');

-- ============================================
-- FULLSTACK BOOK 3: Security
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333333', 'What is XSS (Cross-Site Scripting)?', 
 'A CSS framework', 'Injecting malicious scripts into web pages', 'A database attack', 'A server error', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333333', 'What does HTTPS provide?', 
 'Faster loading', 'Encrypted communication', 'Better SEO only', 'More storage', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333333', 'What is SQL injection?', 
 'A database feature', 'Malicious SQL code inserted into queries', 'A performance optimization', 'A testing method', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333333', 'What is the purpose of password hashing?', 
 'Make passwords longer', 'Store passwords securely', 'Speed up login', 'Reduce database size', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333333', 'What is CSRF (Cross-Site Request Forgery)?', 
 'A CSS bug', 'Unauthorized commands from a trusted user', 'A JavaScript error', 'A database issue', 
 'B', 'hard');

-- ============================================
-- FULLSTACK BOOK 4: Testing
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333334', 'What is unit testing?', 
 'Testing the entire app', 'Testing individual functions or components', 'Testing databases', 'Testing servers', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333334', 'What is the purpose of integration testing?', 
 'Test individual functions', 'Test how components work together', 'Test user interface only', 'Test databases only', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333334', 'What is Jest commonly used for?', 
 'Database management', 'JavaScript testing', 'CSS styling', 'Server deployment', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333334', 'What does TDD stand for?', 
 'Test Driven Development', 'Total Database Design', 'Technical Documentation Development', 'Time Delayed Deployment', 
 'A', 'medium'),
 
('33333333-3333-3333-3333-333333333334', 'What is mocking in testing?', 
 'Making fun of code', 'Creating fake objects to simulate behavior', 'Deleting tests', 'Running tests slowly', 
 'B', 'medium');

-- ============================================
-- FULLSTACK BOOK 5: GraphQL
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333335', 'What is GraphQL?', 
 'A database', 'A query language for APIs', 'A CSS framework', 'A JavaScript library', 
 'B', 'easy'),
 
('33333333-3333-3333-3333-333333333335', 'What advantage does GraphQL have over REST?', 
 'Faster servers', 'Clients can request exactly the data they need', 'Easier to learn', 'No authentication needed', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333335', 'What is a GraphQL schema?', 
 'A database table', 'Definition of types and operations available', 'A CSS file', 'A testing framework', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333335', 'What are resolvers in GraphQL?', 
 'Database connections', 'Functions that fetch data for fields', 'CSS properties', 'Testing tools', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333335', 'What is a GraphQL mutation?', 
 'Reading data', 'Modifying data (create, update, delete)', 'Styling components', 'Testing queries', 
 'B', 'easy');

-- ============================================
-- FULLSTACK BOOK 6: Architecture
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('33333333-3333-3333-3333-333333333336', 'What is MVC architecture?', 
 'Model View Controller pattern', 'Multiple Version Control', 'Modern Visual Components', 'Managed Virtual Containers', 
 'A', 'medium'),
 
('33333333-3333-3333-3333-333333333336', 'What is the purpose of a service layer?', 
 'Style the UI', 'Separate business logic from controllers', 'Store data', 'Test the app', 
 'B', 'medium'),
 
('33333333-3333-3333-3333-333333333336', 'What is dependency injection?', 
 'Adding more dependencies', 'Providing dependencies from outside rather than creating them internally', 'Removing dependencies', 'Testing dependencies', 
 'B', 'hard'),
 
('33333333-3333-3333-3333-333333333336', 'What is the repository pattern?', 
 'A Git feature', 'Abstraction layer between data access and business logic', 'A CSS pattern', 'A testing pattern', 
 'B', 'hard'),
 
('33333333-3333-3333-3333-333333333336', 'What is horizontal scaling?', 
 'Making servers taller', 'Adding more servers to handle load', 'Upgrading existing servers', 'Reducing server count', 
 'B', 'medium');

-- ============================================
-- DEVOPS BOOK 1: Docker
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('44444444-4444-4444-4444-444444444441', 'What is Docker?', 
 'A database', 'A containerization platform', 'A programming language', 'A web framework', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444441', 'What is a Docker image?', 
 'A photo', 'A template for creating containers', 'A database backup', 'A CSS file', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444441', 'What is the difference between an image and a container?', 
 'No difference', 'Image is template, container is running instance', 'Container is bigger', 'Image runs faster', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444441', 'What is a Dockerfile?', 
 'A text document', 'Instructions to build a Docker image', 'A database file', 'A log file', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444441', 'What is Docker Compose used for?', 
 'Writing code', 'Defining and running multi-container applications', 'Testing images', 'Deleting containers', 
 'B', 'medium');

-- ============================================
-- DEVOPS BOOK 2: Kubernetes
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('44444444-4444-4444-4444-444444444442', 'What is Kubernetes?', 
 'A database', 'Container orchestration platform', 'A programming language', 'A web server', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444442', 'What is a Pod in Kubernetes?', 
 'A database', 'Smallest deployable unit containing one or more containers', 'A server', 'A network', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444442', 'What is a Kubernetes Service?', 
 'A container', 'An abstraction to expose applications running on Pods', 'A database', 'A file system', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444442', 'What is kubectl?', 
 'A database', 'Command-line tool for Kubernetes', 'A programming language', 'A web framework', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444442', 'What is a Deployment in Kubernetes?', 
 'A server', 'Manages desired state for Pods and ReplicaSets', 'A database', 'A network', 
 'B', 'medium');

-- ============================================
-- DEVOPS BOOK 3: CI/CD
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('44444444-4444-4444-4444-444444444443', 'What does CI/CD stand for?', 
 'Code Integration/Code Deployment', 'Continuous Integration/Continuous Deployment', 'Container Integration/Container Delivery', 'Cloud Integration/Cloud Deployment', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444443', 'What is the main benefit of CI/CD?', 
 'Slower releases', 'Automated testing and deployment', 'More manual work', 'Larger teams needed', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444443', 'What is Jenkins?', 
 'A database', 'An automation server for CI/CD', 'A programming language', 'A web framework', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444443', 'What is a pipeline in CI/CD?', 
 'A water pipe', 'Automated sequence of stages for building and deploying', 'A database connection', 'A network cable', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444443', 'What is blue-green deployment?', 
 'Colorful servers', 'Running two identical environments for zero-downtime deployment', 'A testing strategy', 'A database backup', 
 'B', 'hard');

-- ============================================
-- DEVOPS BOOK 4: Cloud Platforms
-- ============================================
INSERT INTO reading_quiz_questions (book_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
VALUES 
('44444444-4444-4444-4444-444444444444', 'What is cloud computing?', 
 'Weather prediction', 'Delivering computing services over the internet', 'A database', 'A programming language', 
 'B', 'easy'),
 
('44444444-4444-4444-4444-444444444444', 'What does IaaS stand for?', 
 'Internet as a Service', 'Infrastructure as a Service', 'Integration as a Service', 'Installation as a Service', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444444', 'What is serverless computing?', 
 'No servers exist', 'Cloud provider manages servers, you focus on code', 'Servers are free', 'Servers are slower', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444444', 'What is auto-scaling in cloud?', 
 'Manual server management', 'Automatically adjusting resources based on demand', 'Fixed server count', 'Deleting servers', 
 'B', 'medium'),
 
('44444444-4444-4444-4444-444444444444', 'What is a load balancer?', 
 'A database', 'Distributes traffic across multiple servers', 'A programming tool', 'A testing framework', 
 'B', 'easy');

-- Verify all quizzes were added
SELECT 
    b.title as book_title,
    COUNT(q.id) as quiz_count
FROM books b
LEFT JOIN reading_quiz_questions q ON b.id = q.book_id
WHERE b.id IN (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111112',
    '11111111-1111-1111-1111-111111111113',
    '11111111-1111-1111-1111-111111111114',
    '22222222-2222-2222-2222-222222222221',
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222223',
    '22222222-2222-2222-2222-222222222224',
    '33333333-3333-3333-3333-333333333331',
    '33333333-3333-3333-3333-333333333332',
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333334',
    '33333333-3333-3333-3333-333333333335',
    '33333333-3333-3333-3333-333333333336',
    '44444444-4444-4444-4444-444444444441',
    '44444444-4444-4444-4444-444444444442',
    '44444444-4444-4444-4444-444444444443',
    '44444444-4444-4444-4444-444444444444'
)
GROUP BY b.title
ORDER BY b.title;
