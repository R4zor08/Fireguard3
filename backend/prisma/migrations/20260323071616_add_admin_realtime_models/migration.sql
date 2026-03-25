-- CreateTable
CREATE TABLE "households" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "householdCode" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "emergencyContact" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "lastIncident" DATETIME,
    "lastInspection" DATETIME,
    "safetyScore" INTEGER,
    "fireExtinguishers" INTEGER DEFAULT 0,
    "smokeDetectors" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "ownerName" TEXT,
    "address" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "status" TEXT NOT NULL DEFAULT 'normal',
    "isOnline" BOOLEAN NOT NULL DEFAULT true,
    "batteryLevel" INTEGER,
    "signalStrength" INTEGER,
    "firmwareVersion" TEXT,
    "lastSeen" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "householdId" TEXT,
    "userId" TEXT,
    CONSTRAINT "devices_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "device_readings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "temperature" REAL,
    "smoke" REAL,
    "gas" REAL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "device_readings_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'low',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "network_nodes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'online',
    "latency" INTEGER DEFAULT 0,
    "connections" INTEGER NOT NULL DEFAULT 0,
    "signalStrength" INTEGER DEFAULT 0,
    "lastSeen" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "network_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    CONSTRAINT "network_events_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "network_nodes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fire_incidents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "households_householdCode_key" ON "households"("householdCode");

-- CreateIndex
CREATE INDEX "households_riskLevel_idx" ON "households"("riskLevel");

-- CreateIndex
CREATE INDEX "devices_householdId_idx" ON "devices"("householdId");

-- CreateIndex
CREATE INDEX "devices_status_idx" ON "devices"("status");

-- CreateIndex
CREATE INDEX "devices_isOnline_idx" ON "devices"("isOnline");

-- CreateIndex
CREATE INDEX "device_readings_deviceId_idx" ON "device_readings"("deviceId");

-- CreateIndex
CREATE INDEX "device_readings_timestamp_idx" ON "device_readings"("timestamp");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_priority_idx" ON "notifications"("priority");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "network_nodes_type_idx" ON "network_nodes"("type");

-- CreateIndex
CREATE INDEX "network_nodes_status_idx" ON "network_nodes"("status");

-- CreateIndex
CREATE INDEX "network_events_nodeId_idx" ON "network_events"("nodeId");

-- CreateIndex
CREATE INDEX "network_events_timestamp_idx" ON "network_events"("timestamp");

-- CreateIndex
CREATE INDEX "network_events_type_idx" ON "network_events"("type");

-- CreateIndex
CREATE INDEX "fire_incidents_severity_idx" ON "fire_incidents"("severity");

-- CreateIndex
CREATE INDEX "fire_incidents_status_idx" ON "fire_incidents"("status");

-- CreateIndex
CREATE INDEX "fire_incidents_startedAt_idx" ON "fire_incidents"("startedAt");
