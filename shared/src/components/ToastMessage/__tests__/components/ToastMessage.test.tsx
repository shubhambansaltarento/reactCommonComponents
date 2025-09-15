import React from 'react';
import { fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders, createDefaultProps } from '../setup';
import { ToastMessage } from '../../index';

// Mock timers for testing duration and animations
jest.useFakeTimers();

describe('ToastMessage', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const props = createDefaultProps();
      expect(() => renderWithProviders(<ToastMessage {...props} />)).not.toThrow();
    });

    it('should render the message text', () => {
      const props = createDefaultProps({ message: 'Hello World' });
      renderWithProviders(<ToastMessage {...props} />);
      
      expect(document.body.textContent).toContain('Hello World');
    });

    it('should render in document.body via portal', () => {
      const props = createDefaultProps();
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      expect(toast).toBeInTheDocument();
      expect(toast?.parentElement).toBe(document.body);
    });

    it('should render close button', () => {
      const props = createDefaultProps();
      renderWithProviders(<ToastMessage {...props} />);
      
      const closeButton = document.querySelector('.toast-close-btn');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('aria-label', 'Close toast');
    });

    it('should have correct role and tabIndex for accessibility', () => {
      const props = createDefaultProps();
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      expect(toast).toHaveAttribute('role', 'button');
      expect(toast).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Toast Types', () => {
    it('should render with info type by default', () => {
      const props = createDefaultProps({ type: undefined });
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      expect(toast).toHaveClass('toast-info');
    });

    it('should render success toast with checkmark icon', () => {
      const props = createDefaultProps({ type: 'success' });
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      expect(toast).toHaveClass('toast-success');
      
      const icon = document.querySelector('.toast-icon');
      expect(icon?.textContent).toBe('✓');
    });

    it('should render error toast with X icon', () => {
      const props = createDefaultProps({ type: 'error' });
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      expect(toast).toHaveClass('toast-error');
      
      const icon = document.querySelector('.toast-icon');
      expect(icon?.textContent).toBe('✕');
    });

    it('should render warning toast with exclamation icon', () => {
      const props = createDefaultProps({ type: 'warning' });
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      expect(toast).toHaveClass('toast-warning');
      
      const icon = document.querySelector('.toast-icon');
      expect(icon?.textContent).toBe('!');
    });

    it('should render info toast with i icon', () => {
      const props = createDefaultProps({ type: 'info' });
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      expect(toast).toHaveClass('toast-info');
      
      const icon = document.querySelector('.toast-icon');
      expect(icon?.textContent).toBe('i');
    });
  });

  describe('Animation States', () => {
    it('should add toast-show class after initial render', () => {
      const props = createDefaultProps();
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      expect(toast).not.toHaveClass('toast-show');
      
      // Fast-forward the show timer (10ms)
      act(() => {
        jest.advanceTimersByTime(10);
      });
      
      expect(toast).toHaveClass('toast-show');
    });

    it('should add toast-hide class when closing', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose });
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      
      // Show the toast
      act(() => {
        jest.advanceTimersByTime(10);
      });
      
      // Click to close
      fireEvent.click(toast!);
      
      expect(toast).toHaveClass('toast-hide');
    });
  });

  describe('Auto Close', () => {
    it('should auto close after default duration (5000ms)', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose });
      renderWithProviders(<ToastMessage {...props} />);
      
      // Should not be called immediately
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Fast-forward to just before duration
      act(() => {
        jest.advanceTimersByTime(4999);
      });
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Fast-forward past duration + animation time
      act(() => {
        jest.advanceTimersByTime(301);
      });
      
      expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
    });

    it('should auto close after custom duration', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose, duration: 2000 });
      renderWithProviders(<ToastMessage {...props} />);
      
      // Fast-forward to just before custom duration
      act(() => {
        jest.advanceTimersByTime(1999);
      });
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Fast-forward past duration + animation time
      act(() => {
        jest.advanceTimersByTime(301);
      });
      
      expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
    });
  });

  describe('Manual Close', () => {
    it('should call onClose when toast is clicked', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose });
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      fireEvent.click(toast!);
      
      // Wait for animation to complete
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
    });

    it('should call onClose when close button is clicked', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose });
      renderWithProviders(<ToastMessage {...props} />);
      
      const closeButton = document.querySelector('.toast-close-btn');
      fireEvent.click(closeButton!);
      
      // Wait for animation to complete
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
    });

    it('should close on Enter key press', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose });
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      fireEvent.keyDown(toast!, { key: 'Enter' });
      
      // Wait for animation to complete
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
    });

    it('should not close on other key press', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose });
      renderWithProviders(<ToastMessage {...props} />);
      
      const toast = document.querySelector('.toast');
      fireEvent.keyDown(toast!, { key: 'Escape' });
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      // Should not be called for Escape key
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should stop propagation when close button is clicked', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose });
      renderWithProviders(<ToastMessage {...props} />);
      
      const closeButton = document.querySelector('.toast-close-btn');
      const stopPropagationSpy = jest.fn();
      
      // Create a custom event with stopPropagation spy
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'stopPropagation', { value: stopPropagationSpy });
      
      closeButton?.dispatchEvent(clickEvent);
      
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('Multiple Toasts', () => {
    it('should render multiple toasts with different ids', () => {
      const props1 = createDefaultProps({ id: 'toast-1', message: 'First toast' });
      const props2 = createDefaultProps({ id: 'toast-2', message: 'Second toast' });
      
      renderWithProviders(
        <>
          <ToastMessage {...props1} />
          <ToastMessage {...props2} />
        </>
      );
      
      const toasts = document.querySelectorAll('.toast');
      expect(toasts.length).toBe(2);
      expect(document.body.textContent).toContain('First toast');
      expect(document.body.textContent).toContain('Second toast');
    });
  });

  describe('Cleanup', () => {
    it('should clear timers on unmount', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose, duration: 5000 });
      const { unmount } = renderWithProviders(<ToastMessage {...props} />);
      
      // Unmount before duration completes
      unmount();
      
      // Fast-forward past duration
      act(() => {
        jest.advanceTimersByTime(6000);
      });
      
      // onClose should not be called since component was unmounted
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very short duration', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose, duration: 100 });
      renderWithProviders(<ToastMessage {...props} />);
      
      act(() => {
        jest.advanceTimersByTime(400);
      });
      
      expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
    });

    it('should handle zero duration', () => {
      const mockOnClose = jest.fn();
      const props = createDefaultProps({ onClose: mockOnClose, duration: 0 });
      renderWithProviders(<ToastMessage {...props} />);
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
    });

    it('should handle empty message', () => {
      const props = createDefaultProps({ message: '' });
      expect(() => renderWithProviders(<ToastMessage {...props} />)).not.toThrow();
    });

    it('should handle long message', () => {
      const longMessage = 'A'.repeat(500);
      const props = createDefaultProps({ message: longMessage });
      renderWithProviders(<ToastMessage {...props} />);
      
      expect(document.body.textContent).toContain(longMessage);
    });

    it('should handle special characters in message', () => {
      const specialMessage = '<script>alert("xss")</script>';
      const props = createDefaultProps({ message: specialMessage });
      renderWithProviders(<ToastMessage {...props} />);
      
      // Should be escaped/rendered as text, not executed
      expect(document.body.textContent).toContain(specialMessage);
    });
  });
});
