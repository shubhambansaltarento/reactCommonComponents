import {
  getDateRange,
  getDayRangeFilterOptions,
  ApiResponseStatus,
  dateRangeLabelMapping,
  dateRange,
  DateRangeType,
} from '../baseUtils';
import { mockTranslation, TEST_TIMEZONES } from './test-utils';

describe('baseUtils', () => {
  describe('ApiResponseStatus', () => {
    it('should have SUCCESS status', () => {
      expect(ApiResponseStatus.SUCCESS).toBe('SUCCESS');
    });

    it('should have FAILURE status', () => {
      expect(ApiResponseStatus.FAILURE).toBe('FAILURE');
    });

    it('should have NETWORK_ERROR status', () => {
      expect(ApiResponseStatus.NETWORK_ERROR).toBe('NETWORK_ERROR');
    });
  });

  describe('dateRangeLabelMapping', () => {
    it('should have correct mapping for Today', () => {
      expect(dateRangeLabelMapping['Today']).toBe('COMMON.TODAY');
    });

    it('should have correct mapping for Yesterday', () => {
      expect(dateRangeLabelMapping['Yesterday']).toBe('COMMON.YESTERDAY');
    });

    it('should have correct mapping for Last 7', () => {
      expect(dateRangeLabelMapping['Last 7']).toBe('COMMON.LAST_7_DAYS');
    });

    it('should have correct mapping for Last 30', () => {
      expect(dateRangeLabelMapping['Last 30']).toBe('COMMON.LAST_30_DAYS');
    });

    it('should have correct mapping for This Month', () => {
      expect(dateRangeLabelMapping['This Month']).toBe('COMMON.THIS_MONTH');
    });

    it('should have correct mapping for Last Month', () => {
      expect(dateRangeLabelMapping['Last Month']).toBe('COMMON.LAST_MONTH');
    });

    it('should have correct mapping for Last Year', () => {
      expect(dateRangeLabelMapping['Last Year']).toBe('COMMON.LAST_YEAR');
    });

    it('should have correct mapping for Custom', () => {
      expect(dateRangeLabelMapping['Custom']).toBe('COMMON.CUSTOM');
    });
  });

  describe('dateRange', () => {
    it('should contain all expected date range options', () => {
      expect(dateRange).toContain('Today');
      expect(dateRange).toContain('Yesterday');
      expect(dateRange).toContain('Last 7');
      expect(dateRange).toContain('Last 30');
      expect(dateRange).toContain('This Month');
      expect(dateRange).toContain('Last Month');
      expect(dateRange).toContain('Last Year');
      expect(dateRange).toContain('Custom');
    });
  });

  describe('getDateRange', () => {
    const timezone = TEST_TIMEZONES.UTC;

    it('should return ISO strings for Today', () => {
      const result = getDateRange('Today', timezone);
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
      expect(typeof result.from).toBe('string');
      expect(typeof result.to).toBe('string');
    });

    it('should return ISO strings for Yesterday', () => {
      const result = getDateRange('Yesterday', timezone);
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
    });

    it('should return ISO strings for This Week', () => {
      const result = getDateRange('This Week', timezone);
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
    });

    it('should return ISO strings for Last Month', () => {
      const result = getDateRange('Last Month', timezone);
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
    });

    it('should return ISO strings for Last 7', () => {
      const result = getDateRange('Last 7', timezone);
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
    });

    it('should return ISO strings for Last 30', () => {
      const result = getDateRange('Last 30', timezone);
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
    });

    it('should return ISO strings for This Month', () => {
      const result = getDateRange('This Month', timezone);
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
    });

    it('should return ISO strings for Last Year', () => {
      const result = getDateRange('Last Year', timezone);
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
    });

    it('should return null values for Custom', () => {
      const result = getDateRange('Custom', timezone);
      expect(result.from).toBeNull();
      expect(result.to).toBeNull();
    });

    it('should throw error for invalid date range', () => {
      expect(() => getDateRange('Invalid' as DateRangeType, timezone)).toThrow('Invalid date range');
    });

    it('should return dayjs objects when keepPickerValue is true for Today', () => {
      const result = getDateRange('Today', timezone, true);
      expect(result.from).toBeDefined();
      expect(result.to).toBeDefined();
      expect(typeof result.from).toBe('object');
      expect(typeof result.to).toBe('object');
    });

    it('should return dayjs objects when keepPickerValue is true for Yesterday', () => {
      const result = getDateRange('Yesterday', timezone, true);
      expect(typeof result.from).toBe('object');
    });

    it('should return dayjs objects when keepPickerValue is true for This Week', () => {
      const result = getDateRange('This Week', timezone, true);
      expect(typeof result.from).toBe('object');
    });

    it('should return dayjs objects when keepPickerValue is true for Last Month', () => {
      const result = getDateRange('Last Month', timezone, true);
      expect(typeof result.from).toBe('object');
    });

    it('should return dayjs objects when keepPickerValue is true for Last 7', () => {
      const result = getDateRange('Last 7', timezone, true);
      expect(typeof result.from).toBe('object');
    });

    it('should return dayjs objects when keepPickerValue is true for Last 30', () => {
      const result = getDateRange('Last 30', timezone, true);
      expect(typeof result.from).toBe('object');
    });

    it('should return dayjs objects when keepPickerValue is true for This Month', () => {
      const result = getDateRange('This Month', timezone, true);
      expect(typeof result.from).toBe('object');
    });

    it('should return dayjs objects when keepPickerValue is true for Last Year', () => {
      const result = getDateRange('Last Year', timezone, true);
      expect(typeof result.from).toBe('object');
    });

    it('should work with different timezones', () => {
      const resultIST = getDateRange('Today', TEST_TIMEZONES.IST);
      const resultEST = getDateRange('Today', TEST_TIMEZONES.EST);
      expect(resultIST.from).toBeDefined();
      expect(resultEST.from).toBeDefined();
    });
  });

  describe('getDayRangeFilterOptions', () => {
    it('should return array of options with label and value', () => {
      const options = getDayRangeFilterOptions(mockTranslation as any);
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBe(dateRange.length);
    });

    it('should have correct structure for each option', () => {
      const options = getDayRangeFilterOptions(mockTranslation as any);
      options.forEach((option) => {
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('value');
      });
    });

    it('should include Today option', () => {
      const options = getDayRangeFilterOptions(mockTranslation as any);
      const todayOption = options.find((opt) => opt.value === 'Today');
      expect(todayOption).toBeDefined();
    });

    it('should include Custom option', () => {
      const options = getDayRangeFilterOptions(mockTranslation as any);
      const customOption = options.find((opt) => opt.value === 'Custom');
      expect(customOption).toBeDefined();
    });
  });
});
