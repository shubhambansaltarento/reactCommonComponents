import React from 'react';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  renderWithProviders,
  createDownloadTemplateProps,
} from '../test-utils';
import DownloadTemplate from '../../components/DownloadTemplate';

describe('DownloadTemplate', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const props = createDownloadTemplateProps();
      expect(() => renderWithProviders(<DownloadTemplate {...props} />)).not.toThrow();
    });

    it('should render with default config', () => {
      const props = createDownloadTemplateProps();
      const { getByText } = renderWithProviders(<DownloadTemplate {...props} />);
      
      expect(getByText('Template')).toBeInTheDocument();
      expect(getByText('You can download the template to upload data in the correct format')).toBeInTheDocument();
      expect(getByText('Download Template')).toBeInTheDocument();
    });

    it('should render with custom config', () => {
      const props = createDownloadTemplateProps({
        config: {
          templateSectionTitle: 'Custom Title',
          templateDescription: 'Custom description',
          downloadButtonLabel: 'Custom Download'
        }
      });
      const { getByText } = renderWithProviders(<DownloadTemplate {...props} />);
      
      expect(getByText('Custom Title')).toBeInTheDocument();
      expect(getByText('Custom description')).toBeInTheDocument();
      expect(getByText('Custom Download')).toBeInTheDocument();
    });

    it('should merge partial config with defaults', () => {
      const props = createDownloadTemplateProps({
        config: {
          templateSectionTitle: 'Only Title'
        }
      });
      const { getByText } = renderWithProviders(<DownloadTemplate {...props} />);
      
      expect(getByText('Only Title')).toBeInTheDocument();
      expect(getByText('You can download the template to upload data in the correct format')).toBeInTheDocument();
    });
  });

  describe('Button Interaction', () => {
    it('should call onCTAClick when download button is clicked', () => {
      const mockOnCTAClick = jest.fn();
      const props = createDownloadTemplateProps({ onCTAClick: mockOnCTAClick });
      const { getByText } = renderWithProviders(<DownloadTemplate {...props} />);
      
      const downloadButton = getByText('Download Template');
      fireEvent.click(downloadButton);
      
      expect(mockOnCTAClick).toHaveBeenCalledTimes(1);
    });

    it('should not throw when onCTAClick is undefined', () => {
      const props = createDownloadTemplateProps({ onCTAClick: undefined });
      const { getByText } = renderWithProviders(<DownloadTemplate {...props} />);
      
      const downloadButton = getByText('Download Template');
      expect(() => fireEvent.click(downloadButton)).not.toThrow();
    });
  });

  describe('Styling', () => {
    it('should render template section container', () => {
      const props = createDownloadTemplateProps();
      const { container } = renderWithProviders(<DownloadTemplate {...props} />);
      
      // Check that the component renders a container div
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render h3 for title', () => {
      const props = createDownloadTemplateProps();
      const { container } = renderWithProviders(<DownloadTemplate {...props} />);
      
      const title = container.querySelector('h3');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toBe('Template');
    });

    it('should render p for description', () => {
      const props = createDownloadTemplateProps();
      const { container } = renderWithProviders(<DownloadTemplate {...props} />);
      
      const description = container.querySelector('p');
      expect(description).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty config', () => {
      const props = createDownloadTemplateProps({ config: {} });
      const { getByText } = renderWithProviders(<DownloadTemplate {...props} />);
      
      // Should use defaults
      expect(getByText('Template')).toBeInTheDocument();
    });

    it('should handle undefined config', () => {
      const props = createDownloadTemplateProps({ config: undefined });
      const { getByText } = renderWithProviders(<DownloadTemplate {...props} />);
      
      expect(getByText('Template')).toBeInTheDocument();
    });

    it('should use "Download" as fallback when downloadButtonLabel is falsy', () => {
      const props = createDownloadTemplateProps({
        config: {
          downloadButtonLabel: ''
        }
      });
      const { getByText } = renderWithProviders(<DownloadTemplate {...props} />);
      
      expect(getByText('Download')).toBeInTheDocument();
    });
  });
});
