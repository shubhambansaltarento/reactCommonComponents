/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { renderContentWithSupport } from '../renderUtils';

interface TestRow {
  id: string;
  name: string;
  status: string;
  amount: number;
  description: string | null;
}

describe('renderUtils', () => {
  describe('renderContentWithSupport', () => {
    const mockRow: TestRow = {
      id: 'row-1',
      name: 'Test Item',
      status: 'active',
      amount: 100,
      description: 'Test description',
    };

    it('should return the raw value when no transformations are provided', () => {
      const column = { key: 'name' as const };

      const result = renderContentWithSupport(mockRow, column);

      expect(result).toBe('Test Item');
    });

    it('should return dash for null values', () => {
      const rowWithNull = { ...mockRow, description: null };
      const column = { key: 'description' as const };

      const result = renderContentWithSupport(rowWithNull, column);

      expect(result).toBe('-');
    });

    it('should return dash for undefined values', () => {
      const rowWithUndefined = { ...mockRow, description: undefined } as any;
      const column = { key: 'description' as const };

      const result = renderContentWithSupport(rowWithUndefined, column);

      expect(result).toBe('-');
    });

    it('should apply transformFn when provided', () => {
      const column = {
        key: 'amount' as const,
        transformFn: (value: number) => `$${value.toFixed(2)}`,
      };

      const result = renderContentWithSupport(mockRow, column);

      expect(result).toBe('$100.00');
    });

    it('should pass row to transformFn as second argument', () => {
      const transformFn = jest.fn((value: string, row: TestRow) => `${value} - ${row.id}`);
      const column = {
        key: 'name' as const,
        transformFn,
      };

      const result = renderContentWithSupport(mockRow, column);

      expect(transformFn).toHaveBeenCalledWith('Test Item', mockRow);
      expect(result).toBe('Test Item - row-1');
    });

    it('should use renderComponent when provided', () => {
      const column = {
        key: 'name' as const,
        renderComponent: (row: TestRow, value: string) => (
          <span data-testid="custom-render">{value}</span>
        ),
      };

      const result = renderContentWithSupport(mockRow, column);
      const resultElement = result as { props: { 'data-testid': string; children: string } };

      expect(resultElement.props['data-testid']).toBe('custom-render');
      expect(resultElement.props.children).toBe('Test Item');
    });

    it('should prioritize renderComponent over transformFn', () => {
      const transformFn = jest.fn(() => 'transformed');
      const renderComponent = jest.fn((row: TestRow, value: string) => (
        <span>{value} - rendered</span>
      ));
      const column = {
        key: 'name' as const,
        transformFn,
        renderComponent,
      };

      renderContentWithSupport(mockRow, column);

      expect(renderComponent).toHaveBeenCalled();
      expect(transformFn).not.toHaveBeenCalled();
    });

    it('should use customComponents when provided for column key', () => {
      const column = { key: 'status' as const };
      const customComponents = {
        status: (row: TestRow) => (
          <span data-testid="custom-component">{row.status.toUpperCase()}</span>
        ),
      };

      const result = renderContentWithSupport(mockRow, column, customComponents);
      const resultElement = result as { props: { 'data-testid': string; children: string } };

      expect(resultElement.props['data-testid']).toBe('custom-component');
      expect(resultElement.props.children).toBe('ACTIVE');
    });

    it('should prioritize renderComponent over customComponents', () => {
      const customComponentFn = jest.fn(() => <span>Custom Component</span>);
      const renderComponent = jest.fn((row: TestRow, value: string) => (
        <span>Render Component</span>
      ));
      const column = {
        key: 'name' as const,
        renderComponent,
      };
      const customComponents = {
        name: customComponentFn,
      };

      renderContentWithSupport(mockRow, column, customComponents);

      expect(renderComponent).toHaveBeenCalled();
      expect(customComponentFn).not.toHaveBeenCalled();
    });

    it('should prioritize customComponents over transformFn', () => {
      const transformFn = jest.fn(() => 'transformed');
      const customComponentFn = jest.fn((row: TestRow) => (
        <span>Custom: {row.name}</span>
      ));
      const column = {
        key: 'name' as const,
        transformFn,
      };
      const customComponents = {
        name: customComponentFn,
      };

      renderContentWithSupport(mockRow, column, customComponents);

      expect(customComponentFn).toHaveBeenCalled();
      expect(transformFn).not.toHaveBeenCalled();
    });

    it('should handle empty customComponents object', () => {
      const column = { key: 'name' as const };
      const customComponents = {};

      const result = renderContentWithSupport(mockRow, column, customComponents);

      expect(result).toBe('Test Item');
    });

    it('should handle customComponents for non-matching column', () => {
      const column = { key: 'name' as const };
      const customComponents = {
        status: () => <span>Status Component</span>,
      };

      const result = renderContentWithSupport(mockRow, column, customComponents);

      expect(result).toBe('Test Item');
    });

    it('should handle numeric values correctly', () => {
      const column = { key: 'amount' as const };

      const result = renderContentWithSupport(mockRow, column);

      expect(result).toBe(100);
    });

    it('should handle boolean values', () => {
      const rowWithBoolean = { ...mockRow, isActive: true } as any;
      const column = { key: 'isActive' as const };

      const result = renderContentWithSupport(rowWithBoolean, column);

      expect(result).toBe(true);
    });

    it('should handle empty string values (not treated as falsy)', () => {
      const rowWithEmpty = { ...mockRow, name: '' };
      const column = { key: 'name' as const };

      const result = renderContentWithSupport(rowWithEmpty, column);

      expect(result).toBe('');
    });

    it('should handle zero values (not treated as falsy)', () => {
      const rowWithZero = { ...mockRow, amount: 0 };
      const column = { key: 'amount' as const };

      const result = renderContentWithSupport(rowWithZero, column);

      expect(result).toBe(0);
    });

    it('should pass value as second argument to renderComponent', () => {
      const renderComponent = jest.fn((row: TestRow, value: string) => value);
      const column = {
        key: 'name' as const,
        renderComponent,
      };

      renderContentWithSupport(mockRow, column);

      expect(renderComponent).toHaveBeenCalledWith(mockRow, 'Test Item');
    });

    it('should pass row and column to customComponents function', () => {
      const customComponentFn = jest.fn((row: TestRow, col: any) => row.name);
      const column = { key: 'name' as const };
      const customComponents = {
        name: customComponentFn,
      };

      renderContentWithSupport(mockRow, column, customComponents);

      expect(customComponentFn).toHaveBeenCalledWith(mockRow, column);
    });

    it('should handle nested object values', () => {
      const rowWithNested = { 
        ...mockRow, 
        details: { category: 'Electronics' } 
      } as any;
      const column = { key: 'details' as const };

      const result = renderContentWithSupport(rowWithNested, column);

      expect(result).toEqual({ category: 'Electronics' });
    });

    it('should handle array values', () => {
      const rowWithArray = { 
        ...mockRow, 
        tags: ['tag1', 'tag2'] 
      } as any;
      const column = { key: 'tags' as const };

      const result = renderContentWithSupport(rowWithArray, column);

      expect(result).toEqual(['tag1', 'tag2']);
    });
  });
});
