import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'pagi';
    if (hour < 15) return 'siang';
    if (hour < 18) return 'sore';
    return 'malam';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Hai {user?.name}, selamat {getGreeting()}
        </h1>
        <p className="text-gray-600">
          {new Date().toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta'
          })}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Stats</h3>
            <p className="text-gray-600">View your activity summary</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-gray-600">Check your latest actions</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
            <p className="text-gray-600">Stay updated with alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
} 