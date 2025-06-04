/**
 * TimeZoneService Class
 * 
 * Provides time zone conversion and local time calculations.
 * Handles international date/time operations with proper timezone awareness.
 */
import { Logger } from '../logger';

export class TimeZoneService {
  private logger: Logger;
  private timeZoneCache: Map<string, TimeZoneInfo>;
  
  /**
   * Creates a new time zone service
   * 
   * @param logger - Optional logger instance
   */
  constructor(logger?: Logger) {
    this.logger = logger || new Logger('TimeZoneService');
    this.timeZoneCache = new Map<string, TimeZoneInfo>();
    
    this.logger.debug('TimeZoneService initialized');
  }
  
  /**
   * Gets local time for a time zone
   * 
   * @param timeZone - Time zone identifier (IANA format)
   * @param date - Optional date to convert (defaults to now)
   * @returns Local time in the specified time zone
   */
  getLocalTime(timeZone: string, date?: Date): Date {
    try {
      // Use provided date or current time
      const baseDate = date || new Date();
      
      // Return a date object representing the same moment in the target time zone
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      };
      
      // Format the date in the target time zone
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(baseDate);
      
      // Extract the date components from the formatter parts
      const dateComponents = this.extractDateComponents(parts);
      
      // Create a new date with the extracted components
      // Note: Month is 0-indexed in JavaScript Date
      const localDate = new Date(
        dateComponents.year,
        dateComponents.month - 1,
        dateComponents.day,
        dateComponents.hour,
        dateComponents.minute,
        dateComponents.second
      );
      
      return localDate;
    } catch (error) {
      this.handleError('getLocalTime', error, { timeZone });
      
      // Fallback to current UTC time
      return new Date();
    }
  }
  
  /**
   * Converts a date from one time zone to another
   * 
   * @param date - Date to convert
   * @param sourceTimeZone - Source time zone
   * @param targetTimeZone - Target time zone
   * @returns Converted date
   */
  convertTimeZone(date: Date, sourceTimeZone: string, targetTimeZone: string): Date {
    try {
      // Get the source time zone offset
      const sourceOffset = this.getTimeZoneOffset(sourceTimeZone, date);
      
      // Get the target time zone offset
      const targetOffset = this.getTimeZoneOffset(targetTimeZone, date);
      
      // Calculate the offset difference in milliseconds
      const offsetDifference = (targetOffset - sourceOffset) * 60 * 1000;
      
      // Apply the offset difference to the date
      return new Date(date.getTime() + offsetDifference);
    } catch (error) {
      this.handleError('convertTimeZone', error, { sourceTimeZone, targetTimeZone });
      
      // Return the original date as fallback
      return date;
    }
  }
  
  /**
   * Formats a date for a specific time zone and locale
   * 
   * @param date - Date to format
   * @param timeZone - Time zone identifier (IANA format)
   * @param locale - Locale identifier (defaults to en-US)
   * @param options - Additional formatting options
   * @returns Formatted date string
   */
  formatDate(
    date: Date,
    timeZone: string,
    locale: string = 'en-US',
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    try {
      // Merge default options with provided options
      const formatOptions: Intl.DateTimeFormatOptions = {
        timeZone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        ...options
      };
      
      // Create formatter and format date
      const formatter = new Intl.DateTimeFormat(locale, formatOptions);
      return formatter.format(date);
    } catch (error) {
      this.handleError('formatDate', error, { timeZone, locale });
      
      // Return ISO string as fallback
      return date.toISOString();
    }
  }
  
  /**
   * Gets time zone offset in minutes
   * 
   * @param timeZone - Time zone identifier (IANA format)
   * @param date - Optional date (defaults to now)
   * @returns Time zone offset in minutes
   */
  getTimeZoneOffset(timeZone: string, date: Date = new Date()): number {
    try {
      // Check cache first
      const cacheKey = `${timeZone}:${date.getTime()}`;
      if (this.timeZoneCache.has(cacheKey)) {
        return this.timeZoneCache.get(cacheKey)!.offsetMinutes;
      }
      
      // Use Intl.DateTimeFormat to get the time zone offset
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'short',
        hour12: false,
        hour: 'numeric'
      });
      
      // Format the date in the target time zone
      const formatted = formatter.format(date);
      
      // Parse the offset from the formatted string
      const match = formatted.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      
      if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        const hours = parseInt(match[2], 10) || 0;
        const minutes = parseInt(match[3], 10) || 0;
        const offset = sign * (hours * 60 + minutes);
        
        // Cache the result
        this.timeZoneCache.set(cacheKey, {
          timeZone,
          date: new Date(date),
          offsetMinutes: offset
        });
        
        return offset;
      }
      
      // Alternative approach using getLocalTime
      const localTime = this.getLocalTime(timeZone, date);
      const utcTime = new Date(date.getTime());
      
      // Calculate the offset in minutes
      const offsetMilliseconds = localTime.getTime() - utcTime.getTime();
      const offsetMinutes = Math.round(offsetMilliseconds / (60 * 1000));
      
      // Cache the result
      this.timeZoneCache.set(cacheKey, {
        timeZone,
        date: new Date(date),
        offsetMinutes
      });
      
      return offsetMinutes;
    } catch (error) {
      this.handleError('getTimeZoneOffset', error, { timeZone });
      return 0; // Fallback to UTC
    }
  }
  
  /**
   * Gets time zone abbreviation
   * 
   * @param timeZone - Time zone identifier (IANA format)
   * @param date - Optional date (defaults to now)
   * @returns Time zone abbreviation
   */
  getTimeZoneAbbreviation(timeZone: string, date: Date = new Date()): string {
    try {
      // Use Intl.DateTimeFormat to get the time zone abbreviation
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'short'
      });
      
      // Format the date and extract the time zone abbreviation
      const formatted = formatter.format(date);
      const match = formatted.match(/\s([A-Z]{3,5})$/);
      
      if (match) {
        return match[1];
      }
      
      // Fallback to using long time zone name
      const longFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'long'
      });
      
      const longFormatted = longFormatter.format(date);
      const longMatch = longFormatted.match(/\s([A-Za-z\s]+)$/);
      
      if (longMatch) {
        // Extract first letters of each word for abbreviation
        const words = longMatch[1].trim().split(/\s+/);
        return words.map(word => word.charAt(0).toUpperCase()).join('');
      }
      
      return 'UTC'; // Default fallback
    } catch (error) {
      this.handleError('getTimeZoneAbbreviation', error, { timeZone });
      return 'UTC'; // Fallback to UTC
    }
  }
  
  /**
   * Checks if a date is in daylight saving time
   * 
   * @param timeZone - Time zone identifier (IANA format)
   * @param date - Optional date (defaults to now)
   * @returns Whether date is in daylight saving time
   */
  isDaylightSavingTime(timeZone: string, date: Date = new Date()): boolean {
    try {
      // Get time zone offset for current date
      const currentOffset = this.getTimeZoneOffset(timeZone, date);
      
      // Get time zone offset for a date definitely in standard time (January)
      const januaryDate = new Date(date.getFullYear(), 0, 1);
      const januaryOffset = this.getTimeZoneOffset(timeZone, januaryDate);
      
      // Get time zone offset for a date definitely in DST (July)
      const julyDate = new Date(date.getFullYear(), 6, 1);
      const julyOffset = this.getTimeZoneOffset(timeZone, julyDate);
      
      // If all offsets are the same, the time zone doesn't observe DST
      if (januaryOffset === julyOffset) {
        return false;
      }
      
      // Otherwise, check if current offset matches the summer offset
      const summerOffset = Math.max(januaryOffset, julyOffset);
      return currentOffset === summerOffset;
    } catch (error) {
      this.handleError('isDaylightSavingTime', error, { timeZone });
      return false; // Fallback
    }
  }
  
  /**
   * Gets current time in different formats
   * 
   * @param timeZone - Time zone identifier (IANA format)
   * @returns Current time in different formats
   */
  getCurrentTimeFormats(timeZone: string): TimeFormats {
    try {
      const now = new Date();
      const localTime = this.getLocalTime(timeZone, now);
      
      return {
        iso: localTime.toISOString(),
        local: this.formatDate(now, timeZone),
        time: this.formatDate(now, timeZone, 'en-US', { 
          hour: 'numeric', 
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        }),
        date: this.formatDate(now, timeZone, 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        offset: this.getTimeZoneOffset(timeZone, now),
        abbreviation: this.getTimeZoneAbbreviation(timeZone, now),
        isDST: this.isDaylightSavingTime(timeZone, now)
      };
    } catch (error) {
      this.handleError('getCurrentTimeFormats', error, { timeZone });
      
      // Fallback to basic formats
      const now = new Date();
      return {
        iso: now.toISOString(),
        local: now.toString(),
        time: now.toTimeString(),
        date: now.toDateString(),
        offset: 0,
        abbreviation: 'UTC',
        isDST: false
      };
    }
  }
  
  /**
   * Extracts date components from DateTimeFormat parts
   * 
   * @param parts - DateTimeFormat parts
   * @returns Date components
   */
  private extractDateComponents(parts: Intl.DateTimeFormatPart[]): DateComponents {
    const components: Partial<DateComponents> = {};
    
    // Extract components from parts
    parts.forEach(part => {
      switch (part.type) {
        case 'year':
          components.year = parseInt(part.value, 10);
          break;
        case 'month':
          components.month = parseInt(part.value, 10);
          break;
        case 'day':
          components.day = parseInt(part.value, 10);
          break;
        case 'hour':
          components.hour = parseInt(part.value, 10);
          break;
        case 'minute':
          components.minute = parseInt(part.value, 10);
          break;
        case 'second':
          components.second = parseInt(part.value, 10);
          break;
      }
    });
    
    // Set defaults for any missing components
    return {
      year: components.year ?? new Date().getFullYear(),
      month: components.month ?? 1,
      day: components.day ?? 1,
      hour: components.hour ?? 0,
      minute: components.minute ?? 0,
      second: components.second ?? 0
    };
  }
  
  /**
   * Error handling with context
   */
  private handleError(methodName: string, error: unknown, context: Record<string, any> = {}): void {
    this.logger.error(`Error in TimeZoneService.${methodName}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context
    });
  }
}

/**
 * Interface for date components
 */
export interface DateComponents {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/**
 * Interface for time zone info
 */
export interface TimeZoneInfo {
  timeZone: string;
  date: Date;
  offsetMinutes: number;
}

/**
 * Interface for time formats
 */
export interface TimeFormats {
  iso: string;
  local: string;
  time: string;
  date: string;
  offset: number;
  abbreviation: string;
  isDST: boolean;
} 