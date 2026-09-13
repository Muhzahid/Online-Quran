import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';
import * as messageService from '../services/messageService.js';

export const attachSocket = (httpServer) => {
  const io = new Server(httpServer, { cors: { origin: config.clientUrl, credentials: true } });
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id).select('_id name');
      if (!user) return next(new Error('Unauthorized'));
      socket.user = user;
      next();
    } catch { next(new Error('Unauthorized')); }
  });
  io.on('connection', (socket) => {
    socket.join(`user:${socket.user._id}`);
    socket.on('conversation:join', (conversationId) => socket.join(`conversation:${conversationId}`));
    socket.on('message:send', async ({ conversationId, body }, callback) => {
      try {
        const message = await messageService.sendMessage(conversationId, socket.user._id, body);
        io.to(`conversation:${conversationId}`).emit('message:new', message);
        callback?.({ success: true, message });
      } catch (error) { callback?.({ success: false, message: error.message }); }
    });
    socket.on('typing', ({ conversationId, isTyping }) => socket.to(`conversation:${conversationId}`).emit('typing', { userId: socket.user._id, isTyping }));
  });
  return io;
};