import { Request, Response, NextFunction } from 'express';
import { 
  createAlert, 
  getAlerts, 
  getAlertById, 
  updateAlert, 
  deleteAlert,
  getAlertStats,
  getRecentAlerts,
  AlertStatusType
} from '../services';
import { asyncHandler, AuthRequest, ApiError } from '../middleware';

// Valid alert statuses
const validStatuses: AlertStatusType[] = ['SAFE', 'WARNING', 'ALERT'];

// Create a new alert
export const create = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { deviceId, temperature, smokeLevel, status, location, notes } = req.body;

    // Validate required fields
    if (!deviceId || temperature === undefined || smokeLevel === undefined || !status) {
      throw new ApiError(400, 'deviceId, temperature, smokeLevel, and status are required');
    }

    // Validate status
    if (!validStatuses.includes(status as AlertStatusType)) {
      throw new ApiError(400, 'Invalid status. Must be SAFE, WARNING, or ALERT');
    }

    // Validate numeric values
    if (typeof temperature !== 'number' || typeof smokeLevel !== 'number') {
      throw new ApiError(400, 'Temperature and smokeLevel must be numbers');
    }

    const alert = await createAlert({
      deviceId,
      temperature,
      smokeLevel,
      status: status as AlertStatusType,
      location,
      notes,
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert,
    });
  }
);

// Get all alerts with pagination
export const getAll = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as AlertStatusType | undefined;
    const deviceId = req.query.deviceId as string | undefined;

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      throw new ApiError(400, 'Invalid pagination parameters. Limit must be 1-100');
    }

    const result = await getAlerts({ page, limit, status, deviceId });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  }
);

// Get alert by ID
export const getById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const alert = await getAlertById(id);

    if (!alert) {
      throw new ApiError(404, 'Alert not found');
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  }
);

// Update alert
export const update = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { deviceId, temperature, smokeLevel, status, location, notes } = req.body;

    // Validate status if provided
    if (status && !validStatuses.includes(status as AlertStatusType)) {
      throw new ApiError(400, 'Invalid status. Must be SAFE, WARNING, or ALERT');
    }

    const alert = await updateAlert(id, {
      deviceId,
      temperature,
      smokeLevel,
      status: status as AlertStatusType,
      location,
      notes,
    });

    res.status(200).json({
      success: true,
      message: 'Alert updated successfully',
      data: alert,
    });
  }
);

// Delete alert
export const remove = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params;

    await deleteAlert(id);

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully',
    });
  }
);

// Get alert statistics
export const getStats = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const stats = await getAlertStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  }
);

// Get recent alerts
export const getRecent = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const hours = parseInt(req.query.hours as string) || 24;

    const alerts = await getRecentAlerts(hours);

    res.status(200).json({
      success: true,
      data: alerts,
    });
  }
);
