
# FIREGUARD System Architecture

## Overview
FIREGUARD is a distributed IoT fire prevention platform consisting of edge devices, cloud infrastructure, and web applications.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FIREGUARD ECOSYSTEM                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│  IoT Devices     │         │  Admin Web App   │
│  (Edge Layer)    │         │  (Presentation)  │
│                  │         │                  │
│  • Smoke Sensor  │         │  • Dashboard     │
│  • Heat Sensor   │◄────────┤  • Map View      │
│  • Gas Sensor    │  HTTPS  │  • Analytics     │
│  • Alarm System  │  WSS    │  • Alerts        │
│  • WiFi Module   │         │  • Controls      │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │ MQTT/HTTPS                 │ HTTPS/WSS
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Kong/NGINX)                    │
│  • Authentication  • Rate Limiting  • Load Balancing             │
└─────────────────────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│  IoT Service     │         │  Web API Service │
│  (Node.js)       │         │  (Node.js)       │
│                  │         │                  │
│  • MQTT Broker   │         │  • REST API      │
│  • Data Ingestion│◄────────┤  • WebSocket     │
│  • Device Mgmt   │  Redis  │  • Auth Service  │
│  • Command Queue │         │  • Business Logic│
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Message Queue (RabbitMQ)                    │
│  • Sensor Data Queue  • Alert Queue  • Command Queue            │
└─────────────────────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│  Analytics       │         │  Alert Service   │
│  Service         │         │  (Python)        │
│  (Python)        │         │                  │
│  • ML Models     │         │  • Rule Engine   │
│  • Risk Scoring  │         │  • Notifications │
│  • Predictions   │         │  • SMS/Email     │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PostgreSQL   │  │ TimescaleDB  │  │ Redis Cache  │          │
│  │ (Relational) │  │ (Time Series)│  │ (In-Memory)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. IoT Devices (Edge Layer)

**Hardware Components:**
- ESP32/ESP8266 WiFi Module
- MQ-2 Smoke/Gas Sensor
- DHT22 Temperature Sensor
- Piezo Alarm
- LED Status Indicators
- Battery Backup

**Firmware:**
- Written in C++ (Arduino Framework)
- MQTT Client for data transmission
- Local alarm logic for offline operation
- OTA (Over-The-Air) firmware updates
- Watchdog timer for reliability

**Communication:**
- Primary: MQTT over TLS
- Fallback: HTTPS REST API
- Frequency: Every 3 seconds (normal), 1 second (alert)

---

### 2. API Gateway

**Technology:** Kong or NGINX

**Responsibilities:**
- SSL/TLS termination
- API key authentication
- Rate limiting (1000 req/hour per device)
- Request routing
- Load balancing
- DDoS protection

---

### 3. IoT Service

**Technology:** Node.js + Express

**Responsibilities:**
- MQTT broker (Mosquitto)
- Device authentication and registration
- Real-time data ingestion
- Command queue management
- Device health monitoring
- Firmware update distribution

**Key Features:**
- Handles 10,000+ concurrent device connections
- Message validation and sanitization
- Device command execution
- Connection state management

---

### 4. Web API Service

**Technology:** Node.js + Express + TypeScript

**Responsibilities:**
- RESTful API endpoints
- WebSocket server for real-time updates
- User authentication (JWT)
- Business logic layer
- Data aggregation
- Report generation

**API Endpoints:** (See API_DOCUMENTATION.md)

---

### 5. Message Queue

**Technology:** RabbitMQ

**Queues:**
- `sensor_data_queue`: Raw sensor readings
- `alert_queue`: Fire detection alerts
- `command_queue`: Device commands
- `analytics_queue`: Data for ML processing

**Benefits:**
- Decouples services
- Handles traffic spikes
- Ensures message delivery
- Enables async processing

---

### 6. Analytics Service

**Technology:** Python + TensorFlow/PyTorch

**Responsibilities:**
- Risk score calculation
- Predictive fire modeling
- Anomaly detection
- Pattern recognition
- Heatmap generation

**ML Models:**
- Fire prediction model (LSTM)
- Anomaly detection (Isolation Forest)
- Risk scoring (Random Forest)

---

### 7. Alert Service

**Technology:** Python + Celery

**Responsibilities:**
- Rule-based alert generation
- Alert prioritization
- Multi-channel notifications:
  - WebSocket (real-time)
  - SMS (Twilio)
  - Email (SendGrid)
  - Push notifications
- Alert escalation logic

---

### 8. Data Layer

**PostgreSQL:**
- User accounts
- Houses and devices
- Alerts and incidents
- System configuration

**TimescaleDB:**
- Time-series sensor data
- Optimized for high-write throughput
- Automatic data retention policies
- Continuous aggregates for analytics

**Redis:**
- Session management
- Real-time device status cache
- Rate limiting counters
- WebSocket connection state
- Message queue (backup)

---

## Data Flow

### Sensor Reading Flow
```
IoT Device → MQTT → IoT Service → RabbitMQ → 
  ├─→ TimescaleDB (storage)
  ├─→ Analytics Service (ML processing)
  ├─→ Alert Service (rule evaluation)
  └─→ WebSocket → Admin App (real-time display)
```

### Alert Flow
```
Sensor Reading → Alert Service (rule engine) →
  ├─→ PostgreSQL (alert storage)
  ├─→ WebSocket → Admin App (real-time notification)
  ├─→ SMS Service → BFP Officers
  └─→ Email Service → House Owners
```

### Command Flow
```
Admin App → Web API → RabbitMQ → IoT Service → 
MQTT → IoT Device → Execute Command → 
Response → IoT Service → Web API → Admin App
```

---

## Security Architecture

### Device Security
- TLS 1.3 for all communications
- Device certificates (X.509)
- Secure boot on ESP32
- Encrypted firmware updates
- Hardware security module (optional)

### API Security
- JWT authentication
- API key rotation
- Rate limiting per endpoint
- SQL injection prevention
- XSS protection
- CSRF tokens

### Data Security
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Database access controls
- Audit logging
- GDPR compliance

---

## Scalability

### Horizontal Scaling
- Stateless API services
- Load balancer distribution
- Database read replicas
- Redis cluster
- Message queue clustering

### Vertical Scaling
- Database optimization
- Query caching
- CDN for static assets
- Connection pooling

### Performance Targets
- API response time: < 200ms (p95)
- WebSocket latency: < 100ms
- Device command execution: < 2s
- Alert notification: < 5s
- System uptime: 99.9%

---

## Monitoring & Observability

**Metrics Collection:**
- Prometheus for metrics
- Grafana for visualization
- ELK Stack for logs
- Jaeger for distributed tracing

**Key Metrics:**
- Device online/offline count
- API request rate and latency
- Alert generation rate
- Database query performance
- Message queue depth
- Error rates

**Alerting:**
- PagerDuty for critical alerts
- Slack for team notifications
- Email for non-critical issues

---

## Disaster Recovery

**Backup Strategy:**
- Database: Daily full backup + hourly incremental
- Configuration: Version controlled (Git)
- Retention: 30 days

**Recovery Objectives:**
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 15 minutes

**High Availability:**
- Multi-AZ deployment
- Database replication
- Automatic failover
- Health checks and auto-recovery

---

## Deployment

**Infrastructure:**
- Cloud Provider: AWS/GCP/Azure
- Container Orchestration: Kubernetes
- CI/CD: GitHub Actions
- Infrastructure as Code: Terraform

**Environments:**
- Development
- Staging
- Production

**Deployment Strategy:**
- Blue-green deployment
- Canary releases for critical services
- Automated rollback on failure
