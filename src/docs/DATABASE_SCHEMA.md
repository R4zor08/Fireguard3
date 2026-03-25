
# FIREGUARD Database Schema

## Tables

### 1. users
Admin users and BFP officers

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'admin', 'officer', 'viewer'
  bfp_station VARCHAR(255),
  contact_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

### 2. houses
Registered houses and buildings

```sql
CREATE TABLE houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id VARCHAR(50) UNIQUE NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  contact_number VARCHAR(20),
  email VARCHAR(255),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  notes TEXT
);

CREATE INDEX idx_houses_location ON houses USING GIST (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_houses_house_id ON houses(house_id);
```

---

### 3. devices
IoT devices installed in houses

```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(50) UNIQUE NOT NULL,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  device_type VARCHAR(50) NOT NULL, -- 'smoke_heat_gas', 'smoke_only', etc.
  firmware_version VARCHAR(20),
  installation_date DATE,
  last_maintenance_date DATE,
  is_online BOOLEAN DEFAULT false,
  last_ping TIMESTAMP,
  battery_level INTEGER, -- 0-100
  signal_strength INTEGER, -- dBm
  status VARCHAR(20) DEFAULT 'normal', -- 'normal', 'warning', 'triggered', 'offline'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_devices_device_id ON devices(device_id);
CREATE INDEX idx_devices_house_id ON devices(house_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_is_online ON devices(is_online);
```

---

### 4. sensor_logs
Historical sensor readings

```sql
CREATE TABLE sensor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  smoke_level DECIMAL(5, 2), -- 0-100%
  temperature DECIMAL(5, 2), -- Celsius
  gas_concentration DECIMAL(7, 2), -- PPM
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sensor_logs_device_id ON sensor_logs(device_id);
CREATE INDEX idx_sensor_logs_timestamp ON sensor_logs(timestamp DESC);
CREATE INDEX idx_sensor_logs_device_time ON sensor_logs(device_id, timestamp DESC);

-- Partition by month for better performance
CREATE TABLE sensor_logs_2024_01 PARTITION OF sensor_logs
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

---

### 5. alerts
Fire detection alerts and events

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id VARCHAR(50) UNIQUE NOT NULL,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'smoke', 'heat', 'gas', 'fire'
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  message TEXT NOT NULL,
  sensor_readings JSONB, -- Store snapshot of readings
  timestamp TIMESTAMP NOT NULL,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMP,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_device_id ON alerts(device_id);
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_acknowledged ON alerts(acknowledged);
CREATE INDEX idx_alerts_type ON alerts(type);
```

---

### 6. device_commands
Remote commands sent to devices

```sql
CREATE TABLE device_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  command_id VARCHAR(50) UNIQUE NOT NULL,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  command_type VARCHAR(50) NOT NULL, -- 'trigger_alarm', 'enable_suppression', 'diagnostics'
  parameters JSONB,
  issued_by UUID REFERENCES users(id),
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'executed', 'failed'
  executed_at TIMESTAMP,
  response JSONB,
  error_message TEXT
);

CREATE INDEX idx_device_commands_device_id ON device_commands(device_id);
CREATE INDEX idx_device_commands_status ON device_commands(status);
CREATE INDEX idx_device_commands_issued_at ON device_commands(issued_at DESC);
```

---

### 7. risk_areas
High-risk geographical areas

```sql
CREATE TABLE risk_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius INTEGER NOT NULL, -- meters
  risk_score INTEGER NOT NULL, -- 0-100
  incident_count INTEGER DEFAULT 0,
  last_incident_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_areas_location ON risk_areas USING GIST (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_risk_areas_risk_score ON risk_areas(risk_score DESC);
```

---

### 8. incidents
Historical fire incidents

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id VARCHAR(50) UNIQUE NOT NULL,
  device_id UUID REFERENCES devices(id),
  alert_id UUID REFERENCES alerts(id),
  incident_type VARCHAR(50) NOT NULL, -- 'fire', 'false_alarm', 'malfunction'
  severity VARCHAR(20) NOT NULL,
  description TEXT,
  response_time INTEGER, -- seconds
  damage_assessment TEXT,
  casualties INTEGER DEFAULT 0,
  injuries INTEGER DEFAULT 0,
  property_damage DECIMAL(12, 2), -- PHP
  incident_date TIMESTAMP NOT NULL,
  resolved_date TIMESTAMP,
  responding_officers JSONB, -- Array of user IDs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_incidents_device_id ON incidents(device_id);
CREATE INDEX idx_incidents_incident_date ON incidents(incident_date DESC);
CREATE INDEX idx_incidents_severity ON incidents(severity);
```

---

### 9. maintenance_logs
Device maintenance history

```sql
CREATE TABLE maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(50) NOT NULL, -- 'routine', 'repair', 'replacement'
  description TEXT,
  performed_by VARCHAR(255),
  maintenance_date DATE NOT NULL,
  next_maintenance_date DATE,
  cost DECIMAL(10, 2),
  parts_replaced JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_logs_device_id ON maintenance_logs(device_id);
CREATE INDEX idx_maintenance_logs_date ON maintenance_logs(maintenance_date DESC);
```

---

### 10. system_logs
System activity and audit logs

```sql
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50), -- 'device', 'alert', 'house', etc.
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp DESC);
CREATE INDEX idx_system_logs_action ON system_logs(action);
```

---

## Views

### active_devices_view
Quick access to active device information

```sql
CREATE VIEW active_devices_view AS
SELECT 
  d.device_id,
  d.status,
  d.is_online,
  d.last_ping,
  h.owner_name,
  h.address,
  h.latitude,
  h.longitude,
  (
    SELECT row_to_json(latest_reading)
    FROM (
      SELECT smoke_level, temperature, gas_concentration, timestamp
      FROM sensor_logs
      WHERE device_id = d.id
      ORDER BY timestamp DESC
      LIMIT 1
    ) latest_reading
  ) as last_reading
FROM devices d
JOIN houses h ON d.house_id = h.id
WHERE d.is_online = true;
```

---

### dashboard_stats_view
Real-time dashboard statistics

```sql
CREATE VIEW dashboard_stats_view AS
SELECT
  (SELECT COUNT(*) FROM houses WHERE is_active = true) as total_houses,
  (SELECT COUNT(*) FROM devices WHERE is_online = true) as active_devices,
  (SELECT COUNT(*) FROM alerts WHERE DATE(timestamp) = CURRENT_DATE) as triggers_today,
  (SELECT COUNT(*) FROM risk_areas WHERE risk_score > 70) as high_risk_areas;
```

---

## Stored Procedures

### update_device_status()
Automatically update device status based on sensor readings

```sql
CREATE OR REPLACE FUNCTION update_device_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE devices
  SET status = CASE
    WHEN NEW.smoke_level > 70 OR NEW.temperature > 60 OR NEW.gas_concentration > 80 THEN 'triggered'
    WHEN NEW.smoke_level > 30 OR NEW.temperature > 35 OR NEW.gas_concentration > 25 THEN 'warning'
    ELSE 'normal'
  END,
  last_ping = NEW.timestamp
  WHERE id = NEW.device_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_device_status
AFTER INSERT ON sensor_logs
FOR EACH ROW
EXECUTE FUNCTION update_device_status();
```

---

### create_alert_from_reading()
Automatically create alerts for critical readings

```sql
CREATE OR REPLACE FUNCTION create_alert_from_reading()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.smoke_level > 70 OR NEW.temperature > 60 OR NEW.gas_concentration > 80 THEN
    INSERT INTO alerts (
      alert_id,
      device_id,
      type,
      severity,
      message,
      sensor_readings,
      timestamp
    ) VALUES (
      'ALT-' || to_char(NOW(), 'YYYYMMDD-HH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 8),
      NEW.device_id,
      CASE
        WHEN NEW.smoke_level > 70 AND NEW.temperature > 60 THEN 'fire'
        WHEN NEW.smoke_level > 70 THEN 'smoke'
        WHEN NEW.temperature > 60 THEN 'heat'
        ELSE 'gas'
      END,
      'critical',
      'Critical sensor readings detected',
      jsonb_build_object(
        'smoke', NEW.smoke_level,
        'temperature', NEW.temperature,
        'gas', NEW.gas_concentration
      ),
      NEW.timestamp
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_alert
AFTER INSERT ON sensor_logs
FOR EACH ROW
EXECUTE FUNCTION create_alert_from_reading();
```
