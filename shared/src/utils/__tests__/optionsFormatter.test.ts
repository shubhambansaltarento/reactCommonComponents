import { optionsFormatter } from '../optionsFormatter';
import { createMockOptionsData } from './test-utils';

describe('optionsFormatter', () => {
  describe('Basic functionality', () => {
    it('should format data into options array', () => {
      const data = createMockOptionsData();
      const result = optionsFormatter(data, 'name', 'id');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });

    it('should return objects with label and value properties', () => {
      const data = createMockOptionsData();
      const result = optionsFormatter(data, 'name', 'id');
      
      result.forEach((option) => {
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('value');
      });
    });

    it('should use labelKey for label property', () => {
      const data = createMockOptionsData();
      const result = optionsFormatter(data, 'name', 'id');
      
      expect(result.find((opt) => opt.label === 'Option A')).toBeDefined();
      expect(result.find((opt) => opt.label === 'Option B')).toBeDefined();
      expect(result.find((opt) => opt.label === 'Option C')).toBeDefined();
    });

    it('should use valueKey for value property as string', () => {
      const data = createMockOptionsData();
      const result = optionsFormatter(data, 'name', 'id');
      
      expect(result.find((opt) => opt.value === '1')).toBeDefined();
      expect(result.find((opt) => opt.value === '2')).toBeDefined();
      expect(result.find((opt) => opt.value === '3')).toBeDefined();
    });

    it('should use different keys for label and value', () => {
      const data = createMockOptionsData();
      const result = optionsFormatter(data, 'name', 'code');
      
      expect(result.find((opt) => opt.value === 'A')).toBeDefined();
      expect(result.find((opt) => opt.value === 'B')).toBeDefined();
    });
  });

  describe('Sorting', () => {
    it('should sort options alphabetically by label', () => {
      const data = [
        { id: '1', name: 'Zebra', code: 'Z' },
        { id: '2', name: 'Apple', code: 'A' },
        { id: '3', name: 'Mango', code: 'M' },
      ];
      const result = optionsFormatter(data, 'name', 'id');
      
      expect(result[0].label).toBe('Apple');
      expect(result[1].label).toBe('Mango');
      expect(result[2].label).toBe('Zebra');
    });

    it('should handle case-sensitive sorting', () => {
      const data = [
        { id: '1', name: 'banana', code: 'b' },
        { id: '2', name: 'Apple', code: 'A' },
        { id: '3', name: 'cherry', code: 'c' },
      ];
      const result = optionsFormatter(data, 'name', 'id');
      
      expect(result.length).toBe(3);
    });
  });

  describe('Edge cases', () => {
    it('should return empty array for empty input', () => {
      const result = optionsFormatter([], 'name' as never, 'id' as never);
      expect(result).toEqual([]);
    });

    it('should handle single item', () => {
      const data = [{ id: '1', name: 'Single', code: 'S' }];
      const result = optionsFormatter(data, 'name', 'id');
      
      expect(result.length).toBe(1);
      expect(result[0].label).toBe('Single');
      expect(result[0].value).toBe('1');
    });

    it('should convert numeric values to strings', () => {
      const data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const result = optionsFormatter(data, 'name', 'id');
      
      expect(typeof result[0].value).toBe('string');
      expect(typeof result[1].value).toBe('string');
    });
  });
});
