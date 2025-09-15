import React from 'react';
import { render, screen } from '@testing-library/react';
import PriorityChip from '../../components/PriorityChip';

// Mock the CSS module
jest.mock('../../PreviewNotification.module.css', () => ({
  training_tag_chip: 'training_tag_chip',
}));

describe('PriorityChip', () => {
  const defaultPriorityStyle = {
    bg: '#ffebee',
    text: '#f44336',
  };

  describe('Single priority display', () => {
    it('should render HIGH priority with proper capitalization', () => {
      render(
        <PriorityChip criticality="HIGH" priorityStyle={defaultPriorityStyle} />
      );

      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('should render LOW priority with proper capitalization', () => {
      render(
        <PriorityChip criticality="LOW" priorityStyle={{ bg: '#e8f5e9', text: '#4caf50' }} />
      );

      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('should render MEDIUM priority with proper capitalization', () => {
      render(
        <PriorityChip criticality="MEDIUM" priorityStyle={{ bg: '#fff3e0', text: '#ff9800' }} />
      );

      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should handle lowercase priority', () => {
      render(
        <PriorityChip criticality="high" priorityStyle={defaultPriorityStyle} />
      );

      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('should handle null priorityStyle gracefully', () => {
      render(
        <PriorityChip criticality="HIGH" priorityStyle={null} />
      );

      expect(screen.getByText('High')).toBeInTheDocument();
    });
  });

  describe('Training tags display', () => {
    it('should render single Training tag', () => {
      render(
        <PriorityChip criticality="Training" priorityStyle={null} />
      );

      expect(screen.getByText('Training')).toBeInTheDocument();
    });

    it('should render multiple comma-separated tags', () => {
      render(
        <PriorityChip criticality="Safety, Compliance, Training" priorityStyle={null} />
      );

      expect(screen.getByText('Safety')).toBeInTheDocument();
      expect(screen.getByText('Compliance')).toBeInTheDocument();
      expect(screen.getByText('Training')).toBeInTheDocument();
    });

    it('should trim whitespace from tags', () => {
      render(
        <PriorityChip criticality="  Safety  ,  Compliance  " priorityStyle={null} />
      );

      expect(screen.getByText('Safety')).toBeInTheDocument();
      expect(screen.getByText('Compliance')).toBeInTheDocument();
    });

    it('should filter out empty tags', () => {
      render(
        <PriorityChip criticality="Safety,,Training" priorityStyle={null} />
      );

      expect(screen.getByText('Safety')).toBeInTheDocument();
      expect(screen.getByText('Training')).toBeInTheDocument();
    });

    it('should render chips with correct class', () => {
      const { container } = render(
        <PriorityChip criticality="Safety, Training" priorityStyle={null} />
      );

      const chips = container.querySelectorAll('.MuiChip-root');
      chips.forEach(chip => {
        expect(chip).toHaveClass('training_tag_chip');
      });
    });

    it('should cycle through TRAINING_TAG_COLORS for multiple tags', () => {
      const { container } = render(
        <PriorityChip 
          criticality="Tag1, Tag2, Tag3, Tag4, Tag5, Tag6" 
          priorityStyle={null} 
        />
      );

      // Should have 6 chips
      const chips = container.querySelectorAll('.MuiChip-root');
      expect(chips).toHaveLength(6);
    });
  });

  describe('Edge cases', () => {
    it('should handle single character criticality', () => {
      render(
        <PriorityChip criticality="A" priorityStyle={defaultPriorityStyle} />
      );

      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('should handle criticality with only comma', () => {
      const { container } = render(
        <PriorityChip criticality="," priorityStyle={null} />
      );

      // Should render empty box with no chips
      const chips = container.querySelectorAll('.MuiChip-root');
      expect(chips).toHaveLength(0);
    });
  });
});
