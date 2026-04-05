import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Book } from '../lib/supabase';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  BookOpen, 
  Star, 
  Calendar, 
  FileText, 
  User,
  Globe,
  Hash,
  Layers,
  CheckCircle,
  Clock,
  BookMarked,
  Eye
} from 'lucide-react';

interface ReadingStatus {
  id: string;
  user_id: string;
  book_id: string;
  status: 'want_to_read' | 'currently_reading' | 'completed' | 'on_hold';
  user_rating: number | null;
  user_notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  added_at: string;
}

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserAndBook();
  }, [id]);

  const fetchUserAndBook = async () => {
    setLoading(true);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      
      // Fetch book details
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (bookData && !bookError) {
        setBook(bookData);
        
        // Fetch user's reading status for this book
        const { data: statusData } = await supabase
          .from('user_reading_list')
          .select('*')
          .eq('user_id', user.id)
          .eq('book_id', id)
          .single();

        if (statusData) {
          setReadingStatus(statusData);
          setRating(statusData.user_rating || 0);
          setNotes(statusData.user_notes || '');
        }
      }
    }
    
    setLoading(false);
  };

  const updateReadingStatus = async (status: ReadingStatus['status']) => {
    if (!userId || !id) return;
    
    setSaving(true);
    
    try {
      const now = new Date().toISOString();
      const updateData: any = {
        user_id: userId,
        book_id: id,
        status
      };

      // Set timestamps based on status
      if (status === 'currently_reading' && !readingStatus?.started_at) {
        updateData.started_at = now;
      }
      if (status === 'completed') {
        updateData.completed_at = now;
        if (!readingStatus?.started_at) {
          updateData.started_at = now;
        }
      }

      if (readingStatus) {
        // Update existing record
        const { data, error } = await supabase
          .from('user_reading_list')
          .update(updateData)
          .eq('id', readingStatus.id)
          .select()
          .single();

        if (error) {
          console.error('Update error:', error);
          toast.error(`Error updating status: ${error.message}`);
        } else if (data) {
          setReadingStatus(data);
          toast.success('Status updated successfully!');
        }
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('user_reading_list')
          .insert([updateData])
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          toast.error(`Error creating status: ${error.message}`);
        } else if (data) {
          setReadingStatus(data);
          toast.success('Status created successfully!');
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error(`Unexpected error: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  const saveRating = async (newRating: number) => {
    if (!userId || !id) return;
    
    setRating(newRating);
    setSaving(true);

    const updateData: any = {
      user_id: userId,
      book_id: id,
      user_rating: newRating
    };

    if (readingStatus) {
      await supabase
        .from('user_reading_list')
        .update({ user_rating: newRating })
        .eq('id', readingStatus.id);
    } else {
      updateData.status = 'want_to_read';
      const { data } = await supabase
        .from('user_reading_list')
        .insert([updateData])
        .select()
        .single();
      
      if (data) {
        setReadingStatus(data);
      }
    }
    
    setSaving(false);
  };

  const saveNotes = async () => {
    if (!userId || !id) return;
    
    setSaving(true);

    const updateData: any = {
      user_id: userId,
      book_id: id,
      user_notes: notes
    };

    if (readingStatus) {
      await supabase
        .from('user_reading_list')
        .update({ user_notes: notes })
        .eq('id', readingStatus.id);
    } else {
      updateData.status = 'want_to_read';
      const { data } = await supabase
        .from('user_reading_list')
        .insert([updateData])
        .select()
        .single();
      
      if (data) {
        setReadingStatus(data);
      }
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-8 flex items-center justify-center">
        <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
          <button
            onClick={() => navigate('/book-search')}
            className="btn-primary"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Book Header */}
        <div className="glass-effect rounded-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover Image */}
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full md:w-48 h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full md:w-48 h-64 bg-background-light rounded-lg flex items-center justify-center">
                <BookOpen size={48} className="text-gray-400" />
              </div>
            )}

            {/* Book Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">by {book.author}</p>
              
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {book.isbn && (
                  <div className="flex items-center gap-2 text-sm">
                    <Hash size={16} className="text-primary" />
                    <span className="text-gray-600 dark:text-gray-300">ISBN: {book.isbn}</span>
                  </div>
                )}
                {book.publication_year && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-primary" />
                    <span className="text-gray-600 dark:text-gray-300">{book.publication_year}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText size={16} className="text-primary" />
                    <span className="text-gray-600 dark:text-gray-300">{book.pages} pages</span>
                  </div>
                )}
                {book.language && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe size={16} className="text-primary" />
                    <span className="text-gray-600 dark:text-gray-300">{book.language}</span>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-primary" />
                    <span className="text-gray-600 dark:text-gray-300">{book.publisher}</span>
                  </div>
                )}
                {book.genre && (
                  <div className="flex items-center gap-2 text-sm">
                    <Layers size={16} className="text-primary" />
                    <span className="text-gray-600 dark:text-gray-300">{book.genre}</span>
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`px-4 py-2 rounded-lg font-semibold ${
                  book.is_available && book.available_copies > 0
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary/20 text-secondary'
                }`}>
                  {book.is_available && book.available_copies > 0 ? 'Available' : 'Not Available'}
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  {book.available_copies} of {book.total_copies} copies available
                </span>
              </div>

              {/* Book Type */}
              {book.book_type && (
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {book.book_type}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reading Status Buttons */}
        <div className="glass-effect rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Reading Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => updateReadingStatus('want_to_read')}
              disabled={saving}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                readingStatus?.status === 'want_to_read'
                  ? 'gradient-bg text-white'
                  : 'bg-background-light hover:bg-primary/20'
              }`}
            >
              <BookMarked size={18} />
              Want to Read
            </button>
            <button
              onClick={() => updateReadingStatus('currently_reading')}
              disabled={saving}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                readingStatus?.status === 'currently_reading'
                  ? 'gradient-bg text-white'
                  : 'bg-background-light hover:bg-primary/20'
              }`}
            >
              <Eye size={18} />
              Reading
            </button>
            <button
              onClick={() => updateReadingStatus('completed')}
              disabled={saving}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                readingStatus?.status === 'completed'
                  ? 'gradient-bg text-white'
                  : 'bg-background-light hover:bg-primary/20'
              }`}
            >
              <CheckCircle size={18} />
              Completed
            </button>
            <button
              onClick={() => updateReadingStatus('on_hold')}
              disabled={saving}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                readingStatus?.status === 'on_hold'
                  ? 'gradient-bg text-white'
                  : 'bg-background-light hover:bg-primary/20'
              }`}
            >
              <Clock size={18} />
              On Hold
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="glass-effect rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Your Rating</h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => saveRating(star)}
                disabled={saving}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-4 text-lg font-semibold">{rating}/5</span>
            )}
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="glass-effect rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {book.description}
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="glass-effect rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Notes</h2>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {showNotes ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showNotes && (
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your thoughts, quotes, or reflections about this book..."
                className="w-full h-32 px-4 py-3 bg-background-light border border-gray-700 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground resize-none"
              />
              <button
                onClick={saveNotes}
                disabled={saving}
                className="btn-primary mt-3"
              >
                {saving ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          )}
        </div>

        {/* Quiz Section */}
        <div className="glass-effect rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Reading Quiz</h2>
          {readingStatus?.status === 'completed' ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You've completed this book! Test your understanding with a quiz.
              </p>
              <button
                onClick={() => navigate(`/quiz/${id}`)}
                className="px-6 py-3 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Take Quiz
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Complete this book to unlock the reading quiz!
              </p>
              <p className="text-sm text-gray-500">
                Test your understanding and verify you've read the book
              </p>
            </div>
          )}
        </div>

        {/* PDF Link */}
        {book.pdf_url && (
          <div className="glass-effect rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Digital Copy</h2>
            <a
              href={book.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Open PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
