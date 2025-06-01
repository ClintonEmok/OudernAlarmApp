
import { logger } from '../utils/logger';

export class ServiceError extends Error {
  constructor(
    message: string,
    public service: string,
    public operation: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export interface ErrorHandler {
  handleError(error: Error, context?: string): void;
}

export class DefaultErrorHandler implements ErrorHandler {
  handleError(error: Error, context = 'Unknown'): void {
    logger.error(`[${context}] Error`, error);
    
    if (error instanceof ServiceError) {
      logger.error(`Service: ${error.service}, Operation: ${error.operation}`);
      if (error.originalError) {
        logger.error('Original error', error.originalError);
      }
    }
  }
}

export const errorHandler = new DefaultErrorHandler();
