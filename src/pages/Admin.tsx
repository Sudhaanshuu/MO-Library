import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, isAdmin } from '../lib/supabase';
import { BookOpen, User, Search, Download, Filter, RefreshCw, IndianRupee, Plus, Edit, Trash2, BookPlus  } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { Booking, Book } from '../lib/supabase';
import QuizManager from '../components/QuizManager';
import LearningPathManager from '../components/LearningPathManager';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'books' | 'quizzes' | 'paths'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('all');
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        const adminStatus = await isAdmin();
        
        if (!adminStatus) {
          toast.error('Unauthorized access');
          navigate('/');
          return;
        }

        await fetchBookings();
        await fetchBooks();
      } catch (error: any) {
        toast.error(error.message || 'Failed to load admin data');
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, [navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch all bookings with seat and profile information
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          seat:seats(*),
          profile:profiles(id, email, full_name, avatar_url)
        `)
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load books');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);
      
      if (error) throw error;
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete book');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

  const calculatePrice = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return hours * 5; // 5 rupees per hour
  };

  const filteredBookings = bookings
    .filter(booking => {
      // Apply search filter
      const userName = booking.profile?.full_name?.toLowerCase() || '';
      const userEmail = booking.profile?.email.toLowerCase() || '';
      const seatNumber = booking.seat?.seat_number.toLowerCase() || '';
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        userName.includes(searchLower) || 
        userEmail.includes(searchLower) || 
        seatNumber.includes(searchLower);
      
      // Apply status filter
      let matchesStatus = true;
      if (filterStatus === 'upcoming') {
        matchesStatus = isUpcoming(booking.start_time);
      } else if (filterStatus === 'past') {
        matchesStatus = !isUpcoming(booking.start_time);
      }
      
      return matchesSearch && matchesStatus;
    });

  const filteredTotalRevenue = filteredBookings.reduce((total, booking) => {
    return total + calculatePrice(booking.start_time, booking.end_time);
  }, 0);

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['User Name', 'Email', 'Seat', 'Start Time', 'End Time', 'Status', 'Price (Rs)'];
    const csvRows = [headers];
    
    filteredBookings.forEach(booking => {
      const row = [
        booking.profile?.full_name || 'Unknown',
        booking.profile?.email || 'Unknown',
        booking.seat?.seat_number || 'Unknown',
        new Date(booking.start_time).toLocaleString(),
        new Date(booking.end_time).toLocaleString(),
        isUpcoming(booking.start_time) ? 'Upcoming' : 'Past',
        calculatePrice(booking.start_time, booking.end_time).toString()
      ];
      csvRows.push(row);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `library-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin-slow w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="gradient-text">Admin</span> Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Manage library bookings and book collection
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 gap-4 flex-wrap">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'gradient-bg text-white'
                : 'glass-effect text-gray-600 dark:text-gray-300 hover:bg-primary/20'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'books'
                ? 'gradient-bg text-white'
                : 'glass-effect text-gray-600 dark:text-gray-300 hover:bg-primary/20'
            }`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'quizzes'
                ? 'gradient-bg text-white'
                : 'glass-effect text-gray-600 dark:text-gray-300 hover:bg-primary/20'
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setActiveTab('paths')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'paths'
                ? 'gradient-bg text-white'
                : 'glass-effect text-gray-600 dark:text-gray-300 hover:bg-primary/20'
            }`}
          >
            Learning Paths
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect p-6 rounded-xl mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or seat..."
                className="block w-full pl-10 pr-3 py-2 rounded-md bg-background-light border border-gray-700 focus:ring-primary focus:border-primary text-white"
              />
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'upcoming' | 'past')}
                  className="bg-background-light border border-gray-700 text-white rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Bookings</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
              
              <button
                onClick={fetchBookings}
                className="p-2 rounded-md bg-background-light hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5 text-gray-800 dark:text-gray-300" />
              </button>
              
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 rounded-md gradient-bg text-white hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          {/* Revenue Summary */}
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IndianRupee className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-lg font-semibold">Revenue Summary</h3>
              </div>
              <div className="text-xl font-bold gradient-text">
                Rs{filteredTotalRevenue.toLocaleString()}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Based on Rs 5 per hour rate for all bookings
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-background-light">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Seat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-background-light transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            {booking.profile?.avatar_url ? (
                              <img
                                src={booking.profile.avatar_url}
                                alt={booking.profile.full_name || ''}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {booking.profile?.full_name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {booking.profile?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{booking.seat?.seat_number || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(booking.start_time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isUpcoming(booking.start_time)
                            ? 'bg-primary/20 text-primary'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {isUpcoming(booking.start_time) ? 'Upcoming' : 'Past'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Rs{calculatePrice(booking.start_time, booking.end_time)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">No bookings found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {filteredBookings.length} bookings
            </div>
            <div className="text-sm font-medium text-primary">
              Total Revenue: Rs{filteredTotalRevenue.toLocaleString()}
            </div>
          </div>
        </motion.div>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Book Collection</h2>
              <button
                onClick={() => {
                  setEditingBook(null);
                  setShowBookModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white hover:opacity-90 transition-opacity"
              >
                <Plus size={20} />
                Add New Book
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-background-light rounded-lg p-4 hover:neon-shadow transition-all">
                  {book.cover_image_url && (
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">by {book.author}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      book.book_type === 'ebook' ? 'bg-blue-500/20 text-blue-400' :
                      book.book_type === 'both' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {book.book_type}
                    </span>
                    {book.genre && (
                      <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary">
                        {book.genre}
                      </span>
                    )}
                  </div>

                  <div className="text-sm mb-3">
                    <p>Available: {book.available_copies}/{book.total_copies}</p>
                    {book.isbn && <p className="text-gray-600 dark:text-gray-300">ISBN: {book.isbn}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingBook(book);
                        setShowBookModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {books.length === 0 && (
              <div className="text-center py-12">
                <BookPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No books yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Start building your library collection</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuizManager />
          </motion.div>
        )}

        {/* Learning Paths Tab */}
        {activeTab === 'paths' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LearningPathManager />
          </motion.div>
        )}

        {/* Book Modal */}
        {showBookModal && (
          <BookModal
            book={editingBook}
            onClose={() => {
              setShowBookModal(false);
              setEditingBook(null);
            }}
            onSave={() => {
              fetchBooks();
              setShowBookModal(false);
              setEditingBook(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Book Modal Component
const BookModal: React.FC<{
  book: Book | null;
  onClose: () => void;
  onSave: () => void;
}> = ({ book, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    book_type: book?.book_type || 'physical',
    pdf_url: book?.pdf_url || '',
    cover_image_url: book?.cover_image_url || '',
    description: book?.description || '',
    genre: book?.genre || '',
    category: book?.category || '',
    publication_year: book?.publication_year || '',
    pages: book?.pages || '',
    language: book?.language || 'English',
    publisher: book?.publisher || '',
    total_copies: book?.total_copies || 1,
    available_copies: book?.available_copies || 1,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const bookData = {
        ...formData,
        publication_year: formData.publication_year ? parseInt(formData.publication_year as string) : null,
        pages: formData.pages ? parseInt(formData.pages as string) : null,
        is_available: formData.available_copies > 0,
      };

      if (book) {
        // Update existing book
        const { error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', book.id);
        
        if (error) throw error;
        toast.success('Book updated successfully');
      } else {
        // Create new book
        const { error } = await supabase
          .from('books')
          .insert(bookData);
        
        if (error) throw error;
        toast.success('Book added successfully');
      }

      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="glass-effect rounded-xl p-6 max-w-2xl w-full my-8">
        <h2 className="text-2xl font-bold mb-6">{book ? 'Edit Book' : 'Add New Book'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Author *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Book Type</label>
              <select
                value={formData.book_type}
                onChange={(e) => setFormData({ ...formData, book_type: e.target.value as 'physical' | 'ebook' | 'both' })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="physical">Physical</option>
                <option value="ebook">E-book</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Genre</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Publication Year</label>
              <input
                type="number"
                value={formData.publication_year}
                onChange={(e) => setFormData({ ...formData, publication_year: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Pages</label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Publisher</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Total Copies</label>
              <input
                type="number"
                min="1"
                value={formData.total_copies}
                onChange={(e) => setFormData({ ...formData, total_copies: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Available Copies</label>
              <input
                type="number"
                min="0"
                value={formData.available_copies}
                onChange={(e) => setFormData({ ...formData, available_copies: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Cover Image URL</label>
            <input
              type="url"
              value={formData.cover_image_url}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
              className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          {(formData.book_type === 'ebook' || formData.book_type === 'both') && (
            <div>
              <label className="block text-sm font-semibold mb-2">PDF URL</label>
              <input
                type="url"
                value={formData.pdf_url}
                onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background-light border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;