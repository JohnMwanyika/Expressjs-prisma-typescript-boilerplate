import { ErrorRequestHandler } from 'express';
import { Prisma } from '../generated/prisma-client-js';
import httpStatus from 'http-status';
import config from '../config/config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';

export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof Prisma.PrismaClientKnownRequestError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

/**
 * Middleware to handle errors in the application.
 * 
 * This middleware captures errors thrown during request processing and sends
 * an appropriate response to the client. It also logs the error in development
 * mode for debugging purposes.
 * 
 * @param err - The error object containing details about the error.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 * 
 * @remarks
 * - In production mode, if the error is not operational, it defaults to an
 *   internal server error with a generic message.
 * - In development mode, the error stack trace is included in the response
 *   for debugging purposes.
 * 
 * @example
 * app.use(errorHandler);
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
