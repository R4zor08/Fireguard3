import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware';
import { broadcastHouseholdDeletion, broadcastHouseholdUpdate, broadcastNewHousehold } from '../config/socket';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// GET /api/households - List households
router.get('/', async (req: Request, res: Response) => {
  try {
    const riskLevel = (req.query.riskLevel as string) || undefined;

    const where: any = {};
    if (riskLevel) where.riskLevel = riskLevel;

    const households = await prisma.household.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: { devices: true },
    });

    res.status(200).json({ success: true, data: households });
  } catch (error) {
    console.error('Error fetching households:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch households' });
  }
});

// GET /api/households/:id - Get household
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const household = await prisma.household.findUnique({
      where: { id },
      include: { devices: true },
    });

    if (!household) {
      return res.status(404).json({ success: false, message: 'Household not found' });
    }

    res.status(200).json({ success: true, data: household });
  } catch (error) {
    console.error('Error fetching household:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch household' });
  }
});

// POST /api/households - Create household (Admin)
router.post('/', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const {
      householdCode,
      ownerName,
      address,
      contactNumber,
      emergencyContact,
      riskLevel,
      lastIncident,
      lastInspection,
      safetyScore,
      fireExtinguishers,
      smokeDetectors,
    } = req.body;

    if (!householdCode || !ownerName || !address || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'householdCode, ownerName, address, and contactNumber are required',
      });
    }

    const household = await prisma.household.create({
      data: {
        householdCode,
        ownerName,
        address,
        contactNumber,
        emergencyContact,
        riskLevel,
        lastIncident: lastIncident ? new Date(lastIncident) : undefined,
        lastInspection: lastInspection ? new Date(lastInspection) : undefined,
        safetyScore,
        fireExtinguishers,
        smokeDetectors,
      },
      include: { devices: true },
    });

    const io = (req.app as any).get('io');
    if (io) {
      broadcastNewHousehold(io, household);
    }

    res.status(201).json({ success: true, data: household });
  } catch (error: any) {
    console.error('Error creating household:', error);
    res.status(500).json({ success: false, message: 'Failed to create household' });
  }
});

// PUT /api/households/:id - Update household (Admin)
router.put('/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.household.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Household not found' });
    }

    const {
      householdCode,
      ownerName,
      address,
      contactNumber,
      emergencyContact,
      riskLevel,
      lastIncident,
      lastInspection,
      safetyScore,
      fireExtinguishers,
      smokeDetectors,
    } = req.body;

    const household = await prisma.household.update({
      where: { id },
      data: {
        householdCode,
        ownerName,
        address,
        contactNumber,
        emergencyContact,
        riskLevel,
        lastIncident: lastIncident ? new Date(lastIncident) : undefined,
        lastInspection: lastInspection ? new Date(lastInspection) : undefined,
        safetyScore,
        fireExtinguishers,
        smokeDetectors,
      },
      include: { devices: true },
    });

    const io = (req.app as any).get('io');
    if (io) {
      broadcastHouseholdUpdate(io, household);
    }

    res.status(200).json({ success: true, data: household });
  } catch (error) {
    console.error('Error updating household:', error);
    res.status(500).json({ success: false, message: 'Failed to update household' });
  }
});

// DELETE /api/households/:id - Delete household (Admin)
router.delete('/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.household.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Household not found' });
    }

    await prisma.household.delete({ where: { id } });

    const io = (req.app as any).get('io');
    if (io) {
      broadcastHouseholdDeletion(io, id);
    }

    res.status(200).json({ success: true, message: 'Household deleted successfully' });
  } catch (error) {
    console.error('Error deleting household:', error);
    res.status(500).json({ success: false, message: 'Failed to delete household' });
  }
});

export default router;
