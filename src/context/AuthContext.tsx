import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { User, AuthResponse } from '../types/auth';
import api from '../utils/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('token');
      const savedUser = Cookies.get('user');

      if (token && savedUser) {
        try {
          // Set initial state from cookies
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Set axios default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Validate token with backend
          await validateToken();
        } catch (error) {
          console.error('Auth initialization error:', error);
          clearSession();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const validateToken = async () => {
    try {
      const response = await api.get<{ valid: boolean; user: User }>('/auth/validate');
      if (!response.data.valid) {
        clearSession();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      clearSession();
    }
  };

  const login = (data: AuthResponse) => {
    Cookies.set('token', data.token, { expires: 7, path: '/' });
    Cookies.set('user', JSON.stringify(data.user), { expires: 7, path: '/' });
    
    // Set token in axios headers
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const clearSession = () => {
    // Clear cookies
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    
    // Clear state
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear axios headers
    delete api.defaults.headers.common['Authorization'];
  };

  const logout = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        clearSession();
        return;
      }

      // Ensure token is in headers for logout request
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await api.post('/auth/logout', { userId: user?.id });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearSession();
    }
  };

  const loginWithGoogle = async () => {
    try {
      const auth2 = window.google?.accounts?.oauth2;
      if (!auth2) {
        throw new Error('Google OAuth not loaded');
      }

      const client = auth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response: any) => {
          if (response.access_token) {
            try {
              const userResponse = await api.post<AuthResponse>('/auth/google', { token: response.access_token });
              
              if (userResponse.data.token) {
                login(userResponse.data);
              }
            } catch (error) {
              console.error('Google login error:', error);
              throw error;
            }
          }
        },
      });

      client.requestAccessToken();
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password
      });
      
      if (response.data.token) {
        login(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    return new Promise<void>((resolve, reject) => {
      // Check if FB SDK is loaded
      if (typeof window.FB === 'undefined') {
        console.error('Facebook SDK not loaded');
        reject(new Error('Facebook SDK not loaded. Please try again.'));
        return;
      }

      window.FB.login(async (response) => {
        if (response.authResponse) {
          try {
            const authResponse = await api.post<AuthResponse>('/auth/facebook', { token: response.authResponse.accessToken });
            
            if (authResponse.data.token) {
              login(authResponse.data);
              resolve();
            } else {
              reject(new Error('Failed to get authentication token'));
            }
          } catch (error) {
            console.error('Facebook login error:', error);
            reject(error);
          }
        } else {
          reject(new Error('Facebook login cancelled'));
        }
      }, { scope: 'email,public_profile' });
    });
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      loginWithGoogle,
      loginWithFacebook,
      register
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}; 