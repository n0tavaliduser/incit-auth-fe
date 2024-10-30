import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function EmailVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fungsi untuk mengecek status verifikasi email
  const checkEmailVerification = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/check-verification', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.email_verified) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  useEffect(() => {
    // Debug log
    console.log('Current user state:', user);
    
    // Redirect ke dashboard jika email sudah terverifikasi
    if (user && user.email_verified === true) {
      console.log('Email verified, redirecting to dashboard');
      navigate('/');
      return;
    }

    // Set interval untuk mengecek status verifikasi setiap 10 detik
    const intervalId = setInterval(checkEmailVerification, 10000);

    // Cleanup interval ketika component unmount
    return () => clearInterval(intervalId);
  }, [user, navigate]);

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setMessage('Failed to logout. Please try again.');
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
          <p className="mt-2 text-center text-xs text-gray-500">
            Checking verification status every 10 seconds...
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
            className={`w-full flex justify-center py-3 px-4 border border-transparent 
            text-sm font-medium rounded-lg text-white bg-gray-800 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
            transition-all duration-200 ease-in-out`}
          >
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-3 px-4 border border-red-600 
            text-sm font-medium rounded-lg text-red-500 bg-transparent 
            hover:bg-red-600 hover:text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
            transition-all duration-200 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 