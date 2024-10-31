import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RegisterFormProps } from '../types/auth';
import { validatePassword, PasswordValidation, isPasswordValid } from '../utils/passwordValidation';
import { useFacebookSDK } from '../utils/FacebookSDK';

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasLower: false,
    hasUpper: false,
    hasDigit: false,
    hasSpecial: false,
    hasLength: false
  });
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();

  // Initialize Facebook SDK
  useFacebookSDK();

  useEffect(() => {
    setPasswordValidation(validatePassword(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!isPasswordValid(passwordValidation)) {
      setError('Password does not meet requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await register(name, email, password);
      if (response?.token) {
        localStorage.setItem('token', response.token);
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (socialLoginFn: () => Promise<void>) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await socialLoginFn();
      navigate('/');
    } catch (err) {
      console.error('Social login error:', err);
      setError('Social login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordRequirements = () => (
    <div className="mt-2 space-y-2 text-sm">
      <p className={`flex items-center ${passwordValidation.hasLength ? 'text-green-400' : 'text-gray-400'}`}>
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          {passwordValidation.hasLength ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          )}
        </svg>
        At least 8 characters
      </p>
      <p className={`flex items-center ${passwordValidation.hasLower ? 'text-green-400' : 'text-gray-400'}`}>
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          {passwordValidation.hasLower ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          )}
        </svg>
        One lowercase letter
      </p>
      <p className={`flex items-center ${passwordValidation.hasUpper ? 'text-green-400' : 'text-gray-400'}`}>
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          {passwordValidation.hasUpper ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          )}
        </svg>
        One uppercase letter
      </p>
      <p className={`flex items-center ${passwordValidation.hasDigit ? 'text-green-400' : 'text-gray-400'}`}>
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          {passwordValidation.hasDigit ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          )}
        </svg>
        One number
      </p>
      <p className={`flex items-center ${passwordValidation.hasSpecial ? 'text-green-400' : 'text-gray-400'}`}>
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          {passwordValidation.hasSpecial ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          )}
        </svg>
        One special character
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join us today
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 
                placeholder-gray-500 text-white rounded-lg bg-gray-800/50 
                focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent
                focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 
                placeholder-gray-500 text-white rounded-lg bg-gray-800/50 
                focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent
                focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 
                placeholder-gray-500 text-white rounded-lg bg-gray-800/50 
                focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent
                focus:z-10 sm:text-sm pr-10"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                    className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                    className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            {renderPasswordRequirements()}

            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 
                placeholder-gray-500 text-white rounded-lg bg-gray-800/50 
                focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent
                focus:z-10 sm:text-sm pr-10"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                    className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                    className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid(passwordValidation)}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent 
              text-sm font-medium rounded-lg text-white 
              ${isLoading || !isPasswordValid(passwordValidation) ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
              transition-all duration-200 ease-in-out`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign up'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400 rounded-md">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSocialLogin(loginWithGoogle)}
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-gray-700 
              text-sm font-medium rounded-lg text-gray-300 bg-transparent 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
              transition-all duration-200 ease-in-out`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-600 group-hover:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              </span>
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login?auth=facebook')}
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-gray-700 
              text-sm font-medium rounded-lg text-gray-300 bg-transparent 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
              transition-all duration-200 ease-in-out`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-600 group-hover:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </span>
              {isLoading ? 'Connecting...' : 'Continue with Facebook'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-gray-400 hover:text-white">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 