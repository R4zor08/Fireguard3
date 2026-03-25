import { useState, useEffect, useCallback } from 'react';
import { alertsAPI } from '../services/api';
import { onNewAlert, onCriticalAlert, onAlertUpdate, onAlertDelete, joinAlertsRoom, unsubscribeAll } from '../services/socket';
import { Alert as AlertType } from '../types';

// Map backend alert to frontend Alert type
function mapAlertToType(alert: any): AlertType {
  const severityMap: Record<string, AlertType['severity']> = {
    'ALERT': 'critical',
    'WARNING': 'high',
    'SAFE': 'low',
  };
  
  const typeMap: Record<string, AlertType['type']> = {
    'ALERT': 'fire',
    'WARNING': 'smoke',
    'SAFE': 'info',
  };
  
  return {
    id: alert.id,
    deviceId: alert.deviceId,
    type: typeMap[alert.status] || 'fire',
    severity: severityMap[alert.status] || 'medium',
    message: alert.notes || `Alert from ${alert.deviceId}`,
    timestamp: new Date(alert.timestamp || alert.createdAt),
    acknowledged: false,
    temperature: alert.temperature,
    smokeLevel: alert.smokeLevel,
    status: alert.status,
    location: alert.location,
    notes: alert.notes,
    createdAt: alert.createdAt,
    updatedAt: alert.updatedAt,
    userId: alert.userId,
    user: alert.user,
  };
}

export interface AlertStats {
  total: number;
  safe: number;
  warning: number;
  alert: number;
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [stats, setStats] = useState<AlertStats>({ total: 0, safe: 0, warning: 0, alert: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch alerts
  const fetchAlerts = useCallback(async (page = 1, limit = 10, filters?: { status?: string; deviceId?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await alertsAPI.getAll({ page, limit, ...filters });
      const mappedAlerts = result.data.map(mapAlertToType);
      setAlerts(mappedAlerts);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const result = await alertsAPI.getStats();
      setStats(result.data);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Create alert
  const createAlert = async (data: {
    deviceId: string;
    temperature: number;
    smokeLevel: number;
    status: string;
    location?: string;
    notes?: string;
  }) => {
    try {
      const result = await alertsAPI.create(data);
      await fetchAlerts(pagination.page, pagination.limit);
      await fetchStats();
      return { success: true, data: result.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Update alert
  const updateAlert = async (id: string, data: Partial<AlertType>) => {
    try {
      const result = await alertsAPI.update(id, data);
      await fetchAlerts(pagination.page, pagination.limit);
      return { success: true, data: result.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Delete alert
  const deleteAlert = async (id: string) => {
    try {
      await alertsAPI.delete(id);
      await fetchAlerts(pagination.page, pagination.limit);
      await fetchStats();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Acknowledge alert (local state only)
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => alert.id === alertId ? {
      ...alert,
      acknowledged: true
    } : alert));
  };

  // Initial fetch
  useEffect(() => {
    fetchAlerts();
    fetchStats();
    joinAlertsRoom();

    // Real-time listeners
    onNewAlert((newAlert: any) => {
      const mapped = mapAlertToType(newAlert);
      setAlerts(prev => [mapped, ...prev]);
      fetchStats();
    });

    onCriticalAlert((alert: any) => {
      console.log('CRITICAL ALERT:', alert);
    });

    onAlertUpdate((updatedAlert: any) => {
      const mapped = mapAlertToType(updatedAlert);
      setAlerts(prev => prev.map(a => a.id === mapped.id ? mapped : a));
    });

    onAlertDelete((data: { id: string }) => {
      setAlerts(prev => prev.filter(a => a.id !== data.id));
      fetchStats();
    });

    return () => {
      unsubscribeAll();
    };
  }, [fetchAlerts, fetchStats]);

  return {
    alerts,
    stats,
    loading,
    error,
    pagination,
    fetchAlerts,
    fetchStats,
    createAlert,
    updateAlert,
    deleteAlert,
    acknowledgeAlert,
  };
}