import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function EmailVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to resend verification email');

      setMessage('Verification email sent successfully. Please check your inbox.');
    } catch (error) {
      setMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Please verify your email address to access the dashboard
          </p>
        </div>

        {message && (
          <div className="bg-gray-800/50 p-4 rounded-lg text-gray-300 text-sm">
            {message}
          </div>
        )}

        <button
          onClick={handleResendVerification}
          disabled={isLoading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent 
          text-sm font-medium rounded-lg text-white bg-gray-800 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'} 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
          transition-all duration-200 ease-in-out`}
        >
          {isLoading ? 'Sending...' : 'Resend Verification Email'}
        </button>
      </div>
    </div>
  );
} 