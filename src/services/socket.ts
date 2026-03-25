import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket: Socket | null = null;

// Initialize socket connection
export function initSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    socket.on('connect_error', (error: Error) => {
      console.error('[Socket] Connection error:', error);
    });
  }

  return socket;
}

// Join alerts room for real-time updates
export function joinAlertsRoom(): void {
  const socket = initSocket();
  socket.emit('join', 'alerts');
}

// Leave alerts room
export function leaveAlertsRoom(): void {
  if (socket) {
    socket.emit('leave', 'alerts');
  }
}

// Subscribe to new alerts
export function onNewAlert(callback: (alert: any) => void): void {
  const socket = initSocket();
  socket.on('alert:new', callback);
}

// Subscribe to critical alerts
export function onCriticalAlert(callback: (alert: any) => void): void {
  const socket = initSocket();
  socket.on('alert:critical', callback);
}

// Subscribe to alert updates
export function onAlertUpdate(callback: (alert: any) => void): void {
  const socket = initSocket();
  socket.on('alert:update', callback);
}

// Subscribe to alert deletions
export function onAlertDelete(callback: (data: { id: string }) => void): void {
  const socket = initSocket();
  socket.on('alert:delete', callback);
}

// Unsubscribe from all alert events
export function unsubscribeAll(): void {
  if (socket) {
    socket.off('alert:new');
    socket.off('alert:critical');
    socket.off('alert:update');
    socket.off('alert:delete');
    socket.off('contact:new');
    socket.off('contact:update');
    socket.off('contact:delete');
    socket.off('device:new');
    socket.off('device:update');
    socket.off('device:delete');
    socket.off('household:new');
    socket.off('household:update');
    socket.off('household:delete');
    socket.off('notification:new');
    socket.off('notification:update');
    socket.off('notification:delete');
    socket.off('network:node:new');
    socket.off('network:node:update');
    socket.off('network:node:delete');
    socket.off('network:event:new');
    socket.off('network:event:delete');
    socket.off('fireIncident:new');
    socket.off('fireIncident:update');
    socket.off('fireIncident:delete');
  }
}

// Contact event handlers
export function onNewContact(callback: (contact: any) => void): void {
  const socket = initSocket();
  socket.on('contact:new', callback);
}

export function onContactUpdate(callback: (contact: any) => void): void {
  const socket = initSocket();
  socket.on('contact:update', callback);
}

export function onContactDelete(callback: (data: { id: string }) => void): void {
  const socket = initSocket();
  socket.on('contact:delete', callback);
}

// Device event handlers
export function onNewDevice(callback: (device: any) => void): void {
  const socket = initSocket();
  socket.on('device:new', callback);
}

export function onDeviceUpdate(callback: (device: any) => void): void {
  const socket = initSocket();
  socket.on('device:update', callback);
}

export function onDeviceDelete(callback: (data: { id: string }) => void): void {
  const socket = initSocket();
  socket.on('device:delete', callback);
}

// Household event handlers
export function onNewHousehold(callback: (household: any) => void): void {
  const socket = initSocket();
  socket.on('household:new', callback);
}

export function onHouseholdUpdate(callback: (household: any) => void): void {
  const socket = initSocket();
  socket.on('household:update', callback);
}

export function onHouseholdDelete(callback: (data: { id: string }) => void): void {
  const socket = initSocket();
  socket.on('household:delete', callback);
}

// Notification event handlers
export function onNewNotification(callback: (notification: any) => void): void {
  const socket = initSocket();
  socket.on('notification:new', callback);
}

export function onNotificationUpdate(callback: (notification: any) => void): void {
  const socket = initSocket();
  socket.on('notification:update', callback);
}

export function onNotificationDelete(callback: (data: { id: string }) => void): void {
  const socket = initSocket();
  socket.on('notification:delete', callback);
}

// Network event handlers
export function onNewNetworkNode(callback: (node: any) => void): void {
  const socket = initSocket();
  socket.on('network:node:new', callback);
}

export function onNetworkNodeUpdate(callback: (node: any) => void): void {
  const socket = initSocket();
  socket.on('network:node:update', callback);
}

export function onNetworkNodeDelete(callback: (data: { id: string }) => void): void {
  const socket = initSocket();
  socket.on('network:node:delete', callback);
}

export function onNewNetworkEvent(callback: (event: any) => void): void {
  const socket = initSocket();
  socket.on('network:event:new', callback);
}

export function onNetworkEventDelete(callback: (data: { id: string }) => void): void {
  const socket = initSocket();
  socket.on('network:event:delete', callback);
}

// Fire incident event handlers
export function onNewFireIncident(callback: (incident: any) => void): void {
  const socket = initSocket();
  socket.on('fireIncident:new', callback);
}

export function onFireIncidentUpdate(callback: (incident: any) => void): void {
  const socket = initSocket();
  socket.on('fireIncident:update', callback);
}

export function onFireIncidentDelete(callback: (data: { id: string }) => void): void {
  const socket = initSocket();
  socket.on('fireIncident:delete', callback);
}

// Disconnect socket
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Get socket instance
export function getSocket(): Socket | null {
  return socket;
}

export default {
  initSocket,
  joinAlertsRoom,
  leaveAlertsRoom,
  onNewAlert,
  onCriticalAlert,
  onAlertUpdate,
  onAlertDelete,
  onNewContact,
  onContactUpdate,
  onContactDelete,
  onNewDevice,
  onDeviceUpdate,
  onDeviceDelete,
  onNewHousehold,
  onHouseholdUpdate,
  onHouseholdDelete,
  onNewNotification,
  onNotificationUpdate,
  onNotificationDelete,
  onNewNetworkNode,
  onNetworkNodeUpdate,
  onNetworkNodeDelete,
  onNewNetworkEvent,
  onNetworkEventDelete,
  onNewFireIncident,
  onFireIncidentUpdate,
  onFireIncidentDelete,
  unsubscribeAll,
  disconnectSocket,
  getSocket,
};
