import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string | null;
  role: 'resident' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as Profile);
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: { message: 'Invalid email or password. Please try again.' } };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      // First check if user exists
      const { data: { user: existingUser } } = await supabase.auth.admin.getUserByEmail(email);

      if (existingUser) {
        return { error: { message: 'An account with this email already exists. Please login instead.' } };
      }

      // If user doesn't exist, proceed with signup
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!signUpError && signUpData.user) {
        // Create profile with default role 'resident'
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: signUpData.user.id,
              role: 'resident',
            },
          ])
          .select()
          .single();

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return { error: profileError };
        }

        return { error: null };
      }

      return { error: signUpError };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: { message: 'An error occurred during signup. Please try again.' } };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}