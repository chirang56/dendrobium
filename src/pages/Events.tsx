import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
}

export default function Events() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
        {profile?.role === 'admin' && (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Add Event
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date: {new Date(event.event_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Location: {event.location}
              </p>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">No upcoming events.</p>
        )}
      </div>
    </div>
  );
}