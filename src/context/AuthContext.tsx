import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured, supabase } from '@/utils/supabase';

const GUEST_MODE_KEY = '@habit_pulse_guest_mode_v1';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, pass: string) => Promise<{ error: Error | null; user: User | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    async function initAuth() {
      try {
        if (!isConfigured) {
          setIsGuest(true);
          setLoading(false);
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          setIsGuest(false);
        } else {
          const guestSaved = await AsyncStorage.getItem(GUEST_MODE_KEY);
          setIsGuest(guestSaved !== 'false');
        }

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setIsGuest(!newSession);
            if (newSession) {
              await AsyncStorage.setItem(GUEST_MODE_KEY, 'false');
            }
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (e) {
        console.error('Error initializing auth:', e);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [isConfigured]);

  const signInWithEmail = async (email: string, pass: string) => {
    if (!isConfigured) {
      return {
        error: new Error(
          'Supabase credentials missing. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
        ),
      };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });
      if (error) return { error };
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsGuest(false);
        await AsyncStorage.setItem(GUEST_MODE_KEY, 'false');
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!isConfigured) {
      return {
        error: new Error(
          'Supabase credentials missing. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
        ),
        user: null,
      };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pass,
      });
      if (error) return { error, user: null };
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsGuest(!data.session);
        if (data.session) {
          await AsyncStorage.setItem(GUEST_MODE_KEY, 'false');
        }
      }
      return { error: null, user: data.user };
    } catch (err: any) {
      return { error: err, user: null };
    }
  };

  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      return {
        error: new Error('Supabase credentials missing in .env file.'),
      };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setIsGuest(true);
    await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
  };

  const continueAsGuest = async () => {
    setIsGuest(true);
    await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isGuest,
        isConfigured,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
        continueAsGuest,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
