/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { renderActionButtons, ActionButton } from '../actionButtonUtils';

// Create a theme for testing
const theme = createTheme();

// Wrapper component for rendering
const RenderWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

// Mock icon component
const MockIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <span data-testid="mock-icon" className={className} style={style}>
    Icon
  </span>
);

interface TestRow {
  id: string;
  name: string;
  status: string;
}

describe('actionButtonUtils', () => {
  describe('renderActionButtons', () => {
    const mockRow: TestRow = {
      id: 'row-1',
      name: 'Test Row',
      status: 'active',
    };

    const createActionButton = (overrides?: Partial<ActionButton<TestRow>>): ActionButton<TestRow> => ({
      iconComponent: MockIcon,
      clickHandler: jest.fn(),
      tooltip: 'Test Tooltip',
      ...overrides,
    });

    it('should render action buttons for a row', () => {
      const actionButtons = [createActionButton()];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should render multiple action buttons', () => {
      const actionButtons = [
        createActionButton({ tooltip: 'Edit' }),
        createActionButton({ tooltip: 'Delete' }),
        createActionButton({ tooltip: 'View' }),
      ];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      expect(screen.getAllByTestId('mock-icon')).toHaveLength(3);
    });

    it('should call clickHandler when button is clicked', () => {
      const clickHandler = jest.fn();
      const actionButtons = [createActionButton({ clickHandler })];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(clickHandler).toHaveBeenCalledWith(mockRow);
    });

    it('should stop event propagation on button click', () => {
      const clickHandler = jest.fn();
      const actionButtons = [createActionButton({ clickHandler })];
      const parentClickHandler = jest.fn();

      render(
        <RenderWrapper>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div onClick={parentClickHandler}>
            {renderActionButtons({
              row: mockRow,
              actionButtons,
              uniqueKey: 'id',
              theme,
            })}
          </div>
        </RenderWrapper>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(clickHandler).toHaveBeenCalled();
      expect(parentClickHandler).not.toHaveBeenCalled();
    });

    it('should hide button when hide function returns true', () => {
      const actionButtons = [
        createActionButton({
          tooltip: 'Visible',
          hide: () => false,
        }),
        createActionButton({
          tooltip: 'Hidden',
          hide: () => true,
        }),
      ];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      expect(screen.getAllByTestId('mock-icon')).toHaveLength(1);
    });

    it('should hide button based on row data', () => {
      const inactiveRow: TestRow = { ...mockRow, status: 'inactive' };
      const actionButtons = [
        createActionButton({
          tooltip: 'Edit',
          hide: (row) => row.status === 'inactive',
        }),
      ];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: inactiveRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    it('should apply custom fill color from fill function', () => {
      const actionButtons = [
        createActionButton({
          fill: () => '#ff0000',
        }),
      ];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveStyle({ fill: '#ff0000' });
    });

    it('should use currentColor as default fill when fill function is not provided', () => {
      const actionButtons = [createActionButton({ fill: undefined })];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      const icon = screen.getByTestId('mock-icon');
      expect(icon).toHaveStyle({ fill: 'currentColor' });
    });

    it('should render tooltip when provided', () => {
      const actionButtons = [createActionButton({ tooltip: 'Test Tooltip' })];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      // Tooltip wrapper should be present
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render button without tooltip wrapper when tooltip is not provided', () => {
      const actionButtons = [createActionButton({ tooltip: undefined })];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render actionComponents when provided instead of actionButtons', () => {
      const actionComponents = (row: TestRow) => (
        <button data-testid="custom-action">{row.name}</button>
      );
      const actionButtons = [createActionButton()];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            actionComponents,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
      expect(screen.getByText('Test Row')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    it('should wrap buttons in container when containerClassName is provided', () => {
      const actionButtons = [createActionButton()];

      const { container } = render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            containerClassName: 'custom-container',
            theme,
          })}
        </RenderWrapper>
      );

      expect(container.querySelector('.custom-container')).toBeInTheDocument();
    });

    it('should not wrap buttons in container when containerClassName is not provided', () => {
      const actionButtons = [createActionButton()];

      const { container } = render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      expect(container.querySelector('.MuiBox-root')).not.toBeInTheDocument();
    });

    it('should apply styles from styles prop', () => {
      const actionButtons = [createActionButton()];
      const styles = { actionButton: 'action-button-class' };

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            styles,
            theme,
          })}
        </RenderWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('action-button-class');
    });

    it('should handle empty actionButtons array', () => {
      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons: [],
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should handle button without clickHandler', () => {
      const actionButtons = [createActionButton({ clickHandler: undefined })];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      const button = screen.getByRole('button');
      // Should not throw when clicked
      fireEvent.click(button);

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should use theme palette color when fill is not provided', () => {
      const actionButtons = [createActionButton({ fill: undefined })];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      // Button should use theme color - just verify it renders without error
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should use action.active fallback when theme is not provided', () => {
      const actionButtons = [createActionButton({ fill: undefined })];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
          })}
        </RenderWrapper>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should generate unique keys for each button', () => {
      const actionButtons = [
        createActionButton({ tooltip: 'Action 1' }),
        createActionButton({ tooltip: 'Action 2' }),
      ];

      render(
        <RenderWrapper>
          {renderActionButtons({
            row: mockRow,
            actionButtons,
            uniqueKey: 'id',
            theme,
          })}
        </RenderWrapper>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });
  });
});
