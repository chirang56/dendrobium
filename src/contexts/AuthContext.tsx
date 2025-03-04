import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Define profile structure
interface Profile {
  id: string;
  full_name: string | null;
  role: 'resident' | 'admin';
}

// Define context structure
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    fetchSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from database
  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } 
    catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching profile:', error.message);
      } else {
        console.error('Error fetching profile:', error);
      }
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error: { message: 'Invalid email or password. Please try again.' } };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: 'An unexpected error occurred. Please try again.' } };
    }
  };

  // Signup function with profile creation
  const signup = async (email: string, password: string) => {
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

      if (signUpError) {
        return { error: { message: signUpError.message } };
      }

      if (signUpData.user) {
        // Create profile with default role 'resident'
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: signUpData.user.id, full_name: null, role: 'resident' }]);

        if (profileError) {
          console.error('Profile creation failed:', profileError);
          return { error: { message: 'Signup successful, but profile creation failed.' } };
        }

        // Auto-login the user
        setUser(signUpData.user);
        await fetchProfile(signUpData.user.id);

        return { error: null };
      }

      return { error: { message: 'Signup failed. Please try again.' } };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: { message: 'An unexpected error occurred. Please try again later.' } };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
