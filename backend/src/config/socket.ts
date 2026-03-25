import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

// Alert status type (String for SQLite)
type AlertStatus = 'SAFE' | 'WARNING' | 'ALERT';

// Socket event types
export interface AlertPayload {
  id: string;
  deviceId: string;
  temperature: number;
  smokeLevel: number;
  status: AlertStatus;
  location?: string;
  notes?: string;
  timestamp: Date;
}

export interface ContactPayload {
  id: string;
  name: string;
  number: string;
  type: string;
  role?: string | null;
  userId: string;
}

export interface DevicePayload {
  id: string;
  name?: string | null;
  ownerName?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
  isOnline: boolean;
  batteryLevel?: number | null;
  signalStrength?: number | null;
  firmwareVersion?: string | null;
  lastSeen?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  householdId?: string | null;
  userId?: string | null;
}

export interface HouseholdPayload {
  id: string;
  householdCode: string;
  ownerName: string;
  address: string;
  contactNumber: string;
  emergencyContact?: string | null;
  riskLevel: string;
  lastIncident?: Date | null;
  lastInspection?: Date | null;
  safetyScore?: number | null;
  fireExtinguishers?: number | null;
  smokeDetectors?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  read: boolean;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NetworkNodePayload {
  id: string;
  type: string;
  name: string;
  status: string;
  latency?: number | null;
  connections: number;
  signalStrength?: number | null;
  lastSeen?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NetworkEventPayload {
  id: string;
  timestamp: Date;
  type: string;
  details: string;
  status: string;
  nodeId: string;
}

export interface FireIncidentPayload {
  id: string;
  title: string;
  severity: string;
  status: string;
  latitude: number;
  longitude: number;
  startedAt: Date;
  endedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SocketEvents {
  connection: (socket: Socket) => void;
  disconnect: () => void;
}

// Store connected clients
const connectedClients = new Map<string, Socket>();

// Initialize Socket.io server
export const initSocketIO = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);
    connectedClients.set(socket.id, socket);

    // Join alert room for real-time updates
    socket.join('alerts');

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      connectedClients.delete(socket.id);
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to FireGuard3 real-time alerts',
      socketId: socket.id,
    });
  });

  return io;
};

// Broadcast new alert to all connected clients
export const broadcastNewAlert = (io: SocketIOServer, alert: AlertPayload) => {
  io.to('alerts').emit('alert:new', {
    type: 'NEW_ALERT',
    data: alert,
    timestamp: new Date().toISOString(),
  });

  // If it's a critical alert, send additional notification
  if (alert.status === 'ALERT') {
    io.to('alerts').emit('alert:critical', {
      type: 'CRITICAL_ALERT',
      data: alert,
      message: 'Fire detected! Immediate action required.',
      timestamp: new Date().toISOString(),
    });
  }
};

// Broadcast alert update
export const broadcastAlertUpdate = (io: SocketIOServer, alert: AlertPayload) => {
  io.to('alerts').emit('alert:update', {
    type: 'ALERT_UPDATED',
    data: alert,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast alert deletion
export const broadcastAlertDeletion = (io: SocketIOServer, alertId: string) => {
  io.to('alerts').emit('alert:delete', {
    type: 'ALERT_DELETED',
    data: { id: alertId },
    timestamp: new Date().toISOString(),
  });
};

// Broadcast new contact
export const broadcastNewContact = (io: SocketIOServer, contact: ContactPayload) => {
  io.to('alerts').emit('contact:new', {
    type: 'NEW_CONTACT',
    data: contact,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast contact update
export const broadcastContactUpdate = (io: SocketIOServer, contact: ContactPayload) => {
  io.to('alerts').emit('contact:update', {
    type: 'CONTACT_UPDATED',
    data: contact,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast contact deletion
export const broadcastContactDeletion = (io: SocketIOServer, contactId: string) => {
  io.to('alerts').emit('contact:delete', {
    type: 'CONTACT_DELETED',
    data: { id: contactId },
    timestamp: new Date().toISOString(),
  });
};

// Broadcast new device
export const broadcastNewDevice = (io: SocketIOServer, device: DevicePayload) => {
  io.to('alerts').emit('device:new', {
    type: 'NEW_DEVICE',
    data: device,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast device update
export const broadcastDeviceUpdate = (io: SocketIOServer, device: DevicePayload) => {
  io.to('alerts').emit('device:update', {
    type: 'DEVICE_UPDATED',
    data: device,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast device deletion
export const broadcastDeviceDeletion = (io: SocketIOServer, deviceId: string) => {
  io.to('alerts').emit('device:delete', {
    type: 'DEVICE_DELETED',
    data: { id: deviceId },
    timestamp: new Date().toISOString(),
  });
};

// Broadcast new household
export const broadcastNewHousehold = (io: SocketIOServer, household: HouseholdPayload) => {
  io.to('alerts').emit('household:new', {
    type: 'NEW_HOUSEHOLD',
    data: household,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast household update
export const broadcastHouseholdUpdate = (io: SocketIOServer, household: HouseholdPayload) => {
  io.to('alerts').emit('household:update', {
    type: 'HOUSEHOLD_UPDATED',
    data: household,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast household deletion
export const broadcastHouseholdDeletion = (io: SocketIOServer, householdId: string) => {
  io.to('alerts').emit('household:delete', {
    type: 'HOUSEHOLD_DELETED',
    data: { id: householdId },
    timestamp: new Date().toISOString(),
  });
};

// Broadcast new notification
export const broadcastNewNotification = (io: SocketIOServer, notification: NotificationPayload) => {
  io.to('alerts').emit('notification:new', {
    type: 'NEW_NOTIFICATION',
    data: notification,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast notification update
export const broadcastNotificationUpdate = (io: SocketIOServer, notification: NotificationPayload) => {
  io.to('alerts').emit('notification:update', {
    type: 'NOTIFICATION_UPDATED',
    data: notification,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast notification deletion
export const broadcastNotificationDeletion = (io: SocketIOServer, notificationId: string) => {
  io.to('alerts').emit('notification:delete', {
    type: 'NOTIFICATION_DELETED',
    data: { id: notificationId },
    timestamp: new Date().toISOString(),
  });
};

// Broadcast new network node
export const broadcastNewNetworkNode = (io: SocketIOServer, node: NetworkNodePayload) => {
  io.to('alerts').emit('network:node:new', {
    type: 'NEW_NETWORK_NODE',
    data: node,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast network node update
export const broadcastNetworkNodeUpdate = (io: SocketIOServer, node: NetworkNodePayload) => {
  io.to('alerts').emit('network:node:update', {
    type: 'NETWORK_NODE_UPDATED',
    data: node,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast network node deletion
export const broadcastNetworkNodeDeletion = (io: SocketIOServer, nodeId: string) => {
  io.to('alerts').emit('network:node:delete', {
    type: 'NETWORK_NODE_DELETED',
    data: { id: nodeId },
    timestamp: new Date().toISOString(),
  });
};

// Broadcast new network event
export const broadcastNewNetworkEvent = (io: SocketIOServer, event: NetworkEventPayload) => {
  io.to('alerts').emit('network:event:new', {
    type: 'NEW_NETWORK_EVENT',
    data: event,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast network event deletion
export const broadcastNetworkEventDeletion = (io: SocketIOServer, eventId: string) => {
  io.to('alerts').emit('network:event:delete', {
    type: 'NETWORK_EVENT_DELETED',
    data: { id: eventId },
    timestamp: new Date().toISOString(),
  });
};

// Broadcast new fire incident
export const broadcastNewFireIncident = (io: SocketIOServer, incident: FireIncidentPayload) => {
  io.to('alerts').emit('fireIncident:new', {
    type: 'NEW_FIRE_INCIDENT',
    data: incident,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast fire incident update
export const broadcastFireIncidentUpdate = (io: SocketIOServer, incident: FireIncidentPayload) => {
  io.to('alerts').emit('fireIncident:update', {
    type: 'FIRE_INCIDENT_UPDATED',
    data: incident,
    timestamp: new Date().toISOString(),
  });
};

// Broadcast fire incident deletion
export const broadcastFireIncidentDeletion = (io: SocketIOServer, incidentId: string) => {
  io.to('alerts').emit('fireIncident:delete', {
    type: 'FIRE_INCIDENT_DELETED',
    data: { id: incidentId },
    timestamp: new Date().toISOString(),
  });
};

// Get connected clients count
export const getConnectedClientsCount = (): number => {
  return connectedClients.size;
};

export default {
  initSocketIO,
  broadcastNewAlert,
  broadcastAlertUpdate,
  broadcastAlertDeletion,
  broadcastNewContact,
  broadcastContactUpdate,
  broadcastContactDeletion,
  broadcastNewDevice,
  broadcastDeviceUpdate,
  broadcastDeviceDeletion,
  broadcastNewHousehold,
  broadcastHouseholdUpdate,
  broadcastHouseholdDeletion,
  broadcastNewNotification,
  broadcastNotificationUpdate,
  broadcastNotificationDeletion,
  broadcastNewNetworkNode,
  broadcastNetworkNodeUpdate,
  broadcastNetworkNodeDeletion,
  broadcastNewNetworkEvent,
  broadcastNetworkEventDeletion,
  broadcastNewFireIncident,
  broadcastFireIncidentUpdate,
  broadcastFireIncidentDeletion,
  getConnectedClientsCount,
};
