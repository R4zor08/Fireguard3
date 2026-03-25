import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware';
import {
  broadcastNewNetworkEvent,
  broadcastNetworkEventDeletion,
  broadcastNewNetworkNode,
  broadcastNetworkNodeDeletion,
  broadcastNetworkNodeUpdate,
} from '../config/socket';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// Network Nodes
// GET /api/network/nodes
router.get('/nodes', async (_req: Request, res: Response) => {
  try {
    const nodes = await prisma.networkNode.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({ success: true, data: nodes });
  } catch (error) {
    console.error('Error fetching network nodes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch network nodes' });
  }
});

// GET /api/network/nodes/:id
router.get('/nodes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const node = await prisma.networkNode.findUnique({
      where: { id },
      include: { events: { orderBy: { timestamp: 'desc' }, take: 50 } },
    });

    if (!node) {
      return res.status(404).json({ success: false, message: 'Network node not found' });
    }

    res.status(200).json({ success: true, data: node });
  } catch (error) {
    console.error('Error fetching network node:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch network node' });
  }
});

// POST /api/network/nodes (Admin)
router.post('/nodes', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id, type, name, status, latency, connections, signalStrength, lastSeen } = req.body;

    if (!id || !type || !name) {
      return res.status(400).json({ success: false, message: 'id, type, and name are required' });
    }

    const node = await prisma.networkNode.create({
      data: {
        id,
        type,
        name,
        status,
        latency,
        connections,
        signalStrength,
        lastSeen: lastSeen ? new Date(lastSeen) : undefined,
      },
    });

    const io = (req.app as any).get('io');
    if (io) broadcastNewNetworkNode(io, node);

    res.status(201).json({ success: true, data: node });
  } catch (error) {
    console.error('Error creating network node:', error);
    res.status(500).json({ success: false, message: 'Failed to create network node' });
  }
});

// PUT /api/network/nodes/:id (Admin)
router.put('/nodes/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.networkNode.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Network node not found' });
    }

    const { type, name, status, latency, connections, signalStrength, lastSeen } = req.body;

    const node = await prisma.networkNode.update({
      where: { id },
      data: {
        type,
        name,
        status,
        latency,
        connections,
        signalStrength,
        lastSeen: lastSeen ? new Date(lastSeen) : undefined,
      },
    });

    const io = (req.app as any).get('io');
    if (io) broadcastNetworkNodeUpdate(io, node);

    res.status(200).json({ success: true, data: node });
  } catch (error) {
    console.error('Error updating network node:', error);
    res.status(500).json({ success: false, message: 'Failed to update network node' });
  }
});

// DELETE /api/network/nodes/:id (Admin)
router.delete('/nodes/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.networkNode.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Network node not found' });
    }

    await prisma.networkNode.delete({ where: { id } });

    const io = (req.app as any).get('io');
    if (io) broadcastNetworkNodeDeletion(io, id);

    res.status(200).json({ success: true, message: 'Network node deleted successfully' });
  } catch (error) {
    console.error('Error deleting network node:', error);
    res.status(500).json({ success: false, message: 'Failed to delete network node' });
  }
});

// Network Events
// GET /api/network/events
router.get('/events', async (req: Request, res: Response) => {
  try {
    const nodeId = (req.query.nodeId as string) || undefined;

    const where: any = {};
    if (nodeId) where.nodeId = nodeId;

    const events = await prisma.networkEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 200,
    });

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching network events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch network events' });
  }
});

// POST /api/network/events (Admin)
router.post('/events', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { nodeId, type, details, status, timestamp } = req.body;

    if (!nodeId || !type || !details || !status) {
      return res.status(400).json({
        success: false,
        message: 'nodeId, type, details, and status are required',
      });
    }

    const event = await prisma.networkEvent.create({
      data: {
        nodeId,
        type,
        details,
        status,
        timestamp: timestamp ? new Date(timestamp) : undefined,
      },
    });

    const io = (req.app as any).get('io');
    if (io) broadcastNewNetworkEvent(io, event);

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Error creating network event:', error);
    res.status(500).json({ success: false, message: 'Failed to create network event' });
  }
});

// DELETE /api/network/events/:id (Admin)
router.delete('/events/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.networkEvent.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Network event not found' });
    }

    await prisma.networkEvent.delete({ where: { id } });

    const io = (req.app as any).get('io');
    if (io) broadcastNetworkEventDeletion(io, id);

    res.status(200).json({ success: true, message: 'Network event deleted successfully' });
  } catch (error) {
    console.error('Error deleting network event:', error);
    res.status(500).json({ success: false, message: 'Failed to delete network event' });
  }
});

export default router;
