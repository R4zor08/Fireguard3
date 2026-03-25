import { Router } from 'express';
import { 
  create, 
  getAll, 
  getById, 
  update, 
  remove, 
  getStats, 
  getRecent 
} from '../controllers';
import { authenticate, authorize } from '../middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/alerts/stats - Get alert statistics
router.get('/stats', getStats);

// GET /api/alerts/recent - Get recent alerts
router.get('/recent', getRecent);

// GET /api/alerts - Get all alerts with pagination
router.get('/', getAll);

// GET /api/alerts/:id - Get alert by ID
router.get('/:id', getById);

// POST /api/alerts - Create a new alert
router.post('/', create);

// PUT /api/alerts/:id - Update alert
router.put('/:id', update);

// DELETE /api/alerts/:id - Delete alert (Admin only)
router.delete('/:id', authorize('ADMIN'), remove);

export default router;
