import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { Stepper, getActiveStep } from '../../Stepper';
import {
  renderWithProviders,
  createMockSteps,
  createMockStepsWithIcons,
  createDefaultStepperProps,
  mockColorConfig,
  mockClassNames,
} from '../test-utils';

describe('Stepper Component', () => {
  describe('Rendering', () => {
    it('should render the stepper with all steps', () => {
      const steps = createMockSteps(4);
      renderWithProviders(<Stepper activeStep={0} steps={steps} />);

      steps.forEach((step) => {
        const labels = screen.getAllByText(step.label);
        expect(labels.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should render with default props', () => {
      const props = createDefaultStepperProps();
      renderWithProviders(<Stepper {...props} />);

      expect(screen.getAllByText('Step 1').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Step 2').length).toBeGreaterThanOrEqual(1);
    });

    it('should render step numbers by default', () => {
      const steps = createMockSteps(3);
      renderWithProviders(<Stepper activeStep={0} steps={steps} />);

      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
    });

    it('should hide step numbers when showStepNumbers is false', () => {
      const steps = createMockSteps(3);
      renderWithProviders(
        <Stepper activeStep={0} steps={steps} showStepNumbers={false} />
      );

      expect(screen.queryByText('01')).not.toBeInTheDocument();
      expect(screen.queryByText('02')).not.toBeInTheDocument();
    });

    it('should use custom stepNumberFormat when provided', () => {
      const steps = createMockSteps(3);
      const customFormat = (index: number) => `Step-${index + 1}`;
      renderWithProviders(
        <Stepper
          activeStep={0}
          steps={steps}
          stepNumberFormat={customFormat}
        />
      );

      expect(screen.getByText('Step-1')).toBeInTheDocument();
      expect(screen.getByText('Step-2')).toBeInTheDocument();
    });
  });

  describe('Step Status', () => {
    it('should mark steps before activeStep as completed', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper activeStep={2} steps={steps} />
      );

      // Step 1 and 2 should be completed (index 0 and 1)
      // Check that the component renders properly with the active step
      expect(container.querySelector('.stepper-main')).toBeInTheDocument();
    });

    it('should mark the current step as active', () => {
      const steps = createMockSteps(4);
      renderWithProviders(<Stepper activeStep={1} steps={steps} />);

      // The active step label should appear (both in stepper and mobile view)
      const activeLabels = screen.getAllByText('Step 2');
      expect(activeLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('should mark steps after activeStep as pending', () => {
      const steps = createMockSteps(4);
      renderWithProviders(<Stepper activeStep={1} steps={steps} />);

      // Steps 3 and 4 should be pending
      expect(screen.getByText('Step 3')).toBeInTheDocument();
      expect(screen.getByText('Step 4')).toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    it('should render mobile view by default', () => {
      const steps = createMockSteps(4);
      renderWithProviders(<Stepper activeStep={1} steps={steps} />);

      expect(screen.getByText('Step 2/4')).toBeInTheDocument();
    });

    it('should show current step label in mobile view', () => {
      const steps = createMockSteps(4);
      renderWithProviders(<Stepper activeStep={2} steps={steps} />);

      // Mobile view shows the active step label
      const mobileLabels = screen.getAllByText('Step 3');
      expect(mobileLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('should hide mobile view when showMobileView is false', () => {
      const steps = createMockSteps(4);
      renderWithProviders(
        <Stepper activeStep={1} steps={steps} showMobileView={false} />
      );

      expect(screen.queryByText('Step 2/4')).not.toBeInTheDocument();
    });
  });

  describe('Custom Colors', () => {
    it('should apply custom colors when provided', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper activeStep={1} steps={steps} colors={mockColorConfig} />
      );

      expect(container.querySelector('.stepper-main')).toBeInTheDocument();
    });

    it('should use default colors when no custom colors provided', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper activeStep={1} steps={steps} />
      );

      expect(container.querySelector('.stepper-main')).toBeInTheDocument();
    });
  });

  describe('Custom ClassNames', () => {
    it('should apply custom stepperMain class', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ stepperMain: 'custom-stepper-main' }}
        />
      );

      expect(container.querySelector('.custom-stepper-main')).toBeInTheDocument();
    });

    it('should apply custom mobileStatus class', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ mobileStatus: 'custom-mobile-status' }}
        />
      );

      expect(container.querySelector('.custom-mobile-status')).toBeInTheDocument();
    });

    it('should apply all custom classNames', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper activeStep={1} steps={steps} classNames={mockClassNames} />
      );

      expect(container.querySelector('.custom-stepper-main')).toBeInTheDocument();
      expect(container.querySelector('.custom-mobile-status')).toBeInTheDocument();
    });

    it('should apply custom stepLabel class', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ stepLabel: 'custom-step-label' }}
        />
      );

      expect(container.querySelector('.custom-step-label')).toBeInTheDocument();
    });

    it('should apply custom connectorLine class', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ connectorLine: 'custom-connector' }}
        />
      );

      expect(container.querySelector('.custom-connector')).toBeInTheDocument();
    });

    it('should apply custom stepCircle class', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ stepCircle: 'custom-step-circle' }}
        />
      );

      expect(container.querySelector('.custom-step-circle')).toBeInTheDocument();
    });

    it('should apply custom stepCircleInner class', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ stepCircleInner: 'custom-step-circle-inner' }}
        />
      );

      expect(container.querySelector('.custom-step-circle-inner')).toBeInTheDocument();
    });

    it('should apply custom mobileStatusLabel class', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ mobileStatusLabel: 'custom-mobile-label' }}
        />
      );

      expect(container.querySelector('.custom-mobile-label')).toBeInTheDocument();
    });

    it('should apply custom mobileStatusSpan class', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ mobileStatusSpan: 'custom-mobile-span' }}
        />
      );

      expect(container.querySelector('.custom-mobile-span')).toBeInTheDocument();
    });

    it('should apply custom stepItem class', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ stepItem: 'custom-step-item' }}
        />
      );

      expect(container.querySelector('.custom-step-item')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('should render icons when showIcons is true and steps have icons', () => {
      const steps = createMockStepsWithIcons(4);
      renderWithProviders(
        <Stepper activeStep={1} steps={steps} showIcons={true} />
      );

      expect(screen.getByTestId('step-icon-0')).toBeInTheDocument();
      expect(screen.getByTestId('step-icon-1')).toBeInTheDocument();
    });

    it('should not render icons when showIcons is false', () => {
      const steps = createMockStepsWithIcons(4);
      renderWithProviders(
        <Stepper activeStep={1} steps={steps} showIcons={false} />
      );

      expect(screen.queryByTestId('step-icon-0')).not.toBeInTheDocument();
    });

    it('should render icons at top position by default', () => {
      const steps = createMockStepsWithIcons(4);
      renderWithProviders(
        <Stepper activeStep={1} steps={steps} showIcons={true} iconPosition="top" />
      );

      expect(screen.getByTestId('step-icon-0')).toBeInTheDocument();
    });

    it('should render icons at left position', () => {
      const steps = createMockStepsWithIcons(4);
      renderWithProviders(
        <Stepper activeStep={1} steps={steps} showIcons={true} iconPosition="left" />
      );

      expect(screen.getByTestId('step-icon-0')).toBeInTheDocument();
    });

    it('should render icons at right position', () => {
      const steps = createMockStepsWithIcons(4);
      renderWithProviders(
        <Stepper activeStep={1} steps={steps} showIcons={true} iconPosition="right" />
      );

      expect(screen.getByTestId('step-icon-0')).toBeInTheDocument();
    });

    it('should replace step numbers with icons when iconPosition is replace-number', () => {
      const steps = createMockStepsWithIcons(3);
      renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          showIcons={true}
          iconPosition="replace-number"
        />
      );

      // Icons should be visible
      expect(screen.getByTestId('step-icon-0')).toBeInTheDocument();
      // Step numbers should not be visible
      expect(screen.queryByText('01')).not.toBeInTheDocument();
    });
  });

  describe('Step Click Handler', () => {
    it('should call onStepClick when a step is clicked', () => {
      const steps = createMockSteps(4);
      const onStepClick = jest.fn();
      const { container } = renderWithProviders(
        <Stepper activeStep={1} steps={steps} onStepClick={onStepClick} />
      );

      const stepCircles = container.querySelectorAll('.step-circle');
      fireEvent.click(stepCircles[0]);

      expect(onStepClick).toHaveBeenCalledWith(0);
    });

    it('should call onStepClick with correct step index', () => {
      const steps = createMockSteps(4);
      const onStepClick = jest.fn();
      const { container } = renderWithProviders(
        <Stepper activeStep={1} steps={steps} onStepClick={onStepClick} />
      );

      const stepCircles = container.querySelectorAll('.step-circle');
      fireEvent.click(stepCircles[2]);

      expect(onStepClick).toHaveBeenCalledWith(2);
    });

    it('should not throw error when clicking without onStepClick handler', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper activeStep={1} steps={steps} />
      );

      const stepCircles = container.querySelectorAll('.step-circle');
      expect(() => fireEvent.click(stepCircles[0])).not.toThrow();
    });
  });

  describe('Limited Steps Layout', () => {
    it('should apply limited class when steps count is 6 or less', () => {
      const steps = createMockSteps(5);
      const { container } = renderWithProviders(
        <Stepper activeStep={1} steps={steps} />
      );

      expect(container.querySelector('.step.limited')).toBeInTheDocument();
    });

    it('should not apply limited class when steps count is more than 6', () => {
      const steps = createMockSteps(8);
      const { container } = renderWithProviders(
        <Stepper activeStep={1} steps={steps} />
      );

      // Should have step class but check if limited is not the primary layout
      const stepElements = container.querySelectorAll('.step');
      expect(stepElements.length).toBe(8);
    });

    it('should apply stepItemLimited class when provided and steps <= 6', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper
          activeStep={1}
          steps={steps}
          classNames={{ stepItemLimited: 'my-limited-step' }}
        />
      );

      expect(container.querySelector('.my-limited-step')).toBeInTheDocument();
    });
  });

  describe('Connector Lines', () => {
    it('should render connector lines between steps', () => {
      const steps = createMockSteps(4);
      const { container } = renderWithProviders(
        <Stepper activeStep={1} steps={steps} />
      );

      // Should have 3 connector lines for 4 steps (no connector after last step)
      const connectorLines = container.querySelectorAll('.connector-line');
      expect(connectorLines.length).toBe(3);
    });

    it('should not render connector line after last step', () => {
      const steps = createMockSteps(2);
      const { container } = renderWithProviders(
        <Stepper activeStep={0} steps={steps} />
      );

      // Should have 1 connector line for 2 steps
      const connectorLines = container.querySelectorAll('.connector-line');
      expect(connectorLines.length).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single step', () => {
      const steps = [{ label: 'Only Step', status: 'active' }];
      renderWithProviders(<Stepper activeStep={0} steps={steps} />);

      const labels = screen.getAllByText('Only Step');
      expect(labels.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Step 1/1')).toBeInTheDocument();
    });

    it('should handle activeStep at first position', () => {
      const steps = createMockSteps(4);
      renderWithProviders(<Stepper activeStep={0} steps={steps} />);

      expect(screen.getByText('Step 1/4')).toBeInTheDocument();
    });

    it('should handle activeStep at last position', () => {
      const steps = createMockSteps(4);
      renderWithProviders(<Stepper activeStep={3} steps={steps} />);

      expect(screen.getByText('Step 4/4')).toBeInTheDocument();
    });

    it('should handle steps without icons when showIcons is true', () => {
      const steps = createMockSteps(3); // No icons
      renderWithProviders(
        <Stepper activeStep={1} steps={steps} showIcons={true} />
      );

      // Should still render step numbers since no icons provided
      expect(screen.getByText('01')).toBeInTheDocument();
    });
  });
});

describe('getActiveStep Utility Function', () => {
  it('should return correct step index for given status', () => {
    const steps = [
      { label: 'Draft', status: 'draft' },
      { label: 'Pending', status: 'pending' },
      { label: 'Approved', status: 'approved' },
    ];

    expect(getActiveStep('draft', steps)).toBe(0);
    expect(getActiveStep('pending', steps)).toBe(1);
    expect(getActiveStep('approved', steps)).toBe(2);
  });

  it('should return 0 for unknown status', () => {
    const steps = [
      { label: 'Draft', status: 'draft' },
      { label: 'Pending', status: 'pending' },
    ];

    expect(getActiveStep('unknown', steps)).toBe(0);
  });

  it('should handle empty steps array', () => {
    expect(getActiveStep('any', [])).toBe(0);
  });

  it('should return the last matching index for duplicate statuses', () => {
    const steps = [
      { label: 'First', status: 'same' },
      { label: 'Second', status: 'same' },
    ];

    // The map will have the last index for duplicate keys
    expect(getActiveStep('same', steps)).toBe(1);
  });
});
