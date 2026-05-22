// app/providers.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useInitCart } from '@/hooks/useInitCart';
import type { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';

type AppContextType = {
  user: User | null;
  unreadCount: number;
  isHydrated: boolean;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
  refetchAlerts: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // فقط یکبار در کل اپ
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userRes, alertsRes] = await Promise.all([
          fetch(`${API_URL}/user/me`, { credentials: 'include' }),
          fetch(`${API_URL}/alerts`, { credentials: 'include' }),
        ]);
        
        if (userRes.ok) {
          const data = await userRes.json();
          setUser(data.user);
        }
        if (alertsRes.ok) {
          const data = await alertsRes.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch initial data', error);
      } finally {
        setIsHydrated(true);
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // همگام‌سازی سبد خرید (فقط یکبار)
  useInitCart({ isLoggedIn: !!user, isLoading });

  const refetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/user/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to refetch user', error);
    }
  };

  const refetchAlerts = async () => {
    try {
      const res = await fetch(`${API_URL}/alerts`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to refetch alerts', error);
    }
  };

  return (
    <AppContext.Provider value={{ user, unreadCount, isHydrated, isLoading, refetchUser, refetchAlerts }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};