import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, BookOpen, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuizQuestion {
  id?: string;
  book_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
}

export default function QuizManager() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const emptyQuestion: QuizQuestion = {
    book_id: '',
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    difficulty: 'medium',
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      fetchQuestions(selectedBook);
    }
  }, [selectedBook]);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('id, title, author')
      .order('title');

    if (!error && data) {
      setBooks(data);
    }
  };

  const fetchQuestions = async (bookId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reading_quiz_questions')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at');

    if (!error && data) {
      setQuestions(data);
    }
    setLoading(false);
  };

  const handleSaveQuestion = async (question: QuizQuestion) => {
    try {
      if (question.id) {
        // Update existing
        const { error } = await supabase
          .from('reading_quiz_questions')
          .update(question)
          .eq('id', question.id);

        if (error) throw error;
        toast.success('Question updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('reading_quiz_questions')
          .insert({ ...question, book_id: selectedBook });

        if (error) throw error;
        toast.success('Question added successfully');
      }

      setShowForm(false);
      setEditingQuestion(null);
      fetchQuestions(selectedBook);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('reading_quiz_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Question deleted successfully');
      fetchQuestions(selectedBook);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete question');
    }
  };

  return (
    <div className="space-y-6">
      {/* Book Selector */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Select Book</h3>
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="w-full px-4 py-3 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
        >
          <option value="">Choose a book...</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} by {book.author}
            </option>
          ))}
        </select>
      </div>

      {selectedBook && (
        <>
          {/* Add Question Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              Quiz Questions ({questions.length})
            </h3>
            <button
              onClick={() => {
                setEditingQuestion({ ...emptyQuestion, book_id: selectedBook });
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90"
            >
              <Plus size={20} />
              Add Question
            </button>
          </div>

          {/* Question Form */}
          {showForm && editingQuestion && (
            <QuestionForm
              question={editingQuestion}
              onSave={handleSaveQuestion}
              onCancel={() => {
                setShowForm(false);
                setEditingQuestion(null);
              }}
            />
          )}

          {/* Questions List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin-slow w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : questions.length === 0 ? (
            <div className="glass-effect rounded-lg p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                No quiz questions yet. Add your first question!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="glass-effect rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-primary">Q{index + 1}</span>
                        <span className={`px-2 py-1 rounded text-xs capitalize ${
                          question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          question.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="font-semibold mb-3">{question.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className={`p-2 rounded ${question.correct_answer === 'A' ? 'bg-green-500/20 text-green-400' : 'bg-background-light'}`}>
                          A) {question.option_a}
                        </div>
                        <div className={`p-2 rounded ${question.correct_answer === 'B' ? 'bg-green-500/20 text-green-400' : 'bg-background-light'}`}>
                          B) {question.option_b}
                        </div>
                        <div className={`p-2 rounded ${question.correct_answer === 'C' ? 'bg-green-500/20 text-green-400' : 'bg-background-light'}`}>
                          C) {question.option_c}
                        </div>
                        <div className={`p-2 rounded ${question.correct_answer === 'D' ? 'bg-green-500/20 text-green-400' : 'bg-background-light'}`}>
                          D) {question.option_d}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingQuestion(question);
                          setShowForm(true);
                        }}
                        className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id!)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Question Form Component
function QuestionForm({
  question,
  onSave,
  onCancel,
}: {
  question: QuizQuestion;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(question);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="glass-effect rounded-lg p-6">
      <h4 className="text-lg font-bold mb-4">
        {question.id ? 'Edit Question' : 'Add New Question'}
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Question *</label>
          <textarea
            required
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            className="w-full px-4 py-3 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Option A *</label>
            <input
              required
              type="text"
              value={formData.option_a}
              onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
              className="w-full px-4 py-3 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Option B *</label>
            <input
              required
              type="text"
              value={formData.option_b}
              onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
              className="w-full px-4 py-3 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Option C *</label>
            <input
              required
              type="text"
              value={formData.option_c}
              onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
              className="w-full px-4 py-3 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Option D *</label>
            <input
              required
              type="text"
              value={formData.option_d}
              onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
              className="w-full px-4 py-3 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Correct Answer *</label>
            <select
              required
              value={formData.correct_answer}
              onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
              className="w-full px-4 py-3 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Difficulty *</label>
            <select
              required
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-4 py-3 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg hover:bg-gray-700"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90"
          >
            <Save size={18} />
            Save Question
          </button>
        </div>
      </form>
    </div>
  );
}
