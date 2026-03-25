import { useCallback, useEffect, useMemo, useState } from 'react';
import { networkAPI } from '../services/api';
import {
  joinAlertsRoom,
  onNewNetworkEvent,
  onNetworkEventDelete,
  onNetworkNodeDelete,
  onNetworkNodeUpdate,
  onNewNetworkNode,
  unsubscribeAll,
} from '../services/socket';
import { NetworkNode } from '../types';

function mapBackendNodeToType(n: any): NetworkNode {
  return {
    id: n.id,
    type: (n.type || 'iot') as NetworkNode['type'],
    status: (n.status || 'online') as NetworkNode['status'],
    name: n.name,
    latency: n.latency ?? undefined,
    connectedTo: undefined,
  };
}

export interface NetworkEvent {
  id: string;
  timestamp: string;
  type: string;
  details: string;
  status: string;
  nodeId: string;
}

function mapBackendEventToType(e: any): NetworkEvent {
  return {
    id: e.id,
    timestamp: new Date(e.timestamp || Date.now()).toISOString(),
    type: e.type,
    details: e.details,
    status: e.status,
    nodeId: e.nodeId,
  };
}

export function useNetworkConnectivity() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetwork = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [nodesRes, eventsRes] = await Promise.all([
        networkAPI.getNodes(),
        networkAPI.getEvents(),
      ]);
      setNodes(nodesRes.data.map(mapBackendNodeToType));
      setEvents(eventsRes.data.map(mapBackendEventToType));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch network');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetwork();
    joinAlertsRoom();

    onNewNetworkNode((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendNodeToType(raw);
      setNodes(prev => {
        if (prev.some(x => x.id === mapped.id)) return prev;
        return [mapped, ...prev];
      });
    });

    onNetworkNodeUpdate((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendNodeToType(raw);
      setNodes(prev => prev.map(x => (x.id === mapped.id ? mapped : x)));
    });

    onNetworkNodeDelete((payload: any) => {
      const id = payload?.data?.id ?? payload?.id;
      if (!id) return;
      setNodes(prev => prev.filter(x => x.id !== id));
    });

    onNewNetworkEvent((payload: any) => {
      const raw = payload?.data ?? payload;
      const mapped = mapBackendEventToType(raw);
      setEvents(prev => {
        if (prev.some(x => x.id === mapped.id)) return prev;
        return [mapped, ...prev];
      });
    });

    onNetworkEventDelete((payload: any) => {
      const id = payload?.data?.id ?? payload?.id;
      if (!id) return;
      setEvents(prev => prev.filter(x => x.id !== id));
    });

    return () => {
      unsubscribeAll();
    };
  }, [fetchNetwork]);

  const onlineCount = useMemo(() => nodes.filter(n => n.status === 'online').length, [nodes]);

  return {
    nodes,
    events,
    onlineCount,
    loading,
    error,
    fetchNetwork,
  };
}
