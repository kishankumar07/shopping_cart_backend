import { createLogger, transports } from 'winston';
import { AppError } from './app-errors';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app_error.log' })
  ]
});

class ErrorLogger {
  constructor() {}

  async logError(err: unknown): Promise<boolean> {
    console.log('==================== Start Error Logger ===============');
    LogErrors.log({
      private: true,
      level: 'error',
      message: `${new Date()} - ${JSON.stringify(err)}`
    });
    console.log('==================== End Error Logger ===============');
    return false;
  }

  isTrustError(error: unknown): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  }
}

const ErrorHandler:ErrorRequestHandler = async (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errorLogger = new ErrorLogger();

  process.on('uncaughtException', (reason: unknown) => {
    console.log(reason, 'UNHANDLED');
    throw reason; // Handle further if needed
  });

  process.on('unhandledRejection', (error: unknown) => {
    errorLogger.logError(error);
    if (errorLogger.isTrustError(err)) {
      // Restart process if necessary useful in production
    }
  });

  if (err instanceof AppError) {
    await errorLogger.logError(err);
    if (errorLogger.isTrustError(err)) {
      res.status(err.statusCode).json({
        message: err.errorStack || err.message
      });
    } else {
      res.status(err.statusCode).json({
        message: 'An unexpected error occurred. Please try again later.'
      });
    }
  } else {
    next();
  }
};

export default ErrorHandler;
