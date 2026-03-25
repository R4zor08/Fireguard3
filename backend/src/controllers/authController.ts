import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById, updateUserAvatar } from '../services';
import { asyncHandler, AuthRequest, ApiError } from '../middleware';

// Register a new user
export const register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    if (password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Invalid email format');
    }

    const user = await registerUser(email, password, name, role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  }
);

export const updateAvatar = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const file = (req as any).file as Express.Multer.File | undefined;

    if (!file) {
      throw new ApiError(400, 'Avatar image is required');
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    const user = await updateUserAvatar(req.user.id, avatarUrl);

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: user,
    });
  }
);

// Login user
export const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  }
);

// Get current user profile
export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const user = await getUserById(req.user.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);
