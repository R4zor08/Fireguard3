
# FIREGUARD API Documentation

## Base URL
```
https://api.fireguard.ph/v1
```

## Authentication
All API requests require an API key in the header:
```
Authorization: Bearer YOUR_API_KEY
```

---

## Endpoints

### 1. Register House
Register a new house/building in the FIREGUARD system.

**Endpoint:** `POST /houses`

**Request Body:**
```json
{
  "ownerName": "Juan dela Cruz",
  "address": "123 Rizal St, Makati City",
  "latitude": 14.5547,
  "longitude": 121.0244,
  "contactNumber": "+639171234567",
  "email": "juan@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "houseId": "HOUSE001",
  "message": "House registered successfully"
}
```

---

### 2. Register Device
Register a new FIREGUARD IoT device.

**Endpoint:** `POST /devices`

**Request Body:**
```json
{
  "deviceId": "DEV001",
  "houseId": "HOUSE001",
  "deviceType": "smoke_heat_gas",
  "installationDate": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "deviceId": "DEV001",
  "activationCode": "FG-2024-ABC123",
  "message": "Device registered and activated"
}
```

---

### 3. Send Sensor Data
IoT device sends real-time sensor readings.

**Endpoint:** `POST /devices/{deviceId}/readings`

**Request Body:**
```json
{
  "smoke": 15.5,
  "temperature": 32.0,
  "gas": 18.2,
  "timestamp": "2024-01-15T14:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "status": "normal",
  "message": "Readings recorded"
}
```

---

### 4. Get Device Status
Retrieve current status and latest readings of a device.

**Endpoint:** `GET /devices/{deviceId}`

**Response:**
```json
{
  "deviceId": "DEV001",
  "status": "normal",
  "isOnline": true,
  "lastReading": {
    "smoke": 15.5,
    "temperature": 32.0,
    "gas": 18.2,
    "timestamp": "2024-01-15T14:30:00Z"
  },
  "house": {
    "ownerName": "Juan dela Cruz",
    "address": "123 Rizal St, Makati City"
  }
}
```

---

### 5. Get All Devices
Retrieve all registered devices with filtering options.

**Endpoint:** `GET /devices`

**Query Parameters:**
- `status` (optional): Filter by status (normal, warning, triggered, offline)
- `limit` (optional): Number of results (default: 100)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "total": 847,
  "devices": [
    {
      "deviceId": "DEV001",
      "status": "normal",
      "ownerName": "Juan dela Cruz",
      "address": "123 Rizal St, Makati City",
      "latitude": 14.5547,
      "longitude": 121.0244,
      "lastReading": {
        "smoke": 15.5,
        "temperature": 32.0,
        "gas": 18.2,
        "timestamp": "2024-01-15T14:30:00Z"
      }
    }
  ]
}
```

---

### 6. Get Alerts
Retrieve fire detection alerts.

**Endpoint:** `GET /alerts`

**Query Parameters:**
- `severity` (optional): Filter by severity (low, medium, high, critical)
- `acknowledged` (optional): Filter by acknowledgment status (true/false)
- `startDate` (optional): Filter alerts from date
- `endDate` (optional): Filter alerts to date

**Response:**
```json
{
  "total": 12,
  "alerts": [
    {
      "id": "ALT001",
      "deviceId": "DEV003",
      "type": "fire",
      "severity": "critical",
      "message": "FIRE DETECTED - Multiple sensors triggered",
      "timestamp": "2024-01-15T14:30:00Z",
      "acknowledged": false
    }
  ]
}
```

---

### 7. Trigger Alarm
Remotely trigger the alarm on a device.

**Endpoint:** `POST /devices/{deviceId}/alarm`

**Request Body:**
```json
{
  "duration": 60,
  "pattern": "continuous"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alarm triggered successfully",
  "commandId": "CMD001"
}
```

---

### 8. Enable Suppression
Activate fire suppression system (if available).

**Endpoint:** `POST /devices/{deviceId}/suppression`

**Request Body:**
```json
{
  "type": "foam",
  "duration": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "Suppression system activated",
  "commandId": "CMD002"
}
```

---

### 9. Device Health Check
Check device connectivity and system status.

**Endpoint:** `GET /devices/{deviceId}/health`

**Response:**
```json
{
  "deviceId": "DEV001",
  "isOnline": true,
  "lastPing": "2024-01-15T14:30:00Z",
  "batteryLevel": 85,
  "signalStrength": -45,
  "firmwareVersion": "1.2.3",
  "sensorStatus": {
    "smoke": "operational",
    "temperature": "operational",
    "gas": "operational"
  }
}
```

---

### 10. Get Dashboard Stats
Retrieve system-wide statistics.

**Endpoint:** `GET /dashboard/stats`

**Response:**
```json
{
  "totalHouses": 847,
  "activeDevices": 823,
  "triggersToday": 12,
  "highRiskAreas": 3,
  "averageResponseTime": 45
}
```

---

## WebSocket Connection
For real-time sensor data streaming:

**Endpoint:** `wss://api.fireguard.ph/v1/stream`

**Connection:**
```javascript
const ws = new WebSocket('wss://api.fireguard.ph/v1/stream?token=YOUR_API_KEY');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

**Message Format:**
```json
{
  "type": "sensor_reading",
  "deviceId": "DEV001",
  "data": {
    "smoke": 15.5,
    "temperature": 32.0,
    "gas": 18.2,
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "Device with ID DEV999 not found"
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED`: Invalid or missing API key
- `DEVICE_NOT_FOUND`: Device ID does not exist
- `HOUSE_NOT_FOUND`: House ID does not exist
- `INVALID_REQUEST`: Request body validation failed
- `DEVICE_OFFLINE`: Device is not responding
- `RATE_LIMIT_EXCEEDED`: Too many requests

---

## Rate Limits
- Standard: 1000 requests per hour
- WebSocket: Unlimited real-time updates
- Burst: 100 requests per minute
