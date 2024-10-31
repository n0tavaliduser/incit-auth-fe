import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface DashboardData {
  name: string;
  greeting: string;
  timestamp: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get<DashboardData>('/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        setError('Error loading dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Error logging out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex-1">
            {dashboardData && (
              <>
                <h1 className="text-3xl font-bold text-white">
                  Hai {dashboardData.name}, selamat {dashboardData.greeting}
                </h1>
                <p className="mt-2 text-gray-400">
                  {new Date(dashboardData.timestamp).toLocaleString('id-ID', {
                    timeZone: 'Asia/Jakarta'
                  })}
                </p>
              </>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg 
              hover:bg-gray-700/50 transition-all duration-200 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-gray-500"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">{user?.name}</span>
                <span className="text-xs text-gray-400">{user?.email}</span>
              </div>
              <svg
                className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 
                ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 
              bg-gray-800/90 backdrop-blur-sm ring-1 ring-black ring-opacity-5 focus:outline-none 
              divide-y divide-gray-700">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className="group flex items-center w-full px-4 py-2 text-sm text-gray-300 
                    hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                    }}
                    className="group flex items-center w-full px-4 py-2 text-sm text-gray-300 
                    hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Change Password
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="group flex items-center w-full px-4 py-2 text-sm text-red-400 
                    hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <svg className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-300" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded relative mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

// Add empty export to make it a module
export {}; 