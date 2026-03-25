import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { register, login, getProfile, updateAvatar } from '../controllers';
import { authenticate } from '../middleware';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(process.cwd(), 'uploads', 'avatars'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.png';
    const safeExt = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext) ? ext : '.png';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error('Only PNG, JPG, and WEBP images are allowed'));
      return;
    }
    cb(null, true);
  },
});

// Public routes
// POST /api/auth/register - Register a new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// Protected routes
// GET /api/auth/profile - Get current user profile
router.get('/profile', authenticate, getProfile);

// POST /api/auth/avatar - Upload and update current user's avatar
router.post('/avatar', authenticate, upload.single('avatar'), updateAvatar);

export default router;
