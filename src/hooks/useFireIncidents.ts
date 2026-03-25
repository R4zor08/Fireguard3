import { useFireIncidentsRealTime } from './useFireIncidentsRealTime';

export function useFireIncidents() {
  const { incidents, activeIncidents, criticalIncidents, loading } = useFireIncidentsRealTime();

  return {
    incidents,
    activeIncidents,
    criticalIncidents,
    loading,
  };
}