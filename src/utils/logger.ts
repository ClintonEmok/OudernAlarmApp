
import { env } from './env';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  private getLogLevel(): LogLevel {
    if (env.IS_PRODUCTION) return LogLevel.ERROR;
    if (env.IS_DEVELOPMENT) return LogLevel.DEBUG;
    return LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.getLogLevel();
  }

  error(message: string, error?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${message}`, error);
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(`[INFO] ${message}`, data);
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(`[DEBUG] ${message}`, data);
    }
  }

  // Security-related logs should always be recorded
  security(message: string, data?: any): void {
    console.warn(`[SECURITY] ${message}`, data);
  }
}

export const logger = new Logger();
