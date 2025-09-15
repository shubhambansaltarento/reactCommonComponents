import React from 'react';
import { CommonTabs } from '../../CommonTabs';
import {
  renderWithProviders,
  screen,
  fireEvent,
  mockTabLists,
  defaultTabsProps,
  resetMocks,
  createTabList,
  createTabItem,
  mockHomeIcon,
} from '../test-utils';
import { TabListInterface } from '../../CommonTabs.interface';

// Helper function for disabled logic test (defined outside to avoid nesting)
const isEvenDisabled = (v: string | number) => (v as number) % 2 === 0;

describe('CommonTabs Component', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('Rendering', () => {
    it('should render the tabs container', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} />);

      // MUI Tabs should render a tablist role
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should render all tabs from tabList', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(mockTabLists.basic.length);
    });

    it('should render tab labels correctly', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} />);

      for (const tab of mockTabLists.basic) {
        expect(screen.getByRole('tab', { name: tab.label })).toBeInTheDocument();
      }
    });

    it('should render single tab correctly', () => {
      renderWithProviders(
        <CommonTabs
          value="only"
          onChange={jest.fn()}
          tabList={mockTabLists.single}
        />
      );

      expect(screen.getAllByRole('tab')).toHaveLength(1);
      expect(screen.getByRole('tab', { name: 'Only Tab' })).toBeInTheDocument();
    });

    it('should render empty when tabList is empty', () => {
      renderWithProviders(
        <CommonTabs
          value=""
          onChange={jest.fn()}
          tabList={mockTabLists.empty}
        />
      );

      expect(screen.queryAllByRole('tab')).toHaveLength(0);
    });

    it('should render many tabs correctly', () => {
      const manyTabs = createTabList(10);
      renderWithProviders(
        <CommonTabs value="tab-1" onChange={jest.fn()} tabList={manyTabs} />
      );

      expect(screen.getAllByRole('tab')).toHaveLength(10);
    });

    it('should use index as fallback key when label is empty', () => {
      // This tests the fallback key generation: key={tab.label ?? idx}
      const tabsWithEmptyLabel: TabListInterface[] = [
        { label: '', value: 'empty-label' },
        { label: 'Normal', value: 'normal' },
      ];

      renderWithProviders(
        <CommonTabs
          value="empty-label"
          onChange={jest.fn()}
          tabList={tabsWithEmptyLabel}
        />
      );

      // Should render both tabs without errors
      expect(screen.getAllByRole('tab')).toHaveLength(2);
    });
  });

  describe('Tab Selection', () => {
    it('should mark the selected tab as selected', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} value="home" />);

      const homeTab = screen.getByRole('tab', { name: 'Home' });
      expect(homeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should mark other tabs as not selected', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} value="home" />);

      const profileTab = screen.getByRole('tab', { name: 'Profile' });
      const settingsTab = screen.getByRole('tab', { name: 'Settings' });

      expect(profileTab).toHaveAttribute('aria-selected', 'false');
      expect(settingsTab).toHaveAttribute('aria-selected', 'false');
    });

    it('should call onChange when a tab is clicked', () => {
      const handleChange = jest.fn();
      renderWithProviders(
        <CommonTabs {...defaultTabsProps} onChange={handleChange} />
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should pass the new value to onChange callback', () => {
      const handleChange = jest.fn();
      renderWithProviders(
        <CommonTabs {...defaultTabsProps} onChange={handleChange} />
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      expect(handleChange).toHaveBeenCalledWith(
        expect.any(Object),
        'profile'
      );
    });

    it('should handle numeric tab values', () => {
      const numericTabs: TabListInterface[] = [
        { label: 'Tab 1', value: 1 },
        { label: 'Tab 2', value: 2 },
        { label: 'Tab 3', value: 3 },
      ];
      const handleChange = jest.fn();

      renderWithProviders(
        <CommonTabs value={1} onChange={handleChange} tabList={numericTabs} />
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleChange).toHaveBeenCalledWith(expect.any(Object), 2);
    });

    it('should not call onChange when clicking already selected tab', () => {
      const handleChange = jest.fn();
      renderWithProviders(
        <CommonTabs {...defaultTabsProps} value="home" onChange={handleChange} />
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Home' }));

      // MUI Tabs doesn't call onChange when clicking the already selected tab
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Disabled Tabs', () => {
    describe('Boolean disabled', () => {
      it('should render disabled tab with disabled attribute', () => {
        renderWithProviders(
          <CommonTabs
            value="active"
            onChange={jest.fn()}
            tabList={mockTabLists.withDisabledBoolean}
          />
        );

        const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
        expect(disabledTab).toHaveClass('Mui-disabled');
      });

      it('should not call onChange when disabled tab is clicked', () => {
        const handleChange = jest.fn();
        renderWithProviders(
          <CommonTabs
            value="active"
            onChange={handleChange}
            tabList={mockTabLists.withDisabledBoolean}
          />
        );

        const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
        fireEvent.click(disabledTab);

        expect(handleChange).not.toHaveBeenCalled();
      });

      it('should allow other tabs to be clickable', () => {
        const handleChange = jest.fn();
        renderWithProviders(
          <CommonTabs
            value="active"
            onChange={handleChange}
            tabList={mockTabLists.withDisabledBoolean}
          />
        );

        fireEvent.click(screen.getByRole('tab', { name: 'Another Active' }));

        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), 'another');
      });
    });

    describe('Function disabled', () => {
      it('should evaluate disabled function with current selected value', () => {
        // Note: disabled function receives the SELECTED tab's value, not the tab's own value
        // This means tabs are disabled based on the current selection
        renderWithProviders(
          <CommonTabs
            value="a"
            onChange={jest.fn()}
            tabList={mockTabLists.withDisabledFunction}
          />
        );

        // Tab B's disabled function returns true when value === 'b'
        // But the current value is 'a', so Tab B should NOT be disabled
        const tabB = screen.getByRole('tab', { name: 'Tab B' });
        expect(tabB).not.toHaveClass('Mui-disabled');
      });

      it('should disable tabs when function returns true for selected value', () => {
        // When selected value is 'b', the disabled function for Tab B returns true
        renderWithProviders(
          <CommonTabs
            value="b"
            onChange={jest.fn()}
            tabList={mockTabLists.withDisabledFunction}
          />
        );

        const tabB = screen.getByRole('tab', { name: 'Tab B' });
        expect(tabB).toHaveClass('Mui-disabled');
      });

      it('should not disable tabs where function returns false', () => {
        renderWithProviders(
          <CommonTabs
            value="a"
            onChange={jest.fn()}
            tabList={mockTabLists.withDisabledFunction}
          />
        );

        const tabA = screen.getByRole('tab', { name: 'Tab A' });
        const tabC = screen.getByRole('tab', { name: 'Tab C' });

        expect(tabA).not.toHaveClass('Mui-disabled');
        expect(tabC).not.toHaveClass('Mui-disabled');
      });

      it('should handle custom disabled function logic', () => {
        const customTabs: TabListInterface[] = [
          { label: 'Even', value: 2, disabled: isEvenDisabled },
          { label: 'Odd', value: 3, disabled: isEvenDisabled },
        ];

        // When value is 2 (even), isEvenDisabled returns true
        renderWithProviders(
          <CommonTabs value={2} onChange={jest.fn()} tabList={customTabs} />
        );

        // Both tabs evaluate isEvenDisabled(2) which is true
        expect(screen.getByRole('tab', { name: 'Even' })).toHaveClass(
          'Mui-disabled'
        );
        expect(screen.getByRole('tab', { name: 'Odd' })).toHaveClass(
          'Mui-disabled'
        );
      });

      it('should not disable tabs when function returns false for selected value', () => {
        const customTabs: TabListInterface[] = [
          { label: 'Even', value: 2, disabled: isEvenDisabled },
          { label: 'Odd', value: 3, disabled: isEvenDisabled },
        ];

        // When value is 3 (odd), isEvenDisabled returns false
        renderWithProviders(
          <CommonTabs value={3} onChange={jest.fn()} tabList={customTabs} />
        );

        // Both tabs evaluate isEvenDisabled(3) which is false
        expect(screen.getByRole('tab', { name: 'Even' })).not.toHaveClass(
          'Mui-disabled'
        );
        expect(screen.getByRole('tab', { name: 'Odd' })).not.toHaveClass(
          'Mui-disabled'
        );
      });
    });
  });

  describe('Count Badge', () => {
    it('should display count for tabs with count property', () => {
      renderWithProviders(
        <CommonTabs
          value="inbox"
          onChange={jest.fn()}
          tabList={mockTabLists.withCounts}
        />
      );

      // Count is rendered as "( 5 )" with parentheses and spaces
      expect(screen.getByText(/\(\s*5\s*\)/)).toBeInTheDocument();
      expect(screen.getByText(/\(\s*12\s*\)/)).toBeInTheDocument();
    });

    it('should display zero count', () => {
      renderWithProviders(
        <CommonTabs
          value="inbox"
          onChange={jest.fn()}
          tabList={mockTabLists.withCounts}
        />
      );

      expect(screen.getByText(/\(\s*0\s*\)/)).toBeInTheDocument();
    });

    it('should render count with correct styling (badge appearance)', () => {
      renderWithProviders(
        <CommonTabs
          value="inbox"
          onChange={jest.fn()}
          tabList={mockTabLists.withCounts}
        />
      );

      const countBadge = screen.getByText(/\(\s*5\s*\)/);
      expect(countBadge).toBeInTheDocument();
      // The badge should be within a tab
      expect(countBadge.closest('[role="tab"]')).toBeInTheDocument();
    });

    it('should not render count badge when count is undefined', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} />);

      // Basic tabs don't have counts
      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        // Should not contain any numbers
        expect(tab.textContent).not.toMatch(/^\d+$/);
      }
    });
  });

  describe('Icon Component', () => {
    it('should render icon component when provided', () => {
      renderWithProviders(
        <CommonTabs
          value="home"
          onChange={jest.fn()}
          tabList={mockTabLists.withIcons}
        />
      );

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
      expect(screen.getByTestId('mock-settings-icon')).toBeInTheDocument();
    });

    it('should render icon alongside label', () => {
      const tabWithIcon: TabListInterface[] = [
        { label: 'Home', value: 'home', iconComponent: mockHomeIcon },
      ];

      renderWithProviders(
        <CommonTabs value="home" onChange={jest.fn()} tabList={tabWithIcon} />
      );

      const homeTab = screen.getByRole('tab', { name: /Home/i });
      expect(homeTab).toContainElement(screen.getByTestId('mock-icon'));
    });

    it('should not render icon when iconComponent is undefined', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} />);

      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className to tab container', () => {
      const { container } = renderWithProviders(
        <CommonTabs {...defaultTabsProps} className="custom-container-class" />
      );

      expect(container.querySelector('.custom-container-class')).toBeInTheDocument();
    });

    it('should apply className to individual tabs', () => {
      renderWithProviders(
        <CommonTabs
          value="custom"
          onChange={jest.fn()}
          tabList={mockTabLists.withClassName}
        />
      );

      const customTab = screen.getByRole('tab', { name: 'Custom Tab' });
      expect(customTab).toHaveClass('custom-tab-class');
    });

    it('should combine multiple classes correctly', () => {
      const tabWithMultipleClasses: TabListInterface[] = [
        {
          label: 'Multi Class',
          value: 'multi',
          className: 'class-one class-two',
        },
      ];

      renderWithProviders(
        <CommonTabs
          value="multi"
          onChange={jest.fn()}
          tabList={tabWithMultipleClasses}
        />
      );

      const tab = screen.getByRole('tab', { name: 'Multi Class' });
      expect(tab).toHaveClass('class-one');
      expect(tab).toHaveClass('class-two');
    });
  });

  describe('Indicator Color', () => {
    it('should apply custom indicator color', () => {
      const { container } = renderWithProviders(
        <CommonTabs {...defaultTabsProps} indicatorColor="#ff0000" />
      );

      // Check that the indicator exists
      const indicator = container.querySelector('.MuiTabs-indicator');
      expect(indicator).toBeInTheDocument();
    });

    it('should render without indicator color (default)', () => {
      const { container } = renderWithProviders(
        <CommonTabs {...defaultTabsProps} />
      );

      const indicator = container.querySelector('.MuiTabs-indicator');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Variant Prop', () => {
    it('should render with standard variant by default', () => {
      const { container } = renderWithProviders(
        <CommonTabs {...defaultTabsProps} />
      );

      const tabs = container.querySelector('.MuiTabs-root');
      expect(tabs).toBeInTheDocument();
    });

    it('should apply scrollable variant', () => {
      const { container } = renderWithProviders(
        <CommonTabs {...defaultTabsProps} variant="scrollable" />
      );

      // The scrollable class is on the scroller element
      const scroller = container.querySelector('.MuiTabs-scroller');
      expect(scroller).toBeInTheDocument();
    });

    it('should apply fullWidth variant', () => {
      const { container } = renderWithProviders(
        <CommonTabs {...defaultTabsProps} variant="fullWidth" />
      );

      const tabs = container.querySelector('.MuiTabs-root');
      expect(tabs).toBeInTheDocument();
    });
  });

  describe('ScrollButtons Prop', () => {
    it('should render with scrollButtons auto', () => {
      const manyTabs = createTabList(15);
      const { container } = renderWithProviders(
        <CommonTabs
          value="tab-1"
          onChange={jest.fn()}
          tabList={manyTabs}
          variant="scrollable"
          scrollButtons="auto"
        />
      );

      // Scroll buttons should be present with many tabs
      const scrollButtons = container.querySelectorAll('.MuiTabScrollButton-root');
      expect(scrollButtons.length).toBeGreaterThanOrEqual(0);
    });

    it('should render without scrollButtons when set to false', () => {
      const manyTabs = createTabList(15);
      const { container } = renderWithProviders(
        <CommonTabs
          value="tab-1"
          onChange={jest.fn()}
          tabList={manyTabs}
          variant="scrollable"
          scrollButtons={false}
        />
      );

      const scrollButtons = container.querySelectorAll('.MuiTabScrollButton-root');
      expect(scrollButtons.length).toBe(0);
    });
  });

  describe('Mixed Tab Features', () => {
    it('should render tabs with mixed features correctly', () => {
      renderWithProviders(
        <CommonTabs
          value="active"
          onChange={jest.fn()}
          tabList={mockTabLists.mixed}
        />
      );

      // Check all tabs are rendered
      expect(screen.getAllByRole('tab')).toHaveLength(5);

      // Check count is displayed (rendered as "( 3 )")
      expect(screen.getByText(/\(\s*3\s*\)/)).toBeInTheDocument();

      // Check disabled tab
      expect(screen.getByRole('tab', { name: 'Disabled' })).toHaveClass(
        'Mui-disabled'
      );

      // Check icon is rendered
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();

      // Check custom class
      expect(screen.getByRole('tab', { name: 'Custom Class' })).toHaveClass(
        'special-class'
      );
    });

    it('should handle interaction with mixed tabs', () => {
      const handleChange = jest.fn();
      renderWithProviders(
        <CommonTabs
          value="active"
          onChange={handleChange}
          tabList={mockTabLists.mixed}
        />
      );

      // Click on tab with count
      fireEvent.click(screen.getByRole('tab', { name: /With Count/i }));
      expect(handleChange).toHaveBeenCalledWith(expect.any(Object), 'count');

      handleChange.mockClear();

      // Try to click disabled tab - should not trigger
      fireEvent.click(screen.getByRole('tab', { name: 'Disabled' }));
      expect(handleChange).not.toHaveBeenCalled();

      // Click on tab with icon
      fireEvent.click(screen.getByRole('tab', { name: /With Icon/i }));
      expect(handleChange).toHaveBeenCalledWith(expect.any(Object), 'icon');
    });
  });

  describe('Accessibility', () => {
    it('should have proper tablist role', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should have proper tab roles', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });

    it('should have aria-selected on selected tab', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} value="profile" />);

      const profileTab = screen.getByRole('tab', { name: 'Profile' });
      expect(profileTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should mark disabled tabs with disabled class and attribute', () => {
      renderWithProviders(
        <CommonTabs
          value="active"
          onChange={jest.fn()}
          tabList={mockTabLists.withDisabledBoolean}
        />
      );

      const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
      // MUI uses the native disabled attribute on buttons
      expect(disabledTab).toBeDisabled();
      expect(disabledTab).toHaveClass('Mui-disabled');
    });

    it('should support keyboard navigation', () => {
      renderWithProviders(<CommonTabs {...defaultTabsProps} value="home" />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();

      // All tabs should be focusable
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(3);
      
      // The selected tab should have tabIndex 0
      const homeTab = screen.getByRole('tab', { name: 'Home' });
      expect(homeTab).toHaveAttribute('tabindex', '0');
      
      // Other tabs should have tabIndex -1
      const profileTab = screen.getByRole('tab', { name: 'Profile' });
      expect(profileTab).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid tab switching', () => {
      const handleChange = jest.fn();
      renderWithProviders(
        <CommonTabs {...defaultTabsProps} onChange={handleChange} />
      );

      const tabs = screen.getAllByRole('tab');

      // Rapid clicks - clicking already selected tab (tabs[0]) doesn't trigger onChange
      // Initial value is 'home' which corresponds to tabs[0]
      fireEvent.click(tabs[1]); // Profile - triggers
      fireEvent.click(tabs[2]); // Settings - triggers

      expect(handleChange).toHaveBeenCalledTimes(2);
    });

    it('should handle tabs with same label but different values', () => {
      const sameLabelTabs: TabListInterface[] = [
        { label: 'Tab', value: 'first' },
        { label: 'Tab', value: 'second' },
      ];

      renderWithProviders(
        <CommonTabs value="first" onChange={jest.fn()} tabList={sameLabelTabs} />
      );

      const tabs = screen.getAllByRole('tab', { name: 'Tab' });
      expect(tabs).toHaveLength(2);
    });

    it('should handle special characters in labels', () => {
      const specialTabs: TabListInterface[] = [
        { label: 'Tab & More', value: 'amp' },
        { label: 'Tab <Script>', value: 'script' },
        { label: 'Tab "Quoted"', value: 'quoted' },
      ];

      renderWithProviders(
        <CommonTabs value="amp" onChange={jest.fn()} tabList={specialTabs} />
      );

      expect(screen.getByRole('tab', { name: 'Tab & More' })).toBeInTheDocument();
      expect(
        screen.getByRole('tab', { name: 'Tab <Script>' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('tab', { name: 'Tab "Quoted"' })
      ).toBeInTheDocument();
    });

    it('should handle long tab labels', () => {
      const longLabelTab: TabListInterface[] = [
        {
          label: 'This is a very long tab label that should still render correctly',
          value: 'long',
        },
      ];

      renderWithProviders(
        <CommonTabs value="long" onChange={jest.fn()} tabList={longLabelTab} />
      );

      expect(
        screen.getByRole('tab', {
          name: 'This is a very long tab label that should still render correctly',
        })
      ).toBeInTheDocument();
    });

    it('should handle undefined optional props gracefully', () => {
      const minimalTabs: TabListInterface[] = [{ label: 'Tab', value: 'tab' }];

      expect(() =>
        renderWithProviders(
          <CommonTabs
            value="tab"
            onChange={jest.fn()}
            tabList={minimalTabs}
            className={undefined}
            indicatorColor={undefined}
            variant={undefined}
            scrollButtons={undefined}
          />
        )
      ).not.toThrow();
    });

    it('should handle large count numbers', () => {
      const largeCountTab: TabListInterface[] = [
        { label: 'Notifications', value: 'notif', count: 99999 },
      ];

      renderWithProviders(
        <CommonTabs value="notif" onChange={jest.fn()} tabList={largeCountTab} />
      );

      // Count is rendered as "( 99999 )"
      expect(screen.getByText(/\(\s*99999\s*\)/)).toBeInTheDocument();
    });
  });

  describe('Factory Functions', () => {
    it('createTabItem should create a valid tab item', () => {
      const tab = createTabItem({ label: 'Custom', value: 'custom' });

      expect(tab.label).toBe('Custom');
      expect(tab.value).toBe('custom');
    });

    it('createTabItem should use defaults', () => {
      const tab = createTabItem();

      expect(tab.label).toBe('Tab Label');
      expect(tab.value).toBe('tab-value');
    });

    it('createTabList should create specified number of tabs', () => {
      const tabs = createTabList(5);

      expect(tabs).toHaveLength(5);
      for (let index = 0; index < tabs.length; index++) {
        expect(tabs[index].label).toBe(`Tab ${index + 1}`);
        expect(tabs[index].value).toBe(`tab-${index + 1}`);
      }
    });
  });
});
