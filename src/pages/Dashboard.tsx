import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Dashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {profile?.role === 'admin' ? 'Admin Dashboard' : 'Resident Dashboard'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/notices" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                View Latest Notices
              </a>
            </li>
            <li>
              <a href="/events" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Upcoming Events
              </a>
            </li>
            <li>
              <a href="/complaints" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Submit Complaint
              </a>
            </li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Add recent activity items here */}
            <p className="text-gray-600 dark:text-gray-300">No recent activity</p>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Summary</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Role: <span className="font-semibold">{profile?.role}</span>
            </p>
            {/* Add more profile information here */}
          </div>
        </div>
      </div>
    </div>
  );
}