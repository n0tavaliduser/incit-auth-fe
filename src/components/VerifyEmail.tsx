import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function VerifyEmail() {
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(3);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle email verification and start countdown immediately
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get<{ message: string; token: string; user: any }>(
          `/auth/verify-email/${token}`
        );

        console.log('Verification response:', response.data);

        // Start countdown after successful verification
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Update auth context with new token if available
        if (response.data.token) {
          login(response.data);
        }

        return () => clearInterval(timer);
      } catch (err) {
        console.error('Verification error:', err);
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [token, navigate, login]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <div className="text-center text-red-400">
            <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <svg className="h-16 w-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Email Verified Successfully!
          </h2>
          <p className="text-gray-400">
            Redirecting to dashboard in{' '}
            <span className="text-white font-bold text-xl inline-block w-6 h-6 leading-6 animate-pulse">
              {countdown}
            </span>{' '}
            seconds...
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full py-3 px-4 border border-transparent rounded-lg 
            text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
            transition-all duration-200 ease-in-out"
          >
            If not redirected automatically, click here
          </button>
        </div>
      </div>
    </div>
  );
} 