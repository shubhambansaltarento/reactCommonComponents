import React from 'react';
import { InfoGridSection } from '../../InfoGridSection';
import {
  renderWithProviders,
  screen,
  mockSections,
  defaultInfoGridProps,
  resetMocks,
  createSections,
  createRow,
  createCell,
} from '../test-utils';
import { InfoGridRow } from '../../InfoGridSection.interface';

describe('InfoGridSection Component', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('Rendering', () => {
    it('should render the component with sections', () => {
      const { container } = renderWithProviders(
        <InfoGridSection {...defaultInfoGridProps} />
      );

      expect(container.querySelector('.infoGridRootWrapper')).toBeInTheDocument();
    });

    it('should return null when sections is empty', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.empty} />
      );

      expect(container.querySelector('.infoGridRootWrapper')).not.toBeInTheDocument();
    });

    it('should return null when sections is undefined', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={undefined as unknown as InfoGridRow[]} />
      );

      expect(container.querySelector('.infoGridRootWrapper')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = renderWithProviders(
        <InfoGridSection {...defaultInfoGridProps} className="custom-class" />
      );

      expect(container.querySelector('.infoGridRootWrapper')).toHaveClass(
        'custom-class'
      );
    });

    it('should render without className when not provided', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.basic} />
      );

      const wrapper = container.querySelector('.infoGridRootWrapper');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Header Row', () => {
    it('should render header row outside the box', () => {
      const { container } = renderWithProviders(
        <InfoGridSection {...defaultInfoGridProps} />
      );

      const headerSection = container.querySelector('.infoGridHeader');
      expect(headerSection).toBeInTheDocument();
    });

    it('should render all header cells', () => {
      renderWithProviders(<InfoGridSection {...defaultInfoGridProps} />);

      // Header row has 3 columns in our mock data
      expect(screen.getByText('Order Number')).toBeInTheDocument();
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should apply header-specific CSS classes', () => {
      const { container } = renderWithProviders(
        <InfoGridSection {...defaultInfoGridProps} />
      );

      expect(container.querySelector('.headerGrid')).toBeInTheDocument();
      expect(container.querySelector('.headerCell')).toBeInTheDocument();
      expect(container.querySelector('.headerValue')).toBeInTheDocument();
      expect(container.querySelector('.headerLabel')).toBeInTheDocument();
    });
  });

  describe('Body Rows', () => {
    it('should render body rows inside the panel', () => {
      const { container } = renderWithProviders(
        <InfoGridSection {...defaultInfoGridProps} />
      );

      const panel = container.querySelector('.infoGridPanel');
      expect(panel).toBeInTheDocument();
    });

    it('should render all body row cells', () => {
      renderWithProviders(<InfoGridSection {...defaultInfoGridProps} />);

      // Body rows have stats
      expect(screen.getByText('Total Parts')).toBeInTheDocument();
      expect(screen.getByText('Total Deliveries')).toBeInTheDocument();
    });

    it('should render multiple body rows', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.multipleRows} />
      );

      const bodyGrids = container.querySelectorAll('.bodyGrid');
      expect(bodyGrids.length).toBe(4);
    });

    it('should render single body row', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.singleBodyRow} />
      );

      const bodyGrids = container.querySelectorAll('.bodyGrid');
      expect(bodyGrids.length).toBe(1);
    });

    it('should handle header-only sections (no body rows)', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.headerOnly} />
      );

      // Should still render the header
      expect(container.querySelector('.infoGridHeader')).toBeInTheDocument();
      // Panel should be empty or have no body grids
      const bodyGrids = container.querySelectorAll('.bodyGrid');
      expect(bodyGrids.length).toBe(0);
    });
  });

  describe('Title Cells (Section Headers)', () => {
    it('should identify and render title cells with special styling', () => {
      const { container } = renderWithProviders(
        <InfoGridSection {...defaultInfoGridProps} />
      );

      // Title cells have sectionTitleCell class
      const titleCells = container.querySelectorAll('.sectionTitleCell');
      expect(titleCells.length).toBeGreaterThan(0);
    });

    it('should identify totalpartsordered as title key', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Header', value: 'H1' }] },
        {
          columns: [
            { key: 'totalpartsordered', label: 'Total Parts Ordered', value: 100 },
            { label: 'Other', value: 50 },
          ],
        },
      ];

      renderWithProviders(<InfoGridSection sections={sections} />);

      expect(screen.getByText('Total Parts Ordered')).toBeInTheDocument();
    });

    it('should identify totaldeliveries as title key', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Header', value: 'H1' }] },
        {
          columns: [
            { key: 'totaldeliveries', label: 'Total Deliveries', value: 50 },
            { label: 'Other', value: 25 },
          ],
        },
      ];

      renderWithProviders(<InfoGridSection sections={sections} />);

      expect(screen.getByText('Total Deliveries')).toBeInTheDocument();
    });

    it('should handle case-insensitive title key matching', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Header', value: 'H1' }] },
        {
          columns: [
            { key: 'TotalPartsOrdered', label: 'Parts', value: 100 },
            { label: 'Other', value: 50 },
          ],
        },
      ];

      const { container } = renderWithProviders(
        <InfoGridSection sections={sections} />
      );

      // Should still find and render the title cell
      const titleCells = container.querySelectorAll('.sectionTitleCell');
      expect(titleCells.length).toBeGreaterThan(0);
    });

    it('should render row without title if no title key is found', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Header', value: 'H1' }] },
        {
          columns: [
            { key: 'somethingelse', label: 'Something', value: 100 },
            { label: 'Other', value: 50 },
          ],
        },
      ];

      const { container } = renderWithProviders(
        <InfoGridSection sections={sections} />
      );

      // Should still render the body grid
      expect(container.querySelector('.bodyGrid')).toBeInTheDocument();
    });
  });

  describe('Color Classes', () => {
    it('should apply colorClass to cells', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.withColors} />
      );

      expect(container.querySelector('.text-green')).toBeInTheDocument();
    });

    it('should apply is-danger root alert class', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.withColors} />
      );

      const dangerCell = container.querySelector('.infoGridCell.is-danger');
      expect(dangerCell).toBeInTheDocument();
    });

    it('should apply is-warning root alert class', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.withColors} />
      );

      const warningCell = container.querySelector('.infoGridCell.is-warning');
      expect(warningCell).toBeInTheDocument();
    });

    it('should not apply alert class for non-alert colorClass', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Header', value: 'H1' }] },
        {
          columns: [
            { key: 'totalpartsordered', label: 'Parts', value: 100 },
            { label: 'Normal', value: 50, colorClass: 'text-blue' },
          ],
        },
      ];

      const { container } = renderWithProviders(
        <InfoGridSection sections={sections} />
      );

      // Find cells that are not danger or warning
      const cells = container.querySelectorAll('.infoGridCell');
      const nonAlertCells = Array.from(cells).filter(
        (cell) =>
          !cell.classList.contains('is-danger') &&
          !cell.classList.contains('is-warning')
      );
      expect(nonAlertCells.length).toBeGreaterThan(0);
    });
  });

  describe('Color Styles', () => {
    it('should apply inline colorStyle to cells', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.withColorStyles} />
      );

      // Find the cell with inline style
      const cells = container.querySelectorAll('.infoGridCell');
      let foundStyled = false;
      for (const cell of cells) {
        if ((cell as HTMLElement).style.color === 'red') {
          foundStyled = true;
        }
      }
      expect(foundStyled).toBe(true);
    });
  });

  describe('Show Icon Class', () => {
    it('should handle show-icon class in colorClass', () => {
      const { container } = renderWithProviders(
        <InfoGridSection sections={mockSections.withIcon} />
      );

      expect(container.querySelector('.show-icon')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle cells without key property', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Header', value: 'H1' }] },
        {
          columns: [
            { label: 'No Key 1', value: 'A' },
            { label: 'No Key 2', value: 'B' },
          ],
        },
      ];

      const { container } = renderWithProviders(
        <InfoGridSection sections={sections} />
      );

      expect(container.querySelector('.infoGridRootWrapper')).toBeInTheDocument();
      expect(screen.getByText('No Key 1')).toBeInTheDocument();
    });

    it('should handle numeric values', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Count', value: 12345 }] },
      ];

      renderWithProviders(<InfoGridSection sections={sections} />);

      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('should handle string values', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Name', value: 'John Doe' }] },
      ];

      renderWithProviders(<InfoGridSection sections={sections} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle empty string values', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Empty', value: '' }] },
      ];

      renderWithProviders(<InfoGridSection sections={sections} />);

      expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    it('should handle special characters in labels and values', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Price & Tax', value: '$100.00' }] },
      ];

      renderWithProviders(<InfoGridSection sections={sections} />);

      expect(screen.getByText('Price & Tax')).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });

    it('should handle many columns in a row', () => {
      const manyColumns = Array.from({ length: 10 }, (_, i) => ({
        label: `Col ${i}`,
        value: i,
      }));

      const sections: InfoGridRow[] = [{ columns: manyColumns }];

      const { container } = renderWithProviders(
        <InfoGridSection sections={sections} />
      );

      expect(container.querySelectorAll('.headerCell').length).toBe(10);
    });

    it('should handle undefined colorClass', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Header', value: 'H1' }] },
        {
          columns: [
            { key: 'totalpartsordered', label: 'Parts', value: 100 },
            { label: 'No Color', value: 50, colorClass: undefined },
          ],
        },
      ];

      expect(() =>
        renderWithProviders(<InfoGridSection sections={sections} />)
      ).not.toThrow();
    });

    it('should handle undefined colorStyle', () => {
      const sections: InfoGridRow[] = [
        { columns: [{ label: 'Header', value: 'H1' }] },
        {
          columns: [
            { key: 'totalpartsordered', label: 'Parts', value: 100 },
            { label: 'No Style', value: 50, colorStyle: undefined },
          ],
        },
      ];

      expect(() =>
        renderWithProviders(<InfoGridSection sections={sections} />)
      ).not.toThrow();
    });
  });

  describe('Factory Functions', () => {
    it('createCell should create a valid cell', () => {
      const cell = createCell({ label: 'Custom', value: 'Test' });

      expect(cell.label).toBe('Custom');
      expect(cell.value).toBe('Test');
    });

    it('createCell should use defaults', () => {
      const cell = createCell();

      expect(cell.label).toBe('Cell Label');
      expect(cell.value).toBe('Cell Value');
    });

    it('createRow should create a row with specified columns', () => {
      const row = createRow(5);

      expect(row.columns.length).toBe(5);
    });

    it('createSections should create sections with header and body', () => {
      const sections = createSections(3);

      expect(sections.length).toBe(4); // 1 header + 3 body rows
    });
  });

  describe('CSS Structure', () => {
    it('should have correct wrapper structure', () => {
      const { container } = renderWithProviders(
        <InfoGridSection {...defaultInfoGridProps} />
      );

      expect(container.querySelector('.infoGridRootWrapper')).toBeInTheDocument();
      expect(container.querySelector('.infoGridHeader')).toBeInTheDocument();
      expect(container.querySelector('.infoGridPanel')).toBeInTheDocument();
    });

    it('should render cells with correct structure', () => {
      const { container } = renderWithProviders(
        <InfoGridSection {...defaultInfoGridProps} />
      );

      // Check for cell structure
      expect(container.querySelector('.infoGridCell')).toBeInTheDocument();
      expect(container.querySelector('.cellValue')).toBeInTheDocument();
      expect(container.querySelector('.cellLabel')).toBeInTheDocument();
    });

    it('should render value with valueWrap span', () => {
      const { container } = renderWithProviders(
        <InfoGridSection {...defaultInfoGridProps} />
      );

      expect(container.querySelector('.valueWrap')).toBeInTheDocument();
    });
  });
});
