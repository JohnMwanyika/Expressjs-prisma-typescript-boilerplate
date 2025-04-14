/**
 * Entry point of the application. This script initializes the server, connects to the database,
 * and sets up handlers for process signals and unexpected errors.
 *
 * - Connects to the SQL database using Prisma.
 * - Starts the HTTP server on the configured port.
 * - Handles graceful shutdown of the server on process termination signals.
 * - Logs important events such as server start, database connection, and errors.
 *
 * Dependencies:
 * - `prisma`: Prisma client instance for database connection.
 * - `config`: Configuration object containing application settings.
 * - `logger`: Logger instance for logging messages.
 * - `httpServer`: HTTP server instance to handle incoming requests.
 *
 * Process Handlers:
 * - `exitHandler`: Gracefully shuts down the server and exits the process.
 * - `unexpectedErrorHandler`: Logs unexpected errors and triggers the exit handler.
 * - Listens for `uncaughtException`, `unhandledRejection`, and `SIGTERM` signals.
 */
import { Server } from 'http';
import prisma from './client';
import config from './config/config';
import logger from './config/logger';
import httpServer from './app';

let server: Server;

prisma.$connect().then(() => {
  logger.info('Connected to SQL Database');
  server = httpServer.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
