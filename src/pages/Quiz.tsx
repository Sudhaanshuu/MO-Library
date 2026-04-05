import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, CheckCircle, XCircle, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface QuizQuestion {
  id: string;
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

export default function Quiz() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizData();
  }, [bookId]);

  const fetchQuizData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to take the quiz');
        navigate('/login');
        return;
      }
      setUserId(user.id);

      // Fetch book details
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('id, title, author')
        .eq('id', bookId)
        .single();

      if (bookError) throw bookError;
      setBook(bookData);

      // Fetch quiz questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('reading_quiz_questions')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: true });

      if (questionsError) throw questionsError;

      if (!questionsData || questionsData.length === 0) {
        toast.error('No quiz questions available for this book');
        navigate(`/book/${bookId}`);
        return;
      }

      setQuestions(questionsData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load quiz');
      navigate(`/book/${bookId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    // Save quiz attempt
    if (userId && bookId) {
      const passed = (correctCount / questions.length) >= 0.7; // 70% pass rate
      
      try {
        await supabase.from('user_quiz_attempts').insert({
          user_id: userId,
          book_id: bookId,
          score: correctCount,
          total_questions: questions.length,
          passed,
        });
      } catch (error) {
        console.error('Failed to save quiz attempt:', error);
      }
    }
  };

  const getOptionLabel = (option: string) => {
    return option.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen pt-24 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-lg p-8 text-center"
          >
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {passed ? (
                <Award size={48} className="text-green-400" />
              ) : (
                <XCircle size={48} className="text-red-400" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Keep Trying!'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              You scored {score} out of {questions.length} ({percentage.toFixed(0)}%)
            </p>

            {passed ? (
              <p className="text-green-400 mb-8">
                You've passed the quiz! You've demonstrated good understanding of "{book?.title}".
              </p>
            ) : (
              <p className="text-red-400 mb-8">
                You need 70% to pass. Review the book and try again!
              </p>
            )}

            {/* Show answers */}
            <div className="text-left mb-8">
              <h3 className="text-xl font-bold mb-4">Review Your Answers</h3>
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correct_answer;

                return (
                  <div key={question.id} className="mb-4 p-4 bg-background-light rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle size={20} className="text-red-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold mb-2">{index + 1}. {question.question}</p>
                        <p className="text-sm">
                          Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                            {userAnswer || 'Not answered'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-400">
                            Correct answer: {question.correct_answer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/book/${bookId}`)}
                className="px-6 py-3 glass-effect rounded-lg hover:bg-primary/20 transition-colors"
              >
                Back to Book
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Retake Quiz
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate(`/book/${bookId}`)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Book
        </button>

        <div className="glass-effect rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-primary" size={24} />
            <div>
              <h1 className="text-2xl font-bold">{book?.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">by {book?.author}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{progress.toFixed(0)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="gradient-bg h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-lg p-8 mb-6"
        >
          <div className="flex items-start gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm bg-primary/20 text-primary capitalize">
              {question.difficulty}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-6">{question.question}</h2>

          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map((option) => {
              const optionKey = `option_${option}` as keyof QuizQuestion;
              const optionText = question[optionKey] as string;
              const isSelected = selectedAnswers[currentQuestion] === option.toUpperCase();

              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option.toUpperCase())}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    isSelected
                      ? 'gradient-bg text-white'
                      : 'bg-background-light hover:bg-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isSelected ? 'bg-white/20' : 'bg-primary/20 text-primary'
                    }`}>
                      {option.toUpperCase()}
                    </span>
                    <span>{optionText}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 glass-effect rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            {Object.keys(selectedAnswers).length} of {questions.length} answered
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
              className="px-6 py-3 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
