import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthResponse } from '../types/auth';
import { useFacebookSDK } from '../utils/FacebookSDK';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Initialize Facebook SDK
  useFacebookSDK();

  useEffect(() => {
    // Check if redirected from register with facebook login trigger
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'facebook') {
      handleFacebookLogin();
      // Clean up URL
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
        provider,
      });
      
      if (response.data.token) {
        login(response.data);  // Pass the entire response
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid email or password');
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

  const handleFacebookLogin = () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (!window.FB) {
        throw new Error('Facebook SDK not loaded');
      }

      window.FB.login(function(response) {
        if (response.authResponse) {
          handleFacebookResponse(response.authResponse.accessToken);
        } else {
          setError('Facebook login cancelled');
          setIsLoading(false);
        }
      }, { scope: 'email,public_profile' });

    } catch (err) {
      console.error('Facebook auth error:', err);
      setError('Facebook login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFacebookResponse = async (accessToken: string) => {
    try {
      const authResponse = await api.post<AuthResponse>('/auth/facebook', {
        token: accessToken
      });
      
      if (authResponse.data.token) {
        login(authResponse.data);  // Pass the entire response
        navigate('/');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      setError('Facebook login failed. Please try again.');
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{' '}
            <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300">
              create a new account
            </Link>
          </p>
        </div>
        
        {error && (
          <div 
            className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg 
                       shadow-sm backdrop-blur-lg mb-6 relative"
            role="alert"
          >
            <div className="flex items-center">
              <svg 
                className="w-5 h-5 mr-2" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="block sm:inline font-medium">{error}</span>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 
                border border-gray-700 rounded-lg bg-gray-800 text-white 
                placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-purple-500/50 focus:border-purple-500/50 
                focus:z-10 sm:text-sm transition-all duration-200"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              onClick={() => setProvider('local')}
              className="group relative w-full flex justify-center py-2 px-4 
              border border-transparent text-sm font-medium rounded-lg 
              text-white bg-purple-600 hover:bg-purple-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-purple-500 transition-all duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-600 group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {isLoading ? 'Signing in...' : 'Sign in'}
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
              disabled={isLoading}
              onClick={() => handleSocialLogin(loginWithGoogle)}
              className={`group relative w-full flex justify-center py-3 px-4 border border-gray-700 
              text-sm font-medium rounded-lg text-gray-300 bg-transparent 
              ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-800'} 
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
              onClick={handleFacebookLogin}
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
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-gray-400 hover:text-white">
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 