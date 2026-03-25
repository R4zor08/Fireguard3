import { prisma } from '../config/database';

// Alert status type (String for SQLite)
export type AlertStatusType = 'SAFE' | 'WARNING' | 'ALERT';

// Alert creation data type
interface CreateAlertData {
  deviceId: string;
  temperature: number;
  smokeLevel: number;
  status: AlertStatusType;
  location?: string;
  notes?: string;
  userId?: string;
}

// Alert update data type
interface UpdateAlertData {
  deviceId?: string;
  temperature?: number;
  smokeLevel?: number;
  status?: AlertStatusType;
  location?: string;
  notes?: string;
}

// Pagination parameters
interface PaginationParams {
  page: number;
  limit: number;
  status?: AlertStatusType;
  deviceId?: string;
}

// Paginated result type
interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Create a new alert
export const createAlert = async (data: CreateAlertData) => {
  const alert = await prisma.alert.create({
    data: {
      deviceId: data.deviceId,
      temperature: data.temperature,
      smokeLevel: data.smokeLevel,
      status: data.status,
      location: data.location,
      notes: data.notes,
      userId: data.userId,
    },
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });

  return alert;
};

// Get all alerts with pagination
export const getAlerts = async (params: PaginationParams): Promise<PaginatedResult<any>> => {
  const { page, limit, status, deviceId } = params;
  const skip = (page - 1) * limit;

  // Build filter conditions
  const where: any = {};
  if (status) where.status = status;
  if (deviceId) where.deviceId = deviceId;

  // Get total count
  const total = await prisma.alert.count({ where });

  // Get paginated alerts
  const alerts = await prisma.alert.findMany({
    where,
    skip,
    take: limit,
    orderBy: { timestamp: 'desc' },
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: alerts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Get alert by ID
export const getAlertById = async (id: string) => {
  const alert = await prisma.alert.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });

  return alert;
};

// Update alert
export const updateAlert = async (id: string, data: UpdateAlertData) => {
  const alert = await prisma.alert.update({
    where: { id },
    data,
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });

  return alert;
};

// Delete alert
export const deleteAlert = async (id: string) => {
  await prisma.alert.delete({
    where: { id },
  });

  return true;
};

// Get alerts statistics
export const getAlertStats = async () => {
  const [total, safe, warning, alert] = await Promise.all([
    prisma.alert.count(),
    prisma.alert.count({ where: { status: 'SAFE' } }),
    prisma.alert.count({ where: { status: 'WARNING' } }),
    prisma.alert.count({ where: { status: 'ALERT' } }),
  ]);

  return {
    total,
    safe,
    warning,
    alert,
  };
};

// Get recent alerts (last 24 hours)
export const getRecentAlerts = async (hours: number = 24) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const alerts = await prisma.alert.findMany({
    where: {
      timestamp: {
        gte: since,
      },
    },
    orderBy: { timestamp: 'desc' },
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });

  return alerts;
};
