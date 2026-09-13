import http from 'http';
import config from './config/index.js';
import connectDB from './config/db.js';
import app from './app.js';
import { attachSocket } from './sockets/index.js';

const server = http.createServer(app);
attachSocket(server);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(config.port, '0.0.0.0', () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`Health check: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();

export default server;
