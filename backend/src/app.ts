import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { errorHandler } from './shared/middleware/errorHandler';
import { apiLimiter } from './shared/middleware/rateLimiter';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/tasks/task.routes';
import userRoutes from './modules/users/user.routes';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Compression middleware
  app.use(compression());

  // Logging middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Rate limiting
  app.use('/api', apiLimiter);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/tasks', taskRoutes);
  app.use('/api/v1/users', userRoutes);

  // 404 handler - must be after all other routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};