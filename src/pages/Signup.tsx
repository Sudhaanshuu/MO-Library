import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { BookOpen, Mail, Lock, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Sign up the user with metadata included
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName, // Include full_name in user metadata
          }
        }
      });
      
      if (authError) throw authError;
      
      // Check if we need to update the profile
      if (authData.user) {
        // Check if profile exists first
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        // If profile exists but needs the full name updated
        if (existingProfile && (!existingProfile.full_name || existingProfile.full_name !== fullName)) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', authData.user.id);
            
          if (updateError) console.error("Error updating profile:", updateError);
        } 
        // If profile doesn't exist (shouldn't happen with triggers, but just in case)
        else if (!existingProfile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                email,
                full_name: fullName,
              }
            ]);
            
          if (insertError) console.error("Error creating profile:", insertError);
        }
      }
      
      toast.success('Account created successfully! Please check your email for verification.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect p-8 rounded-xl w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block"
          >
            <BookOpen className="w-12 h-12 text-primary mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold mt-4">Create an Account</h2>
          <p className="text-gray-300 mt-2">Join Mo-Library today</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-md bg-background-light border border-gray-700 focus:ring-primary focus:border-primary text-white"
                placeholder="Your Name"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-md bg-background-light border border-gray-700 focus:ring-primary focus:border-primary text-white"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-md bg-background-light border border-gray-700 focus:ring-primary focus:border-primary text-white"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Password must be at least 6 characters long</p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up
                </>
              )}
            </button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;