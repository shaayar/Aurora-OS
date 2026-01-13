import { createContext, useCallback, useContext, useEffect, useMemo, useState, startTransition } from 'react';
import { useAppContext } from '@/components/AppContext';


export interface AppNotification {
  id: string;
  appId: string;
  owner: string; 
  title: string;
  message: string;
  createdAt: number; 
  data?: Record<string, unknown>; 
  unread: boolean;
}

interface AppNotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  push: (n: Omit<AppNotification, 'id' | 'createdAt' | 'unread'>) => AppNotification;
  markRead: (id: string) => void;
  remove: (id: string) => void;
  clearAll: () => void;
}

const AppNotificationsContext = createContext<AppNotificationsContextType | null>(null);

export function useAppNotifications() {
  const ctx = useContext(AppNotificationsContext);
  if (!ctx) throw new Error('useAppNotifications must be used within AppNotificationsProvider');
  return ctx;
}

function storageKeyFor(user: string) {
  return `aurora-app-notifications-${user}`;
}

export function AppNotificationsProvider({ children }: { children: React.ReactNode }) {
  const { activeUser } = useAppContext();
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const raw = localStorage.getItem(storageKeyFor(activeUser));
      if (!raw) return [];
      const parsed = JSON.parse(raw) as AppNotification[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKeyFor(activeUser));
      const parsed = raw ? (JSON.parse(raw) as AppNotification[]) : [];
      startTransition(() => {
        setNotifications(Array.isArray(parsed) ? parsed : []);
      });
    } catch {
      startTransition(() => {
        setNotifications([]);
      });
    }
  }, [activeUser]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKeyFor(activeUser), JSON.stringify(notifications));
    } catch {
      // Ignore storage errors
    }
  }, [notifications, activeUser]);

  // Listen for system-wide events
  useEffect(() => {
    const handleAppNotification = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      push({
        appId: detail.appId,
        owner: detail.owner,
        title: detail.title,
        message: detail.message,
        data: detail.data
      });
      // Also play sound for app notifications
      soundManager.play('success'); 
    };

    window.addEventListener('aurora-app-notification', handleAppNotification);
    return () => window.removeEventListener('aurora-app-notification', handleAppNotification);
  }, [push]);

  const push = useCallback<AppNotificationsContextType['push']>((n) => {
    const item: AppNotification = {
      id: `${n.appId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      appId: n.appId,
      owner: n.owner,
      title: n.title,
      message: n.message,
      createdAt: Date.now(),
      data: n.data,
      unread: true,
    };
    setNotifications((prev) => [item, ...prev].slice(0, 100)); 
    return item;
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const value = useMemo(
    () => ({ notifications, unreadCount, push, markRead, remove, clearAll }),
    [notifications, unreadCount, push, markRead, remove, clearAll]
  );

  return (
    <AppNotificationsContext.Provider value={value}>{children}</AppNotificationsContext.Provider>
  );
}
