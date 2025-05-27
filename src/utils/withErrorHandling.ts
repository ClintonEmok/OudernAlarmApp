
import { ServiceError, errorHandler } from '../types/errors';

export function withErrorHandling<T extends any[], R>(
  serviceName: string,
  operationName: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const serviceError = new ServiceError(
        `Failed to ${operationName} in ${serviceName}`,
        serviceName,
        operationName,
        error instanceof Error ? error : new Error(String(error))
      );
      
      errorHandler.handleError(serviceError, `${serviceName}.${operationName}`);
      throw serviceError;
    }
  };
}
