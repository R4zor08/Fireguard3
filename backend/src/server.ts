import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import config from './config';
import routes from './routes';
import { errorHandler, notFound } from './middleware';
import { initSocketIO } from './config/socket';
import { prisma } from './config/database';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server for Socket.io
const httpServer = createServer(app);

// Initialize Socket.io
const io = initSocketIO(httpServer);

// Make io accessible in request handlers
app.set('io', io);

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const uploadsDir = path.resolve(process.cwd(), 'uploads');
const avatarsDir = path.resolve(uploadsDir, 'avatars');
fs.mkdirSync(avatarsDir, { recursive: true });

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Request logging middleware (development only)
if (config.nodeEnv === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to FireGuard3 API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('\n[Server] Shutting down gracefully...');
  
  // Close database connection
  await prisma.$disconnect();
  console.log('[Database] Connection closed');
  
  // Close HTTP server
  httpServer.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('[Server] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception:', error);
  gracefulShutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log('\n========================================');
  console.log('  🔥 FireGuard3 Backend Server');
  console.log('========================================');
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`  Port: ${PORT}`);
  console.log(`  API: http://localhost:${PORT}/api`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log(`  CORS: ${config.cors.origin.join(', ')}`);
  console.log('========================================\n');
});

export { app, httpServer, io };
