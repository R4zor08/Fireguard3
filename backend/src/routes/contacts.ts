import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { broadcastNewContact, broadcastContactUpdate, broadcastContactDeletion } from '../config/socket';

const prisma = new PrismaClient();
const router = Router();

// All contact routes require authentication
router.use(authenticate);

// GET /api/contacts - Get all contacts for the authenticated user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const contacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET /api/contacts/:id - Get a single contact
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const contact = await prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ data: contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// POST /api/contacts - Create a new contact
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, number, type, role } = req.body;

    // Validate required fields
    if (!name || !number || !type) {
      return res.status(400).json({ error: 'Name, number, and type are required' });
    }

    // Validate type
    if (!['official', 'emergency'].includes(type)) {
      return res.status(400).json({ error: 'Type must be "official" or "emergency"' });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        number,
        type,
        role: role || null,
        userId,
      },
    });

    // Broadcast new contact via Socket.io
    const io = (req.app as any).get('io');
    if (io) {
      broadcastNewContact(io, contact);
    }

    res.status(201).json({ data: contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// PUT /api/contacts/:id - Update a contact
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, number, type, role } = req.body;

    // Validate type if provided
    if (type && !['official', 'emergency'].includes(type)) {
      return res.status(400).json({ error: 'Type must be "official" or "emergency"' });
    }

    // Check if contact exists and belongs to user
    const existingContact = await prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!existingContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        name: name || existingContact.name,
        number: number || existingContact.number,
        type: type || existingContact.type,
        role: role !== undefined ? role : existingContact.role,
      },
    });

    // Broadcast contact update via Socket.io
    const io = (req.app as any).get('io');
    if (io) {
      broadcastContactUpdate(io, contact);
    }

    res.json({ data: contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE /api/contacts/:id - Delete a contact
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if contact exists and belongs to user
    const contact = await prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await prisma.contact.delete({
      where: { id },
    });

    // Broadcast contact deletion via Socket.io
    const io = (req.app as any).get('io');
    if (io) {
      broadcastContactDeletion(io, id);
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

export default router;
