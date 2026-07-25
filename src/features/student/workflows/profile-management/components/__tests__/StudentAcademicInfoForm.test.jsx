// __tests__/StudentAcademicInfoForm.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentAcademicInfoForm from '../StudentAcademicInfoForm';
import SearchableCombobox from '@/shared/components/SearchableCombobox';

// Mock SearchableCombobox to inspect passed props and trigger onChange callbacks cleanly
vi.mock('@/shared/components/SearchableCombobox', () => ({
  default: vi.fn(({ placeholder, options, selected, onChange, isMulti }) => (
    <div data-testid={`combobox-${placeholder}`}>
      <span data-testid="selected-json">{JSON.stringify(selected)}</span>
      <span data-testid="options-json">{JSON.stringify(options)}</span>
      <button
        data-testid={`trigger-${placeholder}`}
        onClick={() =>
          onChange([
            { id: 'item-1', name: 'Item 1' },
            { id: 'item-2', name: 'Item 2' },
          ])
        }
      >
        Trigger Change
      </button>
    </div>
  )),
}));

describe('StudentAcademicInfoForm', () => {
  const mockMajorsData = [
    { id: 'major-1', name: 'Computer Science' },
    { id: 'major-2', name: 'Electrical Engineering' },
  ];

  const mockAvailableSpecialties = [
    { id: 'spec-1', name: 'Software Engineering' },
    { id: 'spec-2', name: 'Robotics' },
  ];

  const defaultProps = {
    majorsData: mockMajorsData,
    selectedMajorIds: ['major-1'],
    handleMajorsChange: vi.fn(),
    availableSpecialties: mockAvailableSpecialties,
    selectedSpecialtyIds: ['spec-1'],
    setSelectedSpecialtyIds: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Render & Conditional Display', () => {
    it('should render Academic Majors section and combobox always', () => {
      render(<StudentAcademicInfoForm {...defaultProps} selectedMajorIds={[]} />);

      expect(screen.getByText('Academic Majors')).toBeDefined();
      expect(
        screen.getByTestId('combobox-Type to search and append majors...')
      ).toBeDefined();
    });

    it('should NOT render Sub-Track Focus Areas section when selectedMajorIds is empty', () => {
      render(<StudentAcademicInfoForm {...defaultProps} selectedMajorIds={[]} />);

      expect(screen.queryByText('Sub-Track Focus Areas')).toBeNull();
      expect(
        screen.queryByTestId('combobox-Type to search focus areas...')
      ).toBeNull();
    });

    it('should render Sub-Track Focus Areas section when selectedMajorIds has elements', () => {
      render(<StudentAcademicInfoForm {...defaultProps} selectedMajorIds={['major-1']} />);

      expect(screen.getByText('Sub-Track Focus Areas')).toBeDefined();
      expect(
        screen.getByTestId('combobox-Type to search focus areas...')
      ).toBeDefined();
    });
  });

  describe('Data Filtering & Prop Pass-Through', () => {
    it('should filter majorsData and pass only matching selected major objects to SearchableCombobox', () => {
      render(
        <StudentAcademicInfoForm
          {...defaultProps}
          selectedMajorIds={['major-2']}
        />
      );

      const comboboxCall = vi.mocked(SearchableCombobox).mock.calls[0][0];

      expect(comboboxCall.options).toEqual(mockMajorsData);
      expect(comboboxCall.selected).toEqual([{ id: 'major-2', name: 'Electrical Engineering' }]);
      expect(comboboxCall.isMulti).toBe(true);
    });

    it('should filter availableSpecialties and pass only matching selected specialty objects', () => {
      render(
        <StudentAcademicInfoForm
          {...defaultProps}
          selectedMajorIds={['major-1']}
          selectedSpecialtyIds={['spec-2']}
        />
      );

      // Second call is for specialties combobox
      const comboboxCall = vi.mocked(SearchableCombobox).mock.calls[1][0];

      expect(comboboxCall.options).toEqual(mockAvailableSpecialties);
      expect(comboboxCall.selected).toEqual([{ id: 'spec-2', name: 'Robotics' }]);
      expect(comboboxCall.isMulti).toBe(true);
    });

    it('should pass empty array to selected when selected IDs do not match any dataset items', () => {
      render(
        <StudentAcademicInfoForm
          {...defaultProps}
          selectedMajorIds={['non-existent-major']}
          selectedSpecialtyIds={['non-existent-spec']}
        />
      );

      const majorsComboboxCall = vi.mocked(SearchableCombobox).mock.calls[0][0];
      const specsComboboxCall = vi.mocked(SearchableCombobox).mock.calls[1][0];

      expect(majorsComboboxCall.selected).toEqual([]);
      expect(specsComboboxCall.selected).toEqual([]);
    });
  });

  describe('Callbacks & Event Handling', () => {
    it('should forward handleMajorsChange directly to majors SearchableCombobox', () => {
      render(<StudentAcademicInfoForm {...defaultProps} />);

      const majorsComboboxCall = vi.mocked(SearchableCombobox).mock.calls[0][0];
      expect(majorsComboboxCall.onChange).toBe(defaultProps.handleMajorsChange);
    });

    it('should extract array of ID strings from objects and call setSelectedSpecialtyIds when specialties change', () => {
      render(<StudentAcademicInfoForm {...defaultProps} />);

      const specsComboboxCall = vi.mocked(SearchableCombobox).mock.calls[1][0];

      // Simulate combobox passing full objects
      specsComboboxCall.onChange([
        { id: 'spec-1', name: 'Software Engineering' },
        { id: 'spec-2', name: 'Robotics' },
      ]);

      expect(defaultProps.setSelectedSpecialtyIds).toHaveBeenCalledTimes(1);
      expect(defaultProps.setSelectedSpecialtyIds).toHaveBeenCalledWith(['spec-1', 'spec-2']);
    });

    it('should handle empty selection array in setSelectedSpecialtyIds', () => {
      render(<StudentAcademicInfoForm {...defaultProps} />);

      const specsComboboxCall = vi.mocked(SearchableCombobox).mock.calls[1][0];
      specsComboboxCall.onChange([]);

      expect(defaultProps.setSelectedSpecialtyIds).toHaveBeenCalledWith([]);
    });
  });

  describe('Default Props Fallbacks', () => {
    it('should render without crashing when optional array props are omitted', () => {
      expect(() => {
        render(
          <StudentAcademicInfoForm
            handleMajorsChange={vi.fn()}
            setSelectedSpecialtyIds={vi.fn()}
          />
        );
      }).not.toThrow();

      expect(screen.getByText('Academic Majors')).toBeDefined();
      expect(screen.queryByText('Sub-Track Focus Areas')).toBeNull();
    });
  });
});