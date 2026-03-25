import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware';
import { broadcastNewNotification, broadcastNotificationDeletion, broadcastNotificationUpdate } from '../config/socket';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// GET /api/notifications - List notifications (optionally filter by read/priority/type)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const type = (req.query.type as string) || undefined;
    const priority = (req.query.priority as string) || undefined;
    const readRaw = (req.query.read as string) || undefined;

    const where: any = {};
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (readRaw === 'true') where.read = true;
    if (readRaw === 'false') where.read = false;

    // If not admin, only return user's notifications
    if (req.user?.role !== 'ADMIN') {
      where.userId = req.user?.id;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// GET /api/notifications/:id - Get notification
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (req.user?.role !== 'ADMIN' && notification.userId && notification.userId !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notification' });
  }
});

// POST /api/notifications - Create notification (Admin)
router.post('/', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { type, title, message, priority, read, userId } = req.body;

    if (!type || !title || !message) {
      return res.status(400).json({ success: false, message: 'type, title, and message are required' });
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        priority,
        read,
        userId,
      },
    });

    const io = (req.app as any).get('io');
    if (io) {
      broadcastNewNotification(io, notification);
    }

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
});

// PUT /api/notifications/:id - Update notification (Admin)
router.put('/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const { type, title, message, priority, read, userId } = req.body;

    const notification = await prisma.notification.update({
      where: { id },
      data: {
        type,
        title,
        message,
        priority,
        read,
        userId,
      },
    });

    const io = (req.app as any).get('io');
    if (io) {
      broadcastNotificationUpdate(io, notification);
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
});

// DELETE /api/notifications/:id - Delete notification (Admin)
router.delete('/:id', authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await prisma.notification.delete({ where: { id } });

    const io = (req.app as any).get('io');
    if (io) {
      broadcastNotificationDeletion(io, id);
    }

    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
});

export default router;
