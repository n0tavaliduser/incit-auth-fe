import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, AuthContextType, LoginResponse } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) throw new Error('Registration failed');

      const data = await response.json();
      setUser(data.user);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      setUser(data.user);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    window.location.href = 'http://localhost:3001/api/auth/google';
  }, []);

  const loginWithFacebook = useCallback(async () => {
    window.location.href = 'http://localhost:3001/api/auth/facebook';
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      register,
      login, 
      loginWithGoogle, 
      loginWithFacebook, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 