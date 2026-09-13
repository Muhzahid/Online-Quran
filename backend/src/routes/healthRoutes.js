import { Router } from 'express';
import mongoose from 'mongoose';
import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    }[dbState] || 'unknown';

    sendSuccess(res, {
      message: 'Quran Academy API is running',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        environment: process.env.NODE_ENV || 'development',
      },
    });
  })
);

export default router;
