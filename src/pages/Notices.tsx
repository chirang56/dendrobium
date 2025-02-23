import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Notices() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 pt-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notices</h1>
        {profile?.role === 'admin' && (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Add Notice
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {notice.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{notice.content}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posted on {new Date(notice.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        {notices.length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">No notices available.</p>
        )}
      </div>
    </div>
  );
}