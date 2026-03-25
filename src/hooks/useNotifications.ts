import { useCallback, useEffect, useMemo, useState } from 'react';
import { notificationsAPI } from '../services/api';
import {
  joinAlertsRoom,
  onNewNotification,
  onNotificationDelete,
  onNotificationUpdate,
  unsubscribeAll,
} from '../services/socket';
import { Notification } from '../types';

function mapBackendNotificationToType(n: any): Notification {
  return {
    id: n.id,
    type: (n.type || 'info') as Notification['type'],
    title: n.title,
    message: n.message,
    timestamp: new Date(n.createdAt || Date.now()),
    read: Boolean(n.read),
    priority: (n.priority || 'low') as Notification['priority'],
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await notificationsAPI.getAll();
      setNotifications(result.data.map(mapBackendNotificationToType));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    joinAlertsRoom();

    onNewNotification((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendNotificationToType(raw);
      setNotifications(prev => {
        if (prev.some(x => x.id === mapped.id)) return prev;
        return [mapped, ...prev];
      });
    });

    onNotificationUpdate((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendNotificationToType(raw);
      setNotifications(prev => prev.map(x => (x.id === mapped.id ? mapped : x)));
    });

    onNotificationDelete((payload: any) => {
      const id = payload?.data?.id ?? payload?.id;
      if (!id) return;
      setNotifications(prev => prev.filter(x => x.id !== id));
    });

    return () => {
      unsubscribeAll();
    };
  }, [fetchNotifications]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
  };
}
