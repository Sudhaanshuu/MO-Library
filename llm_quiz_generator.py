"""
LLM-Based Quiz and Learning Path Generator
This script can be used in the future to automatically generate quizzes and learning paths
using AI models like OpenAI GPT, Anthropic Claude, or local LLMs.
"""

import os
from typing import List, Dict
from supabase import create_client, Client

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "your-supabase-url")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "your-service-key")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-key")  # Optional

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def generate_quiz_with_llm(book_title: str, book_description: str, num_questions: int = 5) -> List[Dict]:
    """
    Generate quiz questions using an LLM based on book information.
    
    Future implementation ideas:
    - Use OpenAI GPT-4 to generate contextual questions
    - Use Claude to create difficulty-appropriate questions
    - Use local LLMs for privacy-focused generation
    """
    
    # Example prompt for LLM (not implemented yet)
    prompt = f"""
    Generate {num_questions} multiple choice quiz questions about the book "{book_title}".
    
    Book Description: {book_description}
    
    For each question, provide:
    1. The question text
    2. Four options (A, B, C, D)
    3. The correct answer (A, B, C, or D)
    4. Difficulty level (easy, medium, or hard)
    
    Format as JSON array with this structure:
    [
        {{
            "question": "Question text here?",
            "option_a": "First option",
            "option_b": "Second option",
            "option_c": "Third option",
            "option_d": "Fourth option",
            "correct_answer": "B",
            "difficulty": "medium"
        }}
    ]
    
    Make questions that test understanding of key concepts from the book.
    """
    
    # TODO: Implement LLM call here
    # Example with OpenAI:
    # response = openai.ChatCompletion.create(
    #     model="gpt-4",
    #     messages=[{"role": "user", "content": prompt}]
    # )
    # questions = json.loads(response.choices[0].message.content)
    
    # For now, return sample structure
    return [
        {
            "question": f"What is the main topic of {book_title}?",
            "option_a": "Option A",
            "option_b": "Option B",
            "option_c": "Option C",
            "option_d": "Option D",
            "correct_answer": "A",
            "difficulty": "easy"
        }
    ]


def generate_learning_path_with_llm(topic: str, difficulty: str, books: List[Dict]) -> Dict:
    """
    Generate a learning path using an LLM based on available books.
    
    Future implementation:
    - Analyze book content to determine optimal sequence
    - Suggest prerequisites and dependencies
    - Generate path descriptions and notes
    """
    
    prompt = f"""
    Create a learning path for "{topic}" at {difficulty} level.
    
    Available books:
    {[f"{b['title']} by {b['author']}" for b in books]}
    
    Provide:
    1. Path title
    2. Detailed description
    3. Category
    4. Estimated duration in days
    5. Recommended book sequence with notes for each
    
    Format as JSON.
    """
    
    # TODO: Implement LLM call
    
    return {
        "title": f"{topic} Learning Path",
        "description": f"Master {topic} with this curated path",
        "category": topic,
        "difficulty_level": difficulty,
        "estimated_duration_days": 90
    }


def create_quiz_for_book(book_id: str, questions: List[Dict]):
    """Insert quiz questions into the database."""
    try:
        for question in questions:
            data = {
                "book_id": book_id,
                **question
            }
            result = supabase.table("reading_quiz_questions").insert(data).execute()
            print(f"✓ Created question: {question['question'][:50]}...")
        
        print(f"\n✅ Successfully created {len(questions)} questions for book {book_id}")
        
    except Exception as e:
        print(f"❌ Error creating quiz: {e}")


def create_learning_path(path_data: Dict, book_ids: List[str]):
    """Create a learning path with books."""
    try:
        # Insert learning path
        path_result = supabase.table("learning_paths").insert(path_data).execute()
        path_id = path_result.data[0]["id"]
        
        print(f"✓ Created learning path: {path_data['title']}")
        
        # Add books to path
        for index, book_id in enumerate(book_ids, 1):
            roadmap_data = {
                "learning_path_id": path_id,
                "book_id": book_id,
                "sequence_order": index,
                "is_required": index <= 3,  # First 3 books are required
                "notes": f"Book {index} in the learning path"
            }
            supabase.table("roadmap_books").insert(roadmap_data).execute()
            print(f"  ✓ Added book {index}")
        
        print(f"\n✅ Successfully created learning path with {len(book_ids)} books")
        return path_id
        
    except Exception as e:
        print(f"❌ Error creating learning path: {e}")
        return None


def get_books_by_topic(topic: str, limit: int = 10) -> List[Dict]:
    """Fetch books related to a topic."""
    try:
        result = supabase.table("books")\
            .select("id, title, author, description")\
            .ilike("title", f"%{topic}%")\
            .limit(limit)\
            .execute()
        
        return result.data
    except Exception as e:
        print(f"❌ Error fetching books: {e}")
        return []


# ============================================
# EXAMPLE USAGE (for future implementation)
# ============================================

def example_generate_quiz():
    """Example: Generate quiz for a book using LLM."""
    
    # Get a book
    books = get_books_by_topic("javascript", limit=1)
    if not books:
        print("No books found")
        return
    
    book = books[0]
    print(f"Generating quiz for: {book['title']}")
    
    # Generate questions with LLM
    questions = generate_quiz_with_llm(
        book_title=book['title'],
        book_description=book.get('description', ''),
        num_questions=5
    )
    
    # Save to database
    create_quiz_for_book(book['id'], questions)


def example_generate_learning_path():
    """Example: Generate learning path using LLM."""
    
    # Get books for a topic
    books = get_books_by_topic("python", limit=5)
    if not books:
        print("No books found")
        return
    
    print(f"Found {len(books)} books for Python")
    
    # Generate path with LLM
    path_data = generate_learning_path_with_llm(
        topic="Python Programming",
        difficulty="beginner",
        books=books
    )
    
    # Add required fields
    path_data["is_published"] = True
    
    # Create path in database
    book_ids = [book['id'] for book in books]
    create_learning_path(path_data, book_ids)


# ============================================
# MANUAL QUIZ CREATION (works now)
# ============================================

def create_sample_quiz_manual(book_id: str):
    """Create a sample quiz without LLM (works immediately)."""
    
    questions = [
        {
            "question": "What is the primary purpose of this book?",
            "option_a": "Entertainment",
            "option_b": "Education and skill development",
            "option_c": "Historical reference",
            "option_d": "Fiction storytelling",
            "correct_answer": "B",
            "difficulty": "easy"
        },
        {
            "question": "Who is the target audience for this book?",
            "option_a": "Complete beginners",
            "option_b": "Intermediate learners",
            "option_c": "Advanced professionals",
            "option_d": "All of the above",
            "correct_answer": "D",
            "difficulty": "easy"
        },
        {
            "question": "What is a key concept covered in this book?",
            "option_a": "Fundamental principles",
            "option_b": "Advanced techniques",
            "option_c": "Best practices",
            "option_d": "All of the above",
            "correct_answer": "D",
            "difficulty": "medium"
        },
        {
            "question": "How should you approach learning from this book?",
            "option_a": "Skip to the end",
            "option_b": "Read sequentially and practice",
            "option_c": "Only read summaries",
            "option_d": "Memorize without understanding",
            "correct_answer": "B",
            "difficulty": "easy"
        },
        {
            "question": "What is the best way to retain information from this book?",
            "option_a": "Read once quickly",
            "option_b": "Take notes and apply concepts",
            "option_c": "Watch videos instead",
            "option_d": "Skip difficult sections",
            "correct_answer": "B",
            "difficulty": "medium"
        }
    ]
    
    create_quiz_for_book(book_id, questions)


def create_sample_path_manual():
    """Create a sample learning path without LLM (works immediately)."""
    
    # Get some books
    books = get_books_by_topic("programming", limit=4)
    if len(books) < 3:
        print("Need at least 3 books to create a path")
        return
    
    path_data = {
        "title": "Programming Fundamentals",
        "description": "Learn programming from scratch with this comprehensive path",
        "category": "Programming",
        "difficulty_level": "beginner",
        "estimated_duration_days": 60,
        "is_published": True
    }
    
    book_ids = [book['id'] for book in books]
    create_learning_path(path_data, book_ids)


# ============================================
# CLI Interface
# ============================================

if __name__ == "__main__":
    import sys
    
    print("=" * 60)
    print("LLM Quiz & Learning Path Generator")
    print("=" * 60)
    print()
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python llm_quiz_generator.py create-quiz <book_id>")
        print("  python llm_quiz_generator.py create-path")
        print("  python llm_quiz_generator.py list-books <topic>")
        print()
        print("Examples:")
        print("  python llm_quiz_generator.py create-quiz abc-123-def")
        print("  python llm_quiz_generator.py create-path")
        print("  python llm_quiz_generator.py list-books javascript")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "create-quiz":
        if len(sys.argv) < 3:
            print("Error: Please provide book_id")
            sys.exit(1)
        book_id = sys.argv[2]
        print(f"Creating quiz for book: {book_id}")
        create_sample_quiz_manual(book_id)
    
    elif command == "create-path":
        print("Creating sample learning path...")
        create_sample_path_manual()
    
    elif command == "list-books":
        topic = sys.argv[2] if len(sys.argv) > 2 else "programming"
        print(f"Searching for books about: {topic}")
        books = get_books_by_topic(topic, limit=10)
        print(f"\nFound {len(books)} books:\n")
        for i, book in enumerate(books, 1):
            print(f"{i}. {book['title']} by {book['author']}")
            print(f"   ID: {book['id']}\n")
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
