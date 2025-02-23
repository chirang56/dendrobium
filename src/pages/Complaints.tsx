import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  created_at: string;
}

export default function Complaints() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, [profile]);

  async function fetchComplaints() {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (loading) {
    return <div className="container mx-auto px-4 pt-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complaints</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Submit New Complaint
        </button>
      </div>

      <div className="grid gap-6">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {complaint.title}
              </h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{complaint.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Submitted on {new Date(complaint.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        {complaints.length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">No complaints found.</p>
        )}
      </div>
    </div>
  );
}