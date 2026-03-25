import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware';
import {
  broadcastNewFireIncident,
  broadcastFireIncidentDeletion,
  broadcastFireIncidentUpdate,
} from '../config/socket';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// GET /api/fire-incidents
router.get('/', async (req: Request, res: Response) => {
  try {
    const severity = (req.query.severity as string) || undefined;
    const status = (req.query.status as string) || undefined;

    const where: any = {};
    if (severity) where.severity = severity;
    if (status) where.status = status;

    const incidents = await prisma.fireIncident.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      take: 200,
    });

    res.status(200).json({ success: true, data: incidents });
  } catch (error) {
    console.error('Error fetching fire incidents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fire incidents' });
  }
});

// GET /api/fire-incidents/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const incident = await prisma.fireIncident.findUnique({ where: { id } });
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Fire incident not found' });
    }

    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    console.error('Error fetching fire incident:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fire incident' });
  }
});

// POST /api/fire-incidents (Admin)
router.post('/', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { title, severity, status, latitude, longitude, startedAt, endedAt } = req.body;

    if (!title || !severity || !status || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'title, severity, status, latitude, and longitude are required',
      });
    }

    const incident = await prisma.fireIncident.create({
      data: {
        title,
        severity,
        status,
        latitude,
        longitude,
        startedAt: startedAt ? new Date(startedAt) : undefined,
        endedAt: endedAt ? new Date(endedAt) : undefined,
      },
    });

    const io = (req.app as any).get('io');
    if (io) broadcastNewFireIncident(io, incident);

    res.status(201).json({ success: true, data: incident });
  } catch (error) {
    console.error('Error creating fire incident:', error);
    res.status(500).json({ success: false, message: 'Failed to create fire incident' });
  }
});

// PUT /api/fire-incidents/:id (Admin)
router.put('/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.fireIncident.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Fire incident not found' });
    }

    const { title, severity, status, latitude, longitude, startedAt, endedAt } = req.body;

    const incident = await prisma.fireIncident.update({
      where: { id },
      data: {
        title,
        severity,
        status,
        latitude,
        longitude,
        startedAt: startedAt ? new Date(startedAt) : undefined,
        endedAt: endedAt ? new Date(endedAt) : undefined,
      },
    });

    const io = (req.app as any).get('io');
    if (io) broadcastFireIncidentUpdate(io, incident);

    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    console.error('Error updating fire incident:', error);
    res.status(500).json({ success: false, message: 'Failed to update fire incident' });
  }
});

// DELETE /api/fire-incidents/:id (Admin)
router.delete('/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.fireIncident.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Fire incident not found' });
    }

    await prisma.fireIncident.delete({ where: { id } });

    const io = (req.app as any).get('io');
    if (io) broadcastFireIncidentDeletion(io, id);

    res.status(200).json({ success: true, message: 'Fire incident deleted successfully' });
  } catch (error) {
    console.error('Error deleting fire incident:', error);
    res.status(500).json({ success: false, message: 'Failed to delete fire incident' });
  }
});

export default router;
