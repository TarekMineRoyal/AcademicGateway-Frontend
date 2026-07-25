import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import StudentRegisterForm from '../StudentRegisterForm';
import { useStudentRegisterLookups } from '../../hooks/useStudentRegisterLookups';

vi.mock('../../hooks/useStudentRegisterLookups', () => ({
  useStudentRegisterLookups: vi.fn(),
}));

describe('StudentRegisterForm', () => {
  const mockSetMajorSearch = vi.fn();
  const mockSetSpecialtySearch = vi.fn();
  const mockSetSkillSearch = vi.fn();
  const mockOnFieldChange = vi.fn();

  const defaultMockHookReturn = {
    loadingLookups: false,
    error: '',
    majorSearch: '',
    setMajorSearch: mockSetMajorSearch,
    filteredMajors: [
      { id: 'm1', name: 'Computer Science' },
      { id: 'm2', name: 'Software Engineering' },
    ],
    specialtySearch: '',
    setSpecialtySearch: mockSetSpecialtySearch,
    availableSpecialties: [{ id: 'sp1', name: 'Artificial Intelligence' }],
    filteredSpecialties: [{ id: 'sp1', name: 'Artificial Intelligence' }],
    skillSearch: '',
    setSkillSearch: mockSetSkillSearch,
    filteredSkills: [
      { id: 'sk1', name: 'React' },
      { id: 'sk2', name: 'Node.js' },
    ],
    selectedSkills: [{ id: 'sk1', name: 'React' }],
  };

  const defaultProps = {
    formValues: {
      fullName: 'Alex Rivera',
      graduationYear: '2027',
      majorIds: ['m1'],
      specialtyIds: [],
      skillIds: ['sk1'],
      aboutMe: '',
    },
    onFieldChange: mockOnFieldChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useStudentRegisterLookups.mockReturnValue(defaultMockHookReturn);
  });

  describe('[AC] Loading & Error States', () => {
    it('[AC] renders pulse loading indicator text when loadingLookups is true', () => {
      useStudentRegisterLookups.mockReturnValue({
        ...defaultMockHookReturn,
        loadingLookups: true,
      });

      render(<StudentRegisterForm {...defaultProps} />);

      const loadingEl = screen.getByText(
        'Loading account initialization parameters...'
      );
      expect(loadingEl).toBeInTheDocument();
      expect(loadingEl).toHaveClass('animate-pulse');

      expect(
        screen.queryByRole('heading', { name: /student academic profile/i })
      ).not.toBeInTheDocument();
    });

    it('renders error alert box when error string is present in lookup state', () => {
      useStudentRegisterLookups.mockReturnValue({
        ...defaultMockHookReturn,
        error: 'Failed to load curriculum configuration',
      });

      render(<StudentRegisterForm {...defaultProps} />);

      expect(
        screen.getByText('Failed to load curriculum configuration')
      ).toBeInTheDocument();
    });
  });

  describe('[AC] Collection Toggling (Majors & Skills)', () => {
    it('[AC] adds major ID to formValues.majorIds when clicking an unselected major button', async () => {
      const user = userEvent.setup();
      render(
        <StudentRegisterForm
          {...defaultProps}
          formValues={{ ...defaultProps.formValues, majorIds: [] }}
        />
      );

      const csButton = screen.getByRole('button', { name: 'Computer Science' });
      await user.click(csButton);

      expect(mockOnFieldChange).toHaveBeenCalledTimes(1);
      expect(mockOnFieldChange).toHaveBeenCalledWith('majorIds', ['m1']);
    });

    it('[AC] removes major ID from formValues.majorIds when clicking an already selected major button', async () => {
      const user = userEvent.setup();
      render(
        <StudentRegisterForm
          {...defaultProps}
          formValues={{ ...defaultProps.formValues, majorIds: ['m1'] }}
        />
      );

      const csButton = screen.getByRole('button', { name: 'Computer Science' });
      await user.click(csButton);

      expect(mockOnFieldChange).toHaveBeenCalledTimes(1);
      expect(mockOnFieldChange).toHaveBeenCalledWith('majorIds', []);
    });

    it('toggles presence of skill ID inside formValues.skillIds via checkbox selection', async () => {
      const user = userEvent.setup();
      render(
        <StudentRegisterForm
          {...defaultProps}
          formValues={{ ...defaultProps.formValues, skillIds: [] }}
        />
      );

      const nodeCheckbox = screen.getByRole('checkbox', { name: 'Node.js' });
      await user.click(nodeCheckbox);

      expect(mockOnFieldChange).toHaveBeenCalledTimes(1);
      expect(mockOnFieldChange).toHaveBeenCalledWith('skillIds', ['sk2']);
    });
  });

  describe('[AC] Tag Removal', () => {
    it('[AC] invokes toggle handler with skill ID when clicking an active skill tag pill', async () => {
      const user = userEvent.setup();
      render(<StudentRegisterForm {...defaultProps} />);

      const reactPill = screen.getByTitle('Click to remove skill');
      expect(reactPill).toHaveTextContent('React');

      await user.click(reactPill);

      expect(mockOnFieldChange).toHaveBeenCalledTimes(1);
      expect(mockOnFieldChange).toHaveBeenCalledWith('skillIds', []);
    });
  });

  describe('Dependent Sub-Track Specialties & Search Input Callbacks', () => {
    it('renders sub-track specialties block ONLY when majorIds has selections AND availableSpecialties exist', () => {
      const { rerender } = render(
        <StudentRegisterForm
          {...defaultProps}
          formValues={{ ...defaultProps.formValues, majorIds: [] }}
        />
      );

      expect(
        screen.queryByText(/select your sub-track focus areas/i)
      ).not.toBeInTheDocument();

      rerender(
        <StudentRegisterForm
          {...defaultProps}
          formValues={{ ...defaultProps.formValues, majorIds: ['m1'] }}
        />
      );

      expect(
        screen.getByText(/select your sub-track focus areas/i)
      ).toBeInTheDocument();
    });

    it('invokes setMajorSearch and setSkillSearch on search input change', async () => {
      const user = userEvent.setup();
      render(<StudentRegisterForm {...defaultProps} />);

      const majorSearchInput = screen.getByPlaceholderText(
        /type to filter academic majors/i
      );
      await user.type(majorSearchInput, 'Comp');
      expect(mockSetMajorSearch).toHaveBeenCalledWith('C');

      const skillSearchInput = screen.getByPlaceholderText(
        /type to filter core technology/i
      );
      await user.type(skillSearchInput, 'Rea');
      expect(mockSetSkillSearch).toHaveBeenCalledWith('R');
    });

    it('renders empty fallback messages when arrays are empty', () => {
      useStudentRegisterLookups.mockReturnValue({
        ...defaultMockHookReturn,
        filteredMajors: [],
        filteredSkills: [],
        selectedSkills: [],
      });

      render(<StudentRegisterForm {...defaultProps} />);

      expect(
        screen.getByText('No matching academic majors found.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('No verified competencies selected yet.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('No matching skills found.')
      ).toBeInTheDocument();
    });
  });
});