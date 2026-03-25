import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware';
import { broadcastDeviceDeletion, broadcastDeviceUpdate, broadcastNewDevice } from '../config/socket';

const prisma = new PrismaClient();
const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/devices - List devices
router.get('/', async (req: Request, res: Response) => {
  try {
    const householdId = (req.query.householdId as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const isOnlineRaw = (req.query.isOnline as string) || undefined;

    const where: any = {};
    if (householdId) where.householdId = householdId;
    if (status) where.status = status;
    if (isOnlineRaw !== undefined) {
      if (isOnlineRaw === 'true') where.isOnline = true;
      if (isOnlineRaw === 'false') where.isOnline = false;
    }

    const devices = await prisma.device.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        household: true,
      },
    });

    res.status(200).json({ success: true, data: devices });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch devices' });
  }
});

// GET /api/devices/:id - Get device
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const device = await prisma.device.findUnique({
      where: { id },
      include: { household: true },
    });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    res.status(200).json({ success: true, data: device });
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch device' });
  }
});

// POST /api/devices - Create device (Admin)
router.post('/', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const {
      id,
      name,
      ownerName,
      address,
      latitude,
      longitude,
      status,
      isOnline,
      batteryLevel,
      signalStrength,
      firmwareVersion,
      lastSeen,
      householdId,
      userId,
    } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'id is required' });
    }

    const device = await prisma.device.create({
      data: {
        id,
        name,
        ownerName,
        address,
        latitude,
        longitude,
        status,
        isOnline,
        batteryLevel,
        signalStrength,
        firmwareVersion,
        lastSeen: lastSeen ? new Date(lastSeen) : undefined,
        householdId,
        userId,
      },
      include: { household: true },
    });

    const io = (req.app as any).get('io');
    if (io) {
      broadcastNewDevice(io, device);
    }

    res.status(201).json({ success: true, data: device });
  } catch (error: any) {
    console.error('Error creating device:', error);
    res.status(500).json({ success: false, message: 'Failed to create device' });
  }
});

// PUT /api/devices/:id - Update device (Admin)
router.put('/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.device.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    const {
      name,
      ownerName,
      address,
      latitude,
      longitude,
      status,
      isOnline,
      batteryLevel,
      signalStrength,
      firmwareVersion,
      lastSeen,
      householdId,
      userId,
    } = req.body;

    const device = await prisma.device.update({
      where: { id },
      data: {
        name,
        ownerName,
        address,
        latitude,
        longitude,
        status,
        isOnline,
        batteryLevel,
        signalStrength,
        firmwareVersion,
        lastSeen: lastSeen ? new Date(lastSeen) : undefined,
        householdId,
        userId,
      },
      include: { household: true },
    });

    const io = (req.app as any).get('io');
    if (io) {
      broadcastDeviceUpdate(io, device);
    }

    res.status(200).json({ success: true, data: device });
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ success: false, message: 'Failed to update device' });
  }
});

// DELETE /api/devices/:id - Delete device (Admin)
router.delete('/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.device.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    await prisma.device.delete({ where: { id } });

    const io = (req.app as any).get('io');
    if (io) {
      broadcastDeviceDeletion(io, id);
    }

    res.status(200).json({ success: true, message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ success: false, message: 'Failed to delete device' });
  }
});

export default router;
