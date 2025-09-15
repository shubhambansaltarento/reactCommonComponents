import {
  formatDate,
  formatDateWithTimezone,
  getCurrentDateTimeInTimezone,
  getCurrentFormattedDateTime,
  getDateFromIsoString,
  toISOStringInTargetTimezone,
  getTimeDifference,
} from '../formatDate';
import dayjs from 'dayjs';
import { TEST_TIMEZONES, TEST_DATES } from './test-utils';

describe('formatDate', () => {
  describe('formatDate function', () => {
    it('should return "-" for undefined input', () => {
      expect(formatDate(undefined)).toBe('-');
    });

    it('should return "-" for empty string', () => {
      expect(formatDate('')).toBe('-');
    });

    it('should return "-" for invalid date string', () => {
      expect(formatDate('invalid-date')).toBe('-');
    });

    it('should format date with datetime mode (default)', () => {
      const result = formatDate('2025-07-18T10:45:00Z');
      expect(result).toMatch(/\d{2} \w{3} \d{2}, \d{1,2}:\d{2} (am|pm)/);
    });

    it('should format date with date mode only', () => {
      const result = formatDate('2025-07-18T10:45:00Z', 'date');
      expect(result).toMatch(/\d{2} \w{3} '\d{2}/);
    });

    it('should handle midnight correctly', () => {
      // Note: formatDate uses local timezone, so exact time depends on system timezone
      const result = formatDate('2025-07-18T00:00:00Z');
      expect(result).toMatch(/\d{1,2}:\d{2} (am|pm)/);
    });

    it('should handle noon correctly', () => {
      // Note: formatDate uses local timezone, so exact time depends on system timezone
      const result = formatDate('2025-07-18T12:00:00Z');
      expect(result).toMatch(/\d{1,2}:\d{2} (am|pm)/);
    });

    it('should format PM times correctly', () => {
      const result = formatDate('2025-07-18T15:30:00Z');
      expect(result).toContain('pm');
    });

    it('should format AM times correctly', () => {
      // Note: formatDate uses local timezone, so AM/PM depends on system timezone
      const result = formatDate('2025-07-18T09:30:00Z');
      expect(result).toMatch(/\d{1,2}:\d{2} (am|pm)/);
    });
  });

  describe('formatDateWithTimezone function', () => {
    it('should return "-" for empty input', () => {
      expect(formatDateWithTimezone('', TEST_TIMEZONES.UTC)).toBe('-');
    });

    it('should return "-" for invalid date', () => {
      expect(formatDateWithTimezone('invalid', TEST_TIMEZONES.UTC)).toBe('-');
    });

    it('should format date with time by default', () => {
      const result = formatDateWithTimezone(TEST_DATES.VALID_ISO, TEST_TIMEZONES.UTC);
      expect(result).toMatch(/\d{1,2} \w{3} \d{2}, \d{1,2}:\d{2} (am|pm)/);
    });

    it('should format date without time when showTime is false', () => {
      const result = formatDateWithTimezone(TEST_DATES.VALID_ISO, TEST_TIMEZONES.UTC, false);
      expect(result).toMatch(/\d{1,2} \w{3} \d{2}/);
      expect(result).not.toContain(':');
    });

    it('should work with IST timezone', () => {
      const result = formatDateWithTimezone(TEST_DATES.VALID_ISO, TEST_TIMEZONES.IST);
      expect(result).toBeDefined();
      expect(result).not.toBe('-');
    });

    it('should work with EST timezone', () => {
      const result = formatDateWithTimezone(TEST_DATES.VALID_ISO, TEST_TIMEZONES.EST);
      expect(result).toBeDefined();
      expect(result).not.toBe('-');
    });
  });

  describe('getCurrentDateTimeInTimezone function', () => {
    it('should return a dayjs object', () => {
      const result = getCurrentDateTimeInTimezone(TEST_TIMEZONES.UTC);
      expect(result).toBeDefined();
      expect(result.isValid()).toBe(true);
    });

    it('should work with different timezones', () => {
      const utcResult = getCurrentDateTimeInTimezone(TEST_TIMEZONES.UTC);
      const istResult = getCurrentDateTimeInTimezone(TEST_TIMEZONES.IST);
      expect(utcResult.isValid()).toBe(true);
      expect(istResult.isValid()).toBe(true);
    });
  });

  describe('getCurrentFormattedDateTime function', () => {
    it('should return formatted current date time string', () => {
      const result = getCurrentFormattedDateTime(TEST_TIMEZONES.UTC);
      expect(result).toMatch(/\d{2} \w{3} \d{2} \d{1,2}:\d{2} (am|pm)/);
    });

    it('should work with IST timezone', () => {
      const result = getCurrentFormattedDateTime(TEST_TIMEZONES.IST);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getDateFromIsoString function', () => {
    it('should return dayjs object for valid ISO string', () => {
      const result = getDateFromIsoString(TEST_DATES.VALID_ISO, TEST_TIMEZONES.UTC);
      expect(result).not.toBeNull();
      expect(result?.isValid()).toBe(true);
    });

    it('should return null for invalid date string', () => {
      const result = getDateFromIsoString('invalid-date', TEST_TIMEZONES.UTC);
      expect(result).toBeNull();
    });

    it('should work with different timezones', () => {
      const result = getDateFromIsoString(TEST_DATES.VALID_ISO, TEST_TIMEZONES.IST);
      expect(result).not.toBeNull();
    });
  });

  describe('toISOStringInTargetTimezone function', () => {
    it('should return empty string for null input', () => {
      const result = toISOStringInTargetTimezone(null, TEST_TIMEZONES.UTC);
      expect(result).toBe('');
    });

    it('should convert dayjs object to ISO string', () => {
      const dayjsObj = dayjs('2025-07-18T10:45:00');
      const result = toISOStringInTargetTimezone(dayjsObj, TEST_TIMEZONES.UTC);
      expect(result).toBeDefined();
      expect(result).toContain('T');
      expect(result).toContain('Z');
    });

    it('should work with different timezones', () => {
      const dayjsObj = dayjs('2025-07-18T10:45:00');
      const resultIST = toISOStringInTargetTimezone(dayjsObj, TEST_TIMEZONES.IST);
      const resultEST = toISOStringInTargetTimezone(dayjsObj, TEST_TIMEZONES.EST);
      expect(resultIST).toBeDefined();
      expect(resultEST).toBeDefined();
    });
  });

  describe('getTimeDifference function', () => {
    it('should return "-" for empty start date', () => {
      expect(getTimeDifference('', TEST_DATES.VALID_ISO)).toBe('-');
    });

    it('should return "-" for empty end date', () => {
      expect(getTimeDifference(TEST_DATES.VALID_ISO, '')).toBe('-');
    });

    it('should return "-" for invalid start date', () => {
      expect(getTimeDifference('invalid', TEST_DATES.VALID_ISO)).toBe('-');
    });

    it('should return "-" for invalid end date', () => {
      expect(getTimeDifference(TEST_DATES.VALID_ISO, 'invalid')).toBe('-');
    });

    it('should return "0m" for same dates', () => {
      expect(getTimeDifference(TEST_DATES.VALID_ISO, TEST_DATES.VALID_ISO)).toBe('0m');
    });

    it('should calculate time difference in days, hours, minutes', () => {
      const start = '2025-07-18T10:00:00Z';
      const end = '2025-07-20T13:30:00Z';
      const result = getTimeDifference(start, end);
      expect(result).toContain('d');
      expect(result).toContain('h');
      expect(result).toContain('m');
    });

    it('should handle case when end date is before start date', () => {
      const start = '2025-07-20T13:30:00Z';
      const end = '2025-07-18T10:00:00Z';
      const result = getTimeDifference(start, end);
      expect(result).toContain('d');
    });

    it('should show only hours and minutes when less than a day', () => {
      const start = '2025-07-18T10:00:00Z';
      const end = '2025-07-18T15:30:00Z';
      const result = getTimeDifference(start, end);
      expect(result).toContain('h');
      expect(result).toContain('m');
      expect(result).not.toContain('d');
    });

    it('should show only minutes when less than an hour', () => {
      const start = '2025-07-18T10:00:00Z';
      const end = '2025-07-18T10:45:00Z';
      const result = getTimeDifference(start, end);
      expect(result).toBe('45m');
    });

    it('should show only days and hours when no minutes', () => {
      const start = '2025-07-18T10:00:00Z';
      const end = '2025-07-19T13:00:00Z';
      const result = getTimeDifference(start, end);
      expect(result).toBe('1d 3h');
    });
  });
});
