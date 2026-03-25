import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import config from '../config';
import { ApiError } from '../middleware/errorHandler';

// User registration
export const registerUser = async (
  email: string,
  password: string,
  name?: string,
  role?: string
): Promise<{ id: string; email: string; name: string | null; role: string; avatarUrl?: string | null }> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, 'User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role as 'USER' | 'ADMIN' || 'USER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
    } as any,
  });

  return user as any;
};

export const updateUserAvatar = async (
  id: string,
  avatarUrl: string
): Promise<{ id: string; email: string; name: string | null; role: string; avatarUrl?: string | null }> => {
  const user = await prisma.user.update({
    where: { id },
    data: { avatarUrl } as any,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
    } as any,
  });

  return user as any;
};

// User login
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: { id: string; email: string; name: string | null; role: string; avatarUrl?: string | null }; token: string }> => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret as jwt.Secret,
    { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: (user as any).avatarUrl ?? null,
    },
    token,
  };
};

// Get user by ID
export const getUserById = async (
  id: string
): Promise<{ id: string; email: string; name: string | null; role: string; avatarUrl?: string | null } | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
    } as any,
  });

  return user as any;
};
