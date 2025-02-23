import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface Finance {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  created_at: string;
}

export default function Finances() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchFinances();
    }
  }, [profile]);

  async function fetchFinances() {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFinances(data || []);
      
      // Calculate totals
      const income = data?.reduce((sum, item) => 
        item.type === 'income' ? sum + item.amount : sum, 0) || 0;
      const expense = data?.reduce((sum, item) => 
        item.type === 'expense' ? sum + item.amount : sum, 0) || 0;
      
      setTotalIncome(income);
      setTotalExpense(expense);
    } catch (error) {
      console.error('Error fetching finances:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finances</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Balance</h2>
          <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            NPR {(totalIncome - totalExpense).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Income</h2>
          <p className="text-2xl font-bold text-green-600">
            NPR {totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Expenses</h2>
          <p className="text-2xl font-bold text-red-600">
            NPR {totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {finances.map((finance) => (
              <tr key={finance.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {new Date(finance.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {finance.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                  {finance.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={finance.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    NPR {finance.amount.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {finances.length === 0 && (
          <p className="text-center py-4 text-gray-600 dark:text-gray-300">No transactions found.</p>
        )}
      </div>
    </div>
  );
}