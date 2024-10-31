import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

interface PasswordValidation {
  hasLower: boolean;
  hasUpper: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  hasLength: boolean;
}

interface ResetPasswordResponse {
  message: string;
}

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validation, setValidation] = useState<PasswordValidation>({
    hasLower: false,
    hasUpper: false,
    hasDigit: false,
    hasSpecial: false,
    hasLength: false
  });

  // Check password requirements as user types
  const validatePassword = (password: string) => {
    setValidation({
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasDigit: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasLength: password.length >= 8
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Reset messages
    setError('');
    setMessage('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if all password requirements are met
    if (!Object.values(validation).every(Boolean)) {
      setError('Password does not meet all requirements');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post<ResetPasswordResponse>(`/auth/reset-password/${token}`, {
        password
      });
      
      setMessage(response.data.message);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-900 via-purple-800/10 to-black">
      <div className="max-w-md w-full space-y-8 bg-gray-900/80 backdrop-blur-lg p-8 
      rounded-2xl shadow-2xl border border-purple-500/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Please enter your new password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="sr-only">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border 
              border-gray-700 rounded-lg bg-gray-800 text-white 
              placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-purple-500/50 focus:border-purple-500/50 
              focus:z-10 sm:text-sm transition-all duration-200"
              placeholder="New password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
            />
          </div>

          {/* Password Requirements */}
          <div className="space-y-2 text-sm">
            <p className={`${validation.hasLength ? 'text-green-400' : 'text-gray-400'}`}>
              ✓ At least 8 characters
            </p>
            <p className={`${validation.hasLower ? 'text-green-400' : 'text-gray-400'}`}>
              ✓ One lowercase letter
            </p>
            <p className={`${validation.hasUpper ? 'text-green-400' : 'text-gray-400'}`}>
              ✓ One uppercase letter
            </p>
            <p className={`${validation.hasDigit ? 'text-green-400' : 'text-gray-400'}`}>
              ✓ One number
            </p>
            <p className={`${validation.hasSpecial ? 'text-green-400' : 'text-gray-400'}`}>
              ✓ One special character
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border 
              border-gray-700 rounded-lg bg-gray-800 text-gray-300 
              placeholder-gray-500 focus:outline-none focus:ring-indigo-500 
              focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
              {message}
              <p className="mt-2 text-sm">Redirecting to login page...</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 
            border border-transparent text-sm font-medium rounded-lg 
            text-white bg-purple-600 hover:bg-purple-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-purple-500 transition-all duration-200"
          >
            {isLoading ? 'Resetting password...' : 'Reset password'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 
              transition-colors duration-200"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 