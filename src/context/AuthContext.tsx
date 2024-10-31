import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, AuthResponse } from '../types/auth';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await axios.get<AuthResponse>(`${import.meta.env.VITE_API_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.token) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    setIsAuthenticated(true);
    setUser(data.user);
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
              const userResponse = await axios.post<AuthResponse>(
                `${import.meta.env.VITE_API_URL}/auth/google`,
                { token: response.access_token }
              );
              
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

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(`${import.meta.env.VITE_API_URL}/auth/register`, {
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
            const authResponse = await axios.post<AuthResponse>(
              `${import.meta.env.VITE_API_URL}/auth/facebook`,
              { token: response.authResponse.accessToken }
            );
            
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
      {children}
    </AuthContext.Provider>
  );
}; 