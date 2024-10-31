import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface PasswordValidation {
  hasLower: boolean;
  hasUpper: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  hasLength: boolean;
}

export default function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setSuccess('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Check if all password requirements are met
    if (!Object.values(validation).every(Boolean)) {
      setError('New password does not meet all requirements');
      return;
    }

    setIsLoading(true);
    try {
      await api.put('/profile/change-password', {
        oldPassword,
        newPassword
      });

      setSuccess('Password changed successfully');
      // Clear form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent password change for OAuth users
  if (user?.provider !== 'local') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8">
            <div className="text-center text-gray-400">
              <h2 className="text-xl font-bold mb-4">Password Change Not Available</h2>
              <p>Password cannot be changed for accounts using {user?.provider} login.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Change Password</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full 
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full 
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full 
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 border border-transparent rounded-lg 
              text-sm font-medium text-white bg-indigo-600 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
              transition-all duration-200 ease-in-out`}
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 