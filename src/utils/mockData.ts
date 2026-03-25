import { Device, Alert, DashboardStats, RiskArea, FireIncident } from '../types';

// Tandag City coordinates
export const TANDAG_CENTER = {
  lat: 9.0781,
  lng: 126.1975
};
export const mockDevices: Device[] = [{
  id: 'DEV001',
  status: 'normal',
  ownerName: 'Juan dela Cruz',
  address: '123 Rizal St, Tandag City',
  latitude: 9.075,
  longitude: 126.195,
  lastReading: {
    smoke: 5,
    temperature: 28,
    gas: 12,
    timestamp: new Date()
  },
  isOnline: true
}, {
  id: 'DEV002',
  status: 'warning',
  ownerName: 'Maria Santos',
  address: '456 Bonifacio Ave, Tandag City',
  latitude: 9.0781,
  longitude: 126.1975,
  lastReading: {
    smoke: 45,
    temperature: 42,
    gas: 28,
    timestamp: new Date()
  },
  isOnline: true
}, {
  id: 'DEV003',
  status: 'triggered',
  ownerName: 'Pedro Reyes',
  address: '789 Quezon Blvd, Tandag City',
  latitude: 9.082,
  longitude: 126.201,
  lastReading: {
    smoke: 85,
    temperature: 68,
    gas: 92,
    timestamp: new Date()
  },
  isOnline: true
}, {
  id: 'DEV004',
  status: 'normal',
  ownerName: 'Ana Garcia',
  address: '321 Taft Avenue, Tandag City',
  latitude: 9.074,
  longitude: 126.199,
  lastReading: {
    smoke: 8,
    temperature: 26,
    gas: 15,
    timestamp: new Date()
  },
  isOnline: true
}, {
  id: 'DEV005',
  status: 'offline',
  ownerName: 'Carlos Mendoza',
  address: '654 National Highway, Tandag City',
  latitude: 9.08,
  longitude: 126.2,
  lastReading: {
    smoke: 0,
    temperature: 0,
    gas: 0,
    timestamp: new Date(Date.now() - 3600000)
  },
  isOnline: false
}, {
  id: 'DEV006',
  status: 'normal',
  ownerName: 'Rosa Fernandez',
  address: '987 San Nicolas St, Tandag City',
  latitude: 9.076,
  longitude: 126.196,
  lastReading: {
    smoke: 3,
    temperature: 27,
    gas: 10,
    timestamp: new Date()
  },
  isOnline: true
}, {
  id: 'DEV007',
  status: 'warning',
  ownerName: 'Miguel Torres',
  address: '147 Mabini St, Tandag City',
  latitude: 9.079,
  longitude: 126.1985,
  lastReading: {
    smoke: 38,
    temperature: 39,
    gas: 31,
    timestamp: new Date()
  },
  isOnline: true
}, {
  id: 'DEV008',
  status: 'normal',
  ownerName: 'Elena Cruz',
  address: '258 Poblacion, Tandag City',
  latitude: 9.077,
  longitude: 126.202,
  lastReading: {
    smoke: 6,
    temperature: 29,
    gas: 14,
    timestamp: new Date()
  },
  isOnline: true
}];
export const mockAlerts: Alert[] = [{
  id: 'ALT001',
  deviceId: 'DEV003',
  type: 'fire',
  severity: 'critical',
  message: 'FIRE DETECTED - Multiple sensors triggered',
  timestamp: new Date(),
  acknowledged: false
}, {
  id: 'ALT002',
  deviceId: 'DEV002',
  type: 'smoke',
  severity: 'high',
  message: 'High smoke levels detected',
  timestamp: new Date(Date.now() - 300000),
  acknowledged: false
}, {
  id: 'ALT003',
  deviceId: 'DEV007',
  type: 'heat',
  severity: 'medium',
  message: 'Temperature above threshold',
  timestamp: new Date(Date.now() - 600000),
  acknowledged: true
}];
export const mockStats: DashboardStats = {
  totalHouses: 847,
  activeDevices: 823,
  triggersToday: 12,
  highRiskAreas: 3
};
export const mockRiskAreas: RiskArea[] = [{
  latitude: 9.0781,
  longitude: 126.1975,
  radius: 500,
  riskScore: 78,
  incidents: 5
}, {
  latitude: 9.082,
  longitude: 126.201,
  radius: 400,
  riskScore: 65,
  incidents: 3
}, {
  latitude: 9.075,
  longitude: 126.195,
  radius: 350,
  riskScore: 52,
  incidents: 2
}];

// 2025 Fire Incidents Data
export const mockFireIncidents: FireIncident[] = [{
  id: 'FIRE001',
  deviceId: 'DEV003',
  type: 'active_fire',
  severity: 'critical',
  latitude: 9.082,
  longitude: 126.201,
  address: '789 Quezon Blvd, Tandag City',
  detectedAt: new Date('2025-01-15T14:23:00'),
  affectedHouseholds: 3,
  responseUnits: ['Fire Truck 01', 'Ambulance 03', 'BFP Unit Alpha'],
  estimatedDamage: '₱250,000',
  status: 'responding',
  description: 'Active fire detected in residential area. Multiple sensors triggered. BFP units en route.'
}, {
  id: 'FIRE002',
  deviceId: 'DEV002',
  type: 'smoke_detected',
  severity: 'high',
  latitude: 9.0781,
  longitude: 126.1975,
  address: '456 Bonifacio Ave, Tandag City',
  detectedAt: new Date('2025-01-15T13:45:00'),
  affectedHouseholds: 1,
  responseUnits: ['Fire Truck 02'],
  status: 'contained',
  description: 'Heavy smoke detected from kitchen fire. Contained by residents with fire extinguisher.'
}, {
  id: 'FIRE003',
  type: 'heat_anomaly',
  severity: 'medium',
  latitude: 9.0765,
  longitude: 126.1965,
  address: 'Near Public Market, Tandag City',
  detectedAt: new Date('2025-01-15T12:30:00'),
  affectedHouseholds: 0,
  status: 'active',
  description: 'Elevated temperature readings detected in commercial area. Monitoring situation.'
}, {
  id: 'FIRE004',
  deviceId: 'DEV007',
  type: 'smoke_detected',
  severity: 'medium',
  latitude: 9.079,
  longitude: 126.1985,
  address: '147 Mabini St, Tandag City',
  detectedAt: new Date('2025-01-15T11:15:00'),
  resolvedAt: new Date('2025-01-15T11:45:00'),
  affectedHouseholds: 1,
  status: 'resolved',
  description: 'False alarm - cooking smoke triggered sensors. Situation resolved.'
}, {
  id: 'FIRE005',
  type: 'gas_leak',
  severity: 'high',
  latitude: 9.0795,
  longitude: 126.199,
  address: 'Barangay Hall Complex, Tandag City',
  detectedAt: new Date('2025-01-15T10:00:00'),
  affectedHouseholds: 0,
  responseUnits: ['BFP Hazmat Team', 'Fire Truck 03'],
  status: 'contained',
  description: 'Gas leak detected near LPG storage. Area evacuated and leak contained.'
}];
export interface ReportedIssue {
  id: string;
  deviceId: string;
  ownerName: string;
  address: string;
  issueType: 'malfunction' | 'false_alarm' | 'maintenance' | 'technical';
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  reportedDate: Date;
  resolvedDate?: Date;
  priority: 'low' | 'medium' | 'high';
}
export const mockReportedIssues: ReportedIssue[] = [{
  id: 'ISS001',
  deviceId: 'DEV005',
  ownerName: 'Carlos Mendoza',
  address: '654 National Highway, Tandag City',
  issueType: 'malfunction',
  description: 'Device offline for 2 hours. No response from sensors.',
  status: 'in_progress',
  reportedDate: new Date(Date.now() - 7200000),
  priority: 'high'
}, {
  id: 'ISS002',
  deviceId: 'DEV002',
  ownerName: 'Maria Santos',
  address: '456 Bonifacio Ave, Tandag City',
  issueType: 'false_alarm',
  description: 'Smoke sensor triggered by cooking. No actual fire.',
  status: 'resolved',
  reportedDate: new Date(Date.now() - 86400000),
  resolvedDate: new Date(Date.now() - 82800000),
  priority: 'medium'
}, {
  id: 'ISS003',
  deviceId: 'DEV006',
  ownerName: 'Rosa Fernandez',
  address: '987 San Nicolas St, Tandag City',
  issueType: 'maintenance',
  description: 'Battery level low (15%). Requesting battery replacement.',
  status: 'pending',
  reportedDate: new Date(Date.now() - 172800000),
  priority: 'medium'
}, {
  id: 'ISS004',
  deviceId: 'DEV001',
  ownerName: 'Juan dela Cruz',
  address: '123 Rizal St, Tandag City',
  issueType: 'technical',
  description: 'Gas sensor readings inconsistent. Possible calibration issue.',
  status: 'in_progress',
  reportedDate: new Date(Date.now() - 259200000),
  priority: 'low'
}, {
  id: 'ISS005',
  deviceId: 'DEV007',
  ownerName: 'Miguel Torres',
  address: '147 Mabini St, Tandag City',
  issueType: 'false_alarm',
  description: 'Temperature spike due to direct sunlight exposure.',
  status: 'resolved',
  reportedDate: new Date(Date.now() - 345600000),
  resolvedDate: new Date(Date.now() - 259200000),
  priority: 'low'
}];