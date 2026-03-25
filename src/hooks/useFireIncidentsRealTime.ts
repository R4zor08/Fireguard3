import { useCallback, useEffect, useMemo, useState } from 'react';
import { fireIncidentsAPI } from '../services/api';
import {
  joinAlertsRoom,
  onFireIncidentDelete,
  onFireIncidentUpdate,
  onNewFireIncident,
  unsubscribeAll,
} from '../services/socket';
import { FireIncident } from '../types';

function mapBackendIncidentToType(i: any): FireIncident {
  return {
    id: i.id,
    deviceId: undefined,
    type: 'active_fire',
    severity: (i.severity || 'low') as FireIncident['severity'],
    latitude: i.latitude,
    longitude: i.longitude,
    address: '',
    detectedAt: new Date(i.startedAt || Date.now()),
    resolvedAt: i.endedAt ? new Date(i.endedAt) : undefined,
    affectedHouseholds: 0,
    responseUnits: undefined,
    estimatedDamage: undefined,
    status: (i.status || 'active') as FireIncident['status'],
    description: i.title,
  };
}

export function useFireIncidentsRealTime() {
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fireIncidentsAPI.getAll();
      setIncidents(result.data.map(mapBackendIncidentToType));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch fire incidents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    joinAlertsRoom();

    onNewFireIncident((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendIncidentToType(raw);
      setIncidents(prev => {
        if (prev.some(x => x.id === mapped.id)) return prev;
        return [mapped, ...prev];
      });
    });

    onFireIncidentUpdate((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendIncidentToType(raw);
      setIncidents(prev => prev.map(x => (x.id === mapped.id ? mapped : x)));
    });

    onFireIncidentDelete((payload: any) => {
      const id = payload?.data?.id ?? payload?.id;
      if (!id) return;
      setIncidents(prev => prev.filter(x => x.id !== id));
    });

    return () => {
      unsubscribeAll();
    };
  }, [fetchIncidents]);

  const activeIncidents = useMemo(() => incidents.filter(i => i.status !== 'resolved'), [incidents]);
  const criticalIncidents = useMemo(
    () => incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved'),
    [incidents]
  );

  return {
    incidents,
    activeIncidents,
    criticalIncidents,
    loading,
    error,
    fetchIncidents,
  };
}
