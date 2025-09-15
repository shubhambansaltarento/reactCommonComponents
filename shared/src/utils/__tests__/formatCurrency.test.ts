import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  describe('Valid inputs', () => {
    it('should format number with default locale and currency (GBP)', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('£1,234.56');
    });

    it('should format string number with default locale and currency', () => {
      const result = formatCurrency('1234.56');
      expect(result).toBe('£1,234.56');
    });

    it('should format with custom locale and currency (USD)', () => {
      const result = formatCurrency(1234.56, 'en-US', 'USD');
      expect(result).toBe('$1,234.56');
    });

    it('should format with INR currency', () => {
      const result = formatCurrency(1234.56, 'en-IN', 'INR');
      expect(result).toContain('1,234.56');
    });

    it('should format zero value', () => {
      const result = formatCurrency(0);
      expect(result).toBe('£0.00');
    });

    it('should format negative numbers', () => {
      const result = formatCurrency(-500.25);
      expect(result).toBe('-£500.25');
    });

    it('should format large numbers', () => {
      const result = formatCurrency(1000000);
      expect(result).toBe('£1,000,000.00');
    });

    it('should format small decimal numbers', () => {
      const result = formatCurrency(0.99);
      expect(result).toBe('£0.99');
    });
  });

  describe('String with non-numeric characters', () => {
    it('should strip non-numeric characters and format', () => {
      const result = formatCurrency('$1,234.56');
      expect(result).toBe('£1,234.56');
    });

    it('should handle string with currency symbol', () => {
      const result = formatCurrency('£500.00');
      expect(result).toBe('£500.00');
    });
  });

  describe('Invalid inputs', () => {
    it('should return empty string for null value', () => {
      const result = formatCurrency(null as any);
      expect(result).toBe('');
    });

    it('should return empty string for undefined value', () => {
      const result = formatCurrency(undefined as any);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = formatCurrency('');
      expect(result).toBe('');
    });

    it('should return empty string for non-numeric string', () => {
      const result = formatCurrency('abc');
      expect(result).toBe('');
    });

    it('should return empty string for string with only special characters', () => {
      const result = formatCurrency('!@#$%');
      expect(result).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('should handle string number with spaces', () => {
      const result = formatCurrency('1234');
      expect(result).toBe('£1,234.00');
    });

    it('should round to 2 decimal places', () => {
      const result = formatCurrency(1234.567);
      expect(result).toBe('£1,234.57');
    });

    it('should handle integer input', () => {
      const result = formatCurrency(100);
      expect(result).toBe('£100.00');
    });
  });
});
