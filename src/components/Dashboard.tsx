import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmailVerification from './EmailVerification';

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Only fetch dashboard data if user is verified or using OAuth
        if (user && (user.email_verified || user.oauth_provider)) {
          const response = await fetch('http://localhost:3001/api/dashboard', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
          }

          const data = await response.json();
          setDashboardData(data);
        }
      } catch (err) {
        setError('Error loading dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Error logging out');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Show email verification screen if needed
  if (user && !user.email_verified && !user.oauth_provider) {
    return <EmailVerification />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Show dashboard content
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
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
            transition-colors duration-200 focus:outline-none focus:ring-2 
            focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Logout
          </button>
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