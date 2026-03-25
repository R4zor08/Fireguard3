import { Router } from 'express';
import authRoutes from './authRoutes';
import alertRoutes from './alertRoutes';
import contactsRoutes from './contacts';
import devicesRoutes from './devices';
import householdsRoutes from './households';
import notificationsRoutes from './notifications';
import networkRoutes from './network';
import fireIncidentsRoutes from './fireIncidents';

const router = Router();

// Root API endpoint - list available endpoints
router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FireGuard3 API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get current user profile (requires auth)',
      },
      alerts: {
        'GET /api/alerts': 'Get all alerts with pagination (requires auth)',
        'GET /api/alerts/stats': 'Get alert statistics (requires auth)',
        'GET /api/alerts/recent': 'Get recent alerts (requires auth)',
        'GET /api/alerts/:id': 'Get alert by ID (requires auth)',
        'POST /api/alerts': 'Create new alert (requires auth)',
        'PUT /api/alerts/:id': 'Update alert (requires auth)',
        'DELETE /api/alerts/:id': 'Delete alert (requires auth, admin only)',
      },
      contacts: {
        'GET /api/contacts': 'Get all contacts (requires auth)',
        'GET /api/contacts/:id': 'Get contact by ID (requires auth)',
        'POST /api/contacts': 'Create new contact (requires auth)',
        'PUT /api/contacts/:id': 'Update contact (requires auth)',
        'DELETE /api/contacts/:id': 'Delete contact (requires auth)',
      },
      health: 'GET /api/health - Health check',
    },
  });
});

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FireGuard3 API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/alerts', alertRoutes);
router.use('/contacts', contactsRoutes);
router.use('/devices', devicesRoutes);
router.use('/households', householdsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/network', networkRoutes);
router.use('/fire-incidents', fireIncidentsRoutes);

export default router;
