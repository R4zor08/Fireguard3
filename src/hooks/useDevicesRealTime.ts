import { useCallback, useEffect, useMemo, useState } from 'react';
import { devicesAPI } from '../services/api';
import {
  joinAlertsRoom,
  onDeviceDelete,
  onDeviceUpdate,
  onNewDevice,
  unsubscribeAll,
} from '../services/socket';
import { Device } from '../types';

function mapBackendDeviceToDevice(device: any): Device {
  const lat = typeof device.latitude === 'number' ? device.latitude : 0;
  const lng = typeof device.longitude === 'number' ? device.longitude : 0;

  const lastReading = {
    smoke: 0,
    temperature: 0,
    gas: 0,
    timestamp: new Date(device.updatedAt || Date.now()),
  };

  const isOnline = Boolean(device.isOnline);
  const status = (device.status || (isOnline ? 'normal' : 'offline')) as Device['status'];

  return {
    id: device.id,
    status,
    ownerName: device.ownerName || device.user?.name || device.name || 'Unknown',
    address: device.address || device.household?.address || 'Unknown',
    latitude: lat,
    longitude: lng,
    lastReading,
    isOnline,
    batteryLevel: device.batteryLevel ?? undefined,
    signalStrength: device.signalStrength ?? undefined,
    firmwareVersion: device.firmwareVersion ?? undefined,
  };
}

export function useDevicesRealTime() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await devicesAPI.getAll();
      setDevices(result.data.map(mapBackendDeviceToDevice));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    joinAlertsRoom();

    onNewDevice((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendDeviceToDevice(raw);
      setDevices(prev => {
        if (prev.some(d => d.id === mapped.id)) return prev;
        return [mapped, ...prev];
      });
    });

    onDeviceUpdate((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendDeviceToDevice(raw);
      setDevices(prev => prev.map(d => (d.id === mapped.id ? mapped : d)));
    });

    onDeviceDelete((payload: any) => {
      const id = payload?.data?.id ?? payload?.id;
      if (!id) return;
      setDevices(prev => prev.filter(d => d.id !== id));
    });

    return () => {
      unsubscribeAll();
    };
  }, [fetchDevices]);

  const onlineCount = useMemo(() => devices.filter(d => d.isOnline).length, [devices]);

  return {
    devices,
    onlineCount,
    loading,
    error,
    fetchDevices,
  };
}
