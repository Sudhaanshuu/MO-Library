import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, Map, BookOpen, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface LearningPath {
  id?: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  estimated_duration_days: number | null;
  cover_image_url: string | null;
  is_published: boolean;
}

interface PathBook {
  id?: string;
  learning_path_id: string;
  book_id: string;
  sequence_order: number;
  is_required: boolean;
  notes: string | null;
  book?: {
    title: string;
    author: string;
  };
}

interface Book {
  id: string;
  title: string;
  author: string;
}

export default function LearningPathManager() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [pathBooks, setPathBooks] = useState<PathBook[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [showPathForm, setShowPathForm] = useState(false);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyPath: LearningPath = {
    title: '',
    description: '',
    category: '',
    difficulty_level: 'beginner',
    estimated_duration_days: null,
    cover_image_url: null,
    is_published: false,
  };

  useEffect(() => {
    fetchPaths();
    fetchAllBooks();
  }, []);

  useEffect(() => {
    if (selectedPath) {
      fetchPathBooks(selectedPath);
    }
  }, [selectedPath]);

  const fetchPaths = async () => {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPaths(data);
    }
  };

  const fetchAllBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('id, title, author')
      .order('title');

    if (!error && data) {
      setAllBooks(data);
    }
  };

  const fetchPathBooks = async (pathId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('roadmap_books')
      .select(`
        *,
        book:books(title, author)
      `)
      .eq('learning_path_id', pathId)
      .order('sequence_order');

    if (!error && data) {
      setPathBooks(data);
    }
    setLoading(false);
  };

  const handleSavePath = async (path: LearningPath) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (path.id) {
        // Update existing
        const { error } = await supabase
          .from('learning_paths')
          .update(path)
          .eq('id', path.id);

        if (error) throw error;
        toast.success('Learning path updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('learning_paths')
          .insert({ ...path, created_by: user?.id });

        if (error) throw error;
        toast.success('Learning path created successfully');
      }

      setShowPathForm(false);
      setEditingPath(null);
      fetchPaths();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save learning path');
    }
  };

  const handleDeletePath = async (id: string) => {
    if (!confirm('Are you sure? This will delete all books in this path.')) return;

    try {
      const { error } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Learning path deleted successfully');
      fetchPaths();
      if (selectedPath === id) {
        setSelectedPath('');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete learning path');
    }
  };

  const handleAddBookToPath = async (bookId: string, isRequired: boolean, notes: string) => {
    try {
      const maxOrder = pathBooks.length > 0 
        ? Math.max(...pathBooks.map(pb => pb.sequence_order))
        : 0;

      const { error } = await supabase
        .from('roadmap_books')
        .insert({
          learning_path_id: selectedPath,
          book_id: bookId,
          sequence_order: maxOrder + 1,
          is_required: isRequired,
          notes: notes || null,
        });

      if (error) throw error;
      toast.success('Book added to path');
      setShowBookForm(false);
      fetchPathBooks(selectedPath);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add book');
    }
  };

  const handleRemoveBookFromPath = async (id: string) => {
    if (!confirm('Remove this book from the path?')) return;

    try {
      const { error } = await supabase
        .from('roadmap_books')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Book removed from path');
      fetchPathBooks(selectedPath);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove book');
    }
  };

  const handleReorderBook = async (bookId: string, direction: 'up' | 'down') => {
    const currentIndex = pathBooks.findIndex(pb => pb.id === bookId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= pathBooks.length) return;

    const newOrder = [...pathBooks];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

    // Update sequence orders
    try {
      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('roadmap_books')
          .update({ sequence_order: i + 1 })
          .eq('id', newOrder[i].id);
      }
      fetchPathBooks(selectedPath);
    } catch (error: any) {
      toast.error('Failed to reorder books');
    }
  };

  return (
    <div className="space-y-6">
      {/* Path Management */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Learning Paths ({paths.length})</h3>
          <button
            onClick={() => {
              setEditingPath(emptyPath);
              setShowPathForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90"
          >
            <Plus size={20} />
            Create Path
          </button>
        </div>

        {showPathForm && editingPath && (
          <PathForm
            path={editingPath}
            onSave={handleSavePath}
            onCancel={() => {
              setShowPathForm(false);
              setEditingPath(null);
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {paths.map((path) => (
            <div
              key={path.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedPath === path.id
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-background-light hover:bg-primary/10'
              }`}
              onClick={() => setSelectedPath(path.id!)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">{path.title}</h4>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPath(path);
                      setShowPathForm(true);
                    }}
                    className="p-1 bg-primary/20 text-primary rounded hover:bg-primary/30"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePath(path.id!);
                    }}
                    className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {path.description}
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-primary/20 text-primary capitalize">
                  {path.difficulty_level}
                </span>
                <span className={`px-2 py-1 rounded ${
                  path.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {path.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Books in Path */}
      {selectedPath && (
        <div className="glass-effect rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Books in Path ({pathBooks.length})</h3>
            <button
              onClick={() => setShowBookForm(true)}
              className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90"
            >
              <Plus size={20} />
              Add Book
            </button>
          </div>

          {showBookForm && (
            <AddBookForm
              books={allBooks}
              onAdd={handleAddBookToPath}
              onCancel={() => setShowBookForm(false)}
            />
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin-slow w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : pathBooks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                No books in this path yet. Add your first book!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pathBooks.map((pathBook, index) => (
                <div key={pathBook.id} className="flex items-center gap-3 p-4 bg-background-light rounded-lg">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleReorderBook(pathBook.id!, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-primary/20 rounded disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => handleReorderBook(pathBook.id!, 'down')}
                      disabled={index === pathBooks.length - 1}
                      className="p-1 hover:bg-primary/20 rounded disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {pathBook.sequence_order}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{pathBook.book?.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      by {pathBook.book?.author}
                    </p>
                    {pathBook.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">{pathBook.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {pathBook.is_required && (
                      <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                        Required
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveBookFromPath(pathBook.id!)}
                      className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Path Form Component
function PathForm({
  path,
  onSave,
  onCancel,
}: {
  path: LearningPath;
  onSave: (path: LearningPath) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(path);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="mb-6 p-6 bg-background-light rounded-lg">
      <h4 className="text-lg font-bold mb-4">
        {path.id ? 'Edit Learning Path' : 'Create New Learning Path'}
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Category *</label>
            <input
              required
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Programming, Business, Science"
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Difficulty Level *</label>
            <select
              required
              value={formData.difficulty_level}
              onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Estimated Duration (days)</label>
            <input
              type="number"
              value={formData.estimated_duration_days || ''}
              onChange={(e) => setFormData({ ...formData, estimated_duration_days: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Cover Image URL</label>
            <input
              type="url"
              value={formData.cover_image_url || ''}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value || null })}
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 text-primary bg-background border-gray-700 rounded focus:ring-primary"
              />
              <span className="text-sm font-semibold">Publish this learning path</span>
            </label>
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
            Save Path
          </button>
        </div>
      </form>
    </div>
  );
}

// Add Book Form Component
function AddBookForm({
  books,
  onAdd,
  onCancel,
}: {
  books: Book[];
  onAdd: (bookId: string, isRequired: boolean, notes: string) => void;
  onCancel: () => void;
}) {
  const [selectedBook, setSelectedBook] = useState('');
  const [isRequired, setIsRequired] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBook) {
      onAdd(selectedBook, isRequired, notes);
    }
  };

  return (
    <div className="mb-6 p-6 bg-background-light rounded-lg">
      <h4 className="text-lg font-bold mb-4">Add Book to Path</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Select Book *</label>
          <select
            required
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="">Choose a book...</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Why this book is important in this path..."
            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground resize-none"
            rows={2}
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-gray-700 rounded focus:ring-primary"
            />
            <span className="text-sm font-semibold">This book is required</span>
          </label>
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
            <Plus size={18} />
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
}
