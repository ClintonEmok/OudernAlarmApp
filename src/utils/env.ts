
import { logger } from './logger';

// Environment configuration utility
export const env = {
  // Mapbox configuration
  MAPBOX_PUBLIC_TOKEN: import.meta.env.VITE_MAPBOX_PUBLIC_KEY || 'pk.eyJ1Ijoic2l0ZWpvYiIsImEiOiJjbWI1YjAyenkyNWYyMmtzYm11MzNzbnY4In0.u0WDvJRRU9bQiNV8WLhQtQ',
  
  // Environment flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // API configuration
  API_BASE_URL: 'https://api.ouderen-alarmering.nl/api',
} as const;

// Security utility functions
export const securityUtils = {
  // Safe logging that respects environment
  log: (message: string, data?: any) => {
    logger.debug(message, data);
  },
  
  // Safe error logging
  error: (message: string, error?: any) => {
    logger.error(message, error);
  },
  
  // Sanitize sensitive data for logging
  sanitizeForLogging: (data: any): any => {
    if (!env.IS_DEVELOPMENT) {
      return '[REDACTED]';
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      // Remove sensitive fields
      const sensitiveFields = ['password', 'token', 'access_token', 'refresh_token', 'authorization'];
      sensitiveFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      });
      return sanitized;
    }
    
    return data;
  }
};
