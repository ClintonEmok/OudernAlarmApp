
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { logger } from './logger';

export const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

/**
 * Convert a UTC date to Amsterdam timezone
 */
export const toAmsterdamTime = (date: Date | string): Date => {
  try {
    const utcDate = typeof date === 'string' ? new Date(date) : date;
    return toZonedTime(utcDate, AMSTERDAM_TIMEZONE);
  } catch (error) {
    logger.error('Error converting to Amsterdam time', error);
    return typeof date === 'string' ? new Date(date) : date;
  }
};

/**
 * Format a date in Amsterdam timezone
 */
export const formatInAmsterdamTime = (
  date: Date | string, 
  formatString: string = 'dd-MM-yyyy HH:mm:ss'
): string => {
  try {
    const inputDate = typeof date === 'string' ? new Date(date) : date;
    return formatInTimeZone(inputDate, AMSTERDAM_TIMEZONE, formatString, { locale: nl });
  } catch (error) {
    logger.error('Error formatting Amsterdam time', error);
    return 'Onbekend';
  }
};

/**
 * Get relative time with Amsterdam timezone consideration
 */
export const getRelativeTimeInAmsterdam = (date: Date | string): string => {
  try {
    const inputDate = typeof date === 'string' ? new Date(date) : date;
    const amsterdamDate = toAmsterdamTime(inputDate);
    return formatDistanceToNow(amsterdamDate, { addSuffix: true, locale: nl });
  } catch (error) {
    logger.error('Error getting relative time', error);
    return 'Onbekend tijdstip';
  }
};

/**
 * Get both relative and exact time for Amsterdam timezone
 */
export const getFormattedAmsterdamTime = (date: Date | string) => {
  return {
    relativeTime: getRelativeTimeInAmsterdam(date),
    exactTime: formatInAmsterdamTime(date)
  };
};
