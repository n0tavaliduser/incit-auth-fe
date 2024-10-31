import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (token: string) => void;
  logout: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<ApiResponse>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: (token: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<ApiResponse>;
}

interface ApiResponse {
  valid?: boolean;
  user?: any;
  token?: string;
  error?: string;
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_API_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.valid) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const loginWithCredentials = async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password
      });
      if (response.data.token) {
        login(response.data.token);
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
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
              const userResponse = await axios.post<ApiResponse>(
                `${import.meta.env.VITE_API_URL}/auth/google`,
                { token: response.access_token }
              );
              
              if (userResponse.data.token) {
                login(userResponse.data.token);
                setUser(userResponse.data.user);
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

  const loginWithFacebook = async (token: string) => {
    try {
      const response = await axios.post<ApiResponse>(`${import.meta.env.VITE_API_URL}/auth/facebook`, {
        token
      });
      if (response.data.token) {
        login(response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = async (name: string, email: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password
      });
      if (response.data.token) {
        login(response.data.token);
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      loginWithCredentials,
      loginWithGoogle,
      loginWithFacebook,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 