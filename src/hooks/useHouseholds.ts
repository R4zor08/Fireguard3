import { useCallback, useEffect, useMemo, useState } from 'react';
import { householdsAPI } from '../services/api';
import {
  joinAlertsRoom,
  onHouseholdDelete,
  onHouseholdUpdate,
  onNewHousehold,
  unsubscribeAll,
} from '../services/socket';
import { Household } from '../types';
import { TANDAG_CENTER } from '../utils/mockData';

function deriveLatLng(id: string): { latitude: number; longitude: number } {
  const idNum = parseInt(String(id).replace(/\D/g, '')) || 1;
  return {
    latitude: TANDAG_CENTER.lat + (idNum * 0.002 - 0.005),
    longitude: TANDAG_CENTER.lng + (idNum * 0.003 - 0.005),
  };
}

function mapBackendHouseholdToType(h: any): Household {
  const derived = deriveLatLng(h.id);

  return {
    id: h.id,
    ownerName: h.ownerName,
    address: h.address,
    latitude: derived.latitude,
    longitude: derived.longitude,
    deviceCount: Array.isArray(h.devices) ? h.devices.length : 0,
    riskLevel: (h.riskLevel || 'low') as Household['riskLevel'],
    lastIncident: h.lastIncident ? new Date(h.lastIncident) : undefined,
    contactNumber: h.contactNumber,
    lastInspection: h.lastInspection ? new Date(h.lastInspection) : undefined,
    emergencyContact: h.emergencyContact ?? undefined,
    safetyScore: h.safetyScore ?? undefined,
    fireExtinguishers: h.fireExtinguishers ?? undefined,
    smokeDetectors: h.smokeDetectors ?? undefined,
  };
}

export function useHouseholds() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHouseholds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await householdsAPI.getAll();
      setHouseholds(result.data.map(mapBackendHouseholdToType));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch households');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHouseholds();
    joinAlertsRoom();

    onNewHousehold((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendHouseholdToType(raw);
      setHouseholds(prev => {
        if (prev.some(x => x.id === mapped.id)) return prev;
        return [mapped, ...prev];
      });
    });

    onHouseholdUpdate((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendHouseholdToType(raw);
      setHouseholds(prev => prev.map(x => (x.id === mapped.id ? mapped : x)));
    });

    onHouseholdDelete((payload: any) => {
      const id = payload?.data?.id ?? payload?.id;
      if (!id) return;
      setHouseholds(prev => prev.filter(x => x.id !== id));
    });

    return () => {
      unsubscribeAll();
    };
  }, [fetchHouseholds]);

  const stats = useMemo(() => {
    const total = households.length;
    const high = households.filter(h => h.riskLevel === 'high').length;
    const low = households.filter(h => h.riskLevel === 'low').length;
    const medium = households.filter(h => h.riskLevel === 'medium').length;
    const activeDevices = households.reduce((acc, h) => acc + (h.deviceCount || 0), 0);
    return { total, high, medium, low, activeDevices };
  }, [households]);

  return {
    households,
    stats,
    loading,
    error,
    fetchHouseholds,
  };
}
