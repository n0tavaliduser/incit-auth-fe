import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function EmailVerification() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // If user is already verified or using OAuth, redirect to dashboard
    if (!user || user.email_verified || user.provider !== 'local') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleResendVerification = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await api.post('/auth/resend-verification');
      setMessage('Verification email has been sent! Please check your inbox.');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user || user.email_verified || user.provider !== 'local') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            We've sent a verification email to
          </p>
          <p className="mt-1 text-center text-base text-white font-medium">
            {user.email}
          </p>
          <p className="mt-2 text-center text-xs text-gray-500">
            Please check your inbox and click the verification link
          </p>
        </div>

        {message && (
          <div className="bg-gray-800/50 p-4 rounded-lg text-gray-300 text-sm">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendVerification}
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent 
            text-sm font-medium rounded-lg text-white bg-gray-800 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
            transition-all duration-200 ease-in-out`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-600 group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              )}
            </span>
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>

          <button
            onClick={handleLogout}
            className="group relative w-full flex justify-center py-3 px-4 border border-red-600 
            text-sm font-medium rounded-lg text-red-500 bg-transparent 
            hover:bg-red-600 hover:text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
            transition-all duration-200 ease-in-out"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg 
                className="h-5 w-5 text-red-500 group-hover:text-white transition-colors duration-200" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                  clipRule="evenodd" 
                />
              </svg>
            </span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 