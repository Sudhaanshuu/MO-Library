# Sample Data Creation Guide

## Quick Start - Create Sample Quizzes & Learning Paths

### Option 1: Using the Admin UI (Recommended)

This is the easiest way and works right now!

#### Step 1: Create Learning Paths
1. Login as admin
2. Go to Admin Dashboard
3. Click "Learning Paths" tab
4. Click "Create Path"
5. Fill in details:
   ```
   Title: Backend Development Mastery
   Description: Master backend development from fundamentals to advanced concepts
   Category: Backend Development
   Difficulty: Intermediate
   Duration: 120 days
   ✓ Publish this learning path
   ```
6. Save and repeat for:
   - Modern Frontend Development (Beginner, 90 days)
   - Full Stack Web Development (Advanced, 180 days)
   - DevOps & Cloud Engineering (Intermediate, 100 days)

#### Step 2: Add Books to Paths
1. Click on a path card to select it
2. Click "Add Book"
3. Select a book from dropdown
4. Check "This book is required" for core books
5. Add notes like: "Start with server-side programming fundamentals"
6. Save
7. Use up/down arrows to reorder books
8. Repeat to add 3-5 books per path

#### Step 3: Create Quizzes
1. Go to "Quizzes" tab
2. Select a book from dropdown
3. Click "Add Question"
4. Fill in:
   ```
   Question: What is the primary purpose of Express.js?
   Option A: Database management
   Option B: Web application framework ✓
   Option C: Frontend rendering
   Option D: File system operations
   Correct Answer: B
   Difficulty: Easy
   ```
5. Save and add 5-10 questions per book

### Option 2: Using SQL Scripts

#### Step 1: Run the Automated Script
```sql
-- In Supabase SQL Editor, run:
-- File: supabase/migrations/populate_sample_data.sql
```

This will:
- Create 4 learning paths
- Show you available books
- Provide templates for adding books

#### Step 2: Find Your Book IDs
The script will output books categorized by topic. Copy the IDs you want to use.

#### Step 3: Add Books to Paths
Use the templates in the script output, replacing the UUIDs with your actual book IDs.

### Option 3: Using Python Script (Future LLM Integration)

#### Setup
```bash
# Install dependencies
pip install supabase python-dotenv

# Set environment variables
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_KEY="your-service-key"
```

#### List Available Books
```bash
python llm_quiz_generator.py list-books javascript
python llm_quiz_generator.py list-books python
python llm_quiz_generator.py list-books database
```

#### Create Quiz for a Book
```bash
# Get book ID from list-books command
python llm_quiz_generator.py create-quiz <book-id>
```

#### Create Learning Path
```bash
python llm_quiz_generator.py create-path
```

## Sample Learning Path Structure

### 1. Backend Development Mastery (Intermediate, 120 days)

**Recommended Books:**
1. Node.js/Python fundamentals (Required)
   - Notes: "Start with server-side programming fundamentals"
2. Database design book (Required)
   - Notes: "Deep dive into SQL, NoSQL, and data modeling"
3. API design book (Required)
   - Notes: "Learn REST, GraphQL, and authentication"
4. Microservices/Architecture book (Optional)
   - Notes: "Advanced: scalability and distributed systems"

### 2. Modern Frontend Development (Beginner, 90 days)

**Recommended Books:**
1. HTML & CSS book (Required)
   - Notes: "Master semantic markup and responsive design"
2. JavaScript fundamentals (Required)
   - Notes: "ES6+, DOM manipulation, async programming"
3. React/Vue/Angular book (Required)
   - Notes: "Learn modern framework and state management"
4. Frontend performance book (Optional)
   - Notes: "Optimization, testing, and accessibility"

### 3. Full Stack Web Development (Advanced, 180 days)

**Recommended Books:**
1. Full stack overview book (Required)
2. Frontend framework book (Required)
3. Backend framework book (Required)
4. Database book (Required)
5. DevOps basics book (Optional)
6. Security book (Optional)

### 4. DevOps & Cloud Engineering (Intermediate, 100 days)

**Recommended Books:**
1. Docker/Containers book (Required)
2. Kubernetes book (Required)
3. CI/CD book (Required)
4. Cloud platform book (AWS/Azure) (Optional)

## Sample Quiz Questions by Topic

### Backend/Node.js Questions
```
Q1: What is Express.js?
A) Database management
B) Web application framework ✓
C) Frontend rendering
D) File system operations
Difficulty: Easy

Q2: Which method handles POST requests?
A) app.get()
B) app.post() ✓
C) app.send()
D) app.request()
Difficulty: Easy

Q3: What is middleware in Express?
A) Database connector
B) Functions in request-response cycle ✓
C) Frontend library
D) Testing framework
Difficulty: Medium

Q4: What does REST stand for?
A) Representational State Transfer ✓
B) Remote Execution State Transfer
C) Rapid Execution Service Technology
D) Resource Execution State Technology
Difficulty: Medium

Q5: Which is NOT a valid HTTP method?
A) GET
B) POST
C) FETCH ✓
D) DELETE
Difficulty: Easy
```

### Database Questions
```
Q1: What does SQL stand for?
A) Structured Query Language ✓
B) Simple Question Language
C) Standard Query Logic
D) System Query Language
Difficulty: Easy

Q2: Which command retrieves data?
A) GET
B) FETCH
C) SELECT ✓
D) RETRIEVE
Difficulty: Easy

Q3: What is a primary key?
A) First column
B) Unique identifier ✓
C) Most important field
D) Database password
Difficulty: Medium

Q4: Which is a NoSQL database?
A) MySQL
B) PostgreSQL
C) MongoDB ✓
D) Oracle
Difficulty: Easy

Q5: What is normalization?
A) Making data uppercase
B) Reducing redundancy ✓
C) Encrypting data
D) Backing up database
Difficulty: Hard
```

### Frontend/JavaScript Questions
```
Q1: Modern variable declaration?
A) var x = 5
B) let x = 5 or const x = 5 ✓
C) variable x = 5
D) int x = 5
Difficulty: Easy

Q2: Difference between let and const?
A) No difference
B) let for numbers, const for strings
C) const cannot be reassigned ✓
D) let is faster
Difficulty: Medium

Q3: What does DOM stand for?
A) Document Object Model ✓
B) Data Object Management
C) Digital Optimization Method
D) Document Orientation Mode
Difficulty: Easy

Q4: Method to add event listener?
A) attachEvent()
B) addEventListener() ✓
C) addListener()
D) onEvent()
Difficulty: Easy

Q5: What is a Promise?
A) Code guarantee
B) Async operation object ✓
C) Variable type
D) Debugging tool
Difficulty: Medium
```

### React/Framework Questions
```
Q1: What is JSX?
A) JavaScript extension
B) HTML in JavaScript syntax ✓
C) CSS framework
D) Testing library
Difficulty: Easy

Q2: Purpose of useState?
A) Style components
B) Manage state ✓
C) Fetch data
D) Route pages
Difficulty: Easy

Q3: What is Virtual DOM?
A) Physical server
B) Lightweight DOM copy ✓
C) Database
D) CSS framework
Difficulty: Medium

Q4: Hook for side effects?
A) useState
B) useEffect ✓
C) useContext
D) useReducer
Difficulty: Medium

Q5: What is prop drilling?
A) Debugging technique
B) Passing props through levels ✓
C) Performance optimization
D) Routing method
Difficulty: Hard
```

## Future: LLM-Based Generation

### Why Use LLMs?

1. **Automatic Quiz Generation**
   - Analyze book content
   - Generate contextual questions
   - Ensure difficulty progression
   - Create diverse question types

2. **Smart Learning Paths**
   - Analyze book relationships
   - Suggest optimal sequences
   - Identify prerequisites
   - Generate path descriptions

3. **Personalization**
   - Adapt to user level
   - Suggest custom paths
   - Generate practice questions
   - Provide explanations

### Implementation Options

#### Option 1: OpenAI GPT-4
```python
import openai

def generate_quiz(book_title, book_description):
    prompt = f"Generate 5 quiz questions about {book_title}..."
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return parse_questions(response)
```

#### Option 2: Anthropic Claude
```python
import anthropic

def generate_quiz(book_title, book_description):
    client = anthropic.Anthropic(api_key="...")
    message = client.messages.create(
        model="claude-3-opus-20240229",
        messages=[{"role": "user", "content": prompt}]
    )
    return parse_questions(message)
```

#### Option 3: Local LLM (Ollama)
```python
import ollama

def generate_quiz(book_title, book_description):
    response = ollama.chat(
        model='llama2',
        messages=[{'role': 'user', 'content': prompt}]
    )
    return parse_questions(response)
```

### LLM Integration Roadmap

**Phase 1: Manual Creation** (Current)
- Use Admin UI to create quizzes
- Manually design learning paths
- ✅ Fully functional now

**Phase 2: Semi-Automated** (Next)
- LLM suggests questions
- Admin reviews and approves
- LLM suggests book sequences

**Phase 3: Fully Automated** (Future)
- Auto-generate quizzes on book upload
- Auto-create paths based on catalog
- Personalized recommendations

**Phase 4: Adaptive Learning** (Advanced)
- Adjust difficulty based on performance
- Generate custom practice questions
- Provide AI tutoring

## Best Practices

### Creating Good Quizzes
1. **Mix difficulty levels** - 40% easy, 40% medium, 20% hard
2. **Test understanding** - Not just memorization
3. **Clear questions** - Avoid ambiguity
4. **Plausible distractors** - Wrong answers should be reasonable
5. **5-10 questions** - Enough to test, not too long

### Designing Learning Paths
1. **Clear progression** - Easy to hard
2. **3-6 books** - Not too overwhelming
3. **Mark prerequisites** - Required vs optional
4. **Add context** - Notes explain why each book
5. **Realistic duration** - Don't underestimate time

### Quiz Question Guidelines
- ✅ DO: Test key concepts
- ✅ DO: Use clear language
- ✅ DO: Provide context
- ❌ DON'T: Use trick questions
- ❌ DON'T: Test trivial details
- ❌ DON'T: Make all answers similar

## Troubleshooting

### No books showing up?
- Make sure books are imported
- Check book titles match search terms
- Verify books table has data

### Can't create quiz?
- Ensure you're logged in as admin
- Check RLS policies are applied
- Verify book_id exists

### Path not showing for users?
- Make sure "Publish" is checked
- Verify is_published = true
- Check user is authenticated

### Questions not saving?
- Check all required fields filled
- Verify correct_answer is A, B, C, or D
- Check difficulty is easy, medium, or hard

## Summary

You now have three ways to create sample data:

1. **Admin UI** - Easiest, works now, fully functional
2. **SQL Scripts** - Fast bulk creation, requires book IDs
3. **Python Script** - Flexible, ready for LLM integration

Start with the Admin UI to create your first 3-4 quizzes and learning paths. Then explore automation options as your library grows!
