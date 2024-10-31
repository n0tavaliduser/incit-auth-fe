import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

interface DashboardProps {
  children?: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 fixed w-full z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Hamburger menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center ml-4">
                <span className="text-xl font-bold text-gray-900">Dashboard</span>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-600 focus:outline-none"
                >
                  <span className="hidden md:block">{user?.name}</span>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

// Add empty export to make it a module
export {}; 