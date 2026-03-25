import { useDevicesRealTime } from './useDevicesRealTime';

export function useDevices() {
  const { devices, loading } = useDevicesRealTime();

  return {
    devices,
    loading,
  };
}