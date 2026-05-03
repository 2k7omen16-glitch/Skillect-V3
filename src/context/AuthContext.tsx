import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

type UserData = {
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin' | 'alumni';
  branch?: string;
  year?: string;
  goal?: string;
  age?: string;
  photo_url?: string;
  readiness_score?: number;
  profile_complete?: boolean;
  skills_mastered?: number;
  total_skills?: number;
};

type Notification = {
  id: number;
  title: string;
  desc: string;
  type: 'success' | 'warning' | 'info';
  time: string;
  link?: string;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  notifications: Notification[];
  setDemoUser: (data: UserData) => void;
  updateUserData: (data: Partial<UserData>) => void;
  logoutDemo: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'time'>) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  notifications: [],
  setDemoUser: () => {},
  updateUserData: () => {},
  logoutDemo: () => {},
  addNotification: () => {},
  removeNotification: () => {},
  clearNotifications: () => {},
});

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Assessment Complete', desc: 'Your SQL fundamentals score is ready.', type: 'success', time: '2m ago', link: '/student/assessment' },
  { id: 2, title: 'New Mentor Match', desc: 'Dr. Sharma is available for consultation.', type: 'info', time: '1h ago', link: '/student/mentor-match' },
  { id: 3, title: 'Roadmap Update', desc: 'New resources added to your AI path.', type: 'warning', time: '3h ago', link: '/student/roadmap' },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const addNotification = (n: Omit<Notification, 'id' | 'time'>) => {
    const newN: Notification = {
      ...n,
      id: Date.now(),
      time: 'Just now'
    };
    setNotifications(prev => [newN, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const setDemoUser = (data: UserData) => {
    setUser({ id: 'demo-123', email: data.email } as User);
    setUserData(data);
    localStorage.setItem('skillect_user', JSON.stringify(data));
  };

  const updateUserData = (data: Partial<UserData>) => {
    const current = userData || JSON.parse(localStorage.getItem('skillect_user') || '{}');
    const updated = { ...current, ...data };
    setUserData(updated as UserData);
    localStorage.setItem('skillect_user', JSON.stringify(updated));
  };

  const logoutDemo = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('skillect_user');
  };

  useEffect(() => {
    // Check for stored demo user first
    const stored = localStorage.getItem('skillect_user');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUser({ id: 'demo-123', email: data.email } as User);
        setUserData(data);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem('skillect_user');
      }
    }

    // Try real Supabase auth
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const isDummyOrMissing = !supabaseUrl || supabaseUrl === 'https://your-project.supabase.co';

    if (isDummyOrMissing) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (!error && data) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, userData, loading, notifications, 
      setDemoUser, updateUserData, logoutDemo,
      addNotification, removeNotification, clearNotifications
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
