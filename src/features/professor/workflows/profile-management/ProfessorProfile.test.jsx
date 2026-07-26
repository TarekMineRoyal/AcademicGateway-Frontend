import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfessorProfile } from './ProfessorProfile';
import { useProfessorProfileForm } from './hooks/useProfessorProfileForm';

vi.mock('./hooks/useProfessorProfileForm', () => ({
  useProfessorProfileForm: vi.fn(),
}));

describe('ProfessorProfile Container', () => {
  const mockSetIsEditing = vi.fn();
  const mockHandleCancel = vi.fn();
  const mockHandleSubmit = vi.fn();

  const mockDefaultFormState = {
    profile: {
      fullName: 'Dr. Marie Curie',
      rank: 'Full Professor',
      department: 'Radiology',
      email: 'marie@university.edu',
      researchInterests: ['Radioactivity', 'Physics'],
      aboutMe: 'Nobel laureate in Physics and Chemistry.',
    },
    isLoading: false,
    updateProfileMutation: {
      isSuccess: false,
      isError: false,
      isPending: false,
      isLoading: false,
      error: null,
    },
    fullName: 'Dr. Marie Curie',
    setFullName: vi.fn(),
    department: 'Radiology',
    setDepartment: vi.fn(),
    rank: 'Full Professor',
    setRank: vi.fn(),
    maxSupervisionCapacity: 5,
    setMaxSupervisionCapacity: vi.fn(),
    researchInterests: ['Radioactivity', 'Physics'],
    setResearchInterests: vi.fn(),
    aboutMe: 'Nobel laureate in Physics and Chemistry.',
    setAboutMe: vi.fn(),
    isEditing: false,
    setIsEditing: mockSetIsEditing,
    handleCancel: mockHandleCancel,
    handleSubmit: mockHandleSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProfessorProfileForm).mockReturnValue(mockDefaultFormState);
  });

  // --- LOADING STATE ---
  it('displays loading screen when hook isLoading is true', () => {
    vi.mocked(useProfessorProfileForm).mockReturnValue({
      ...mockDefaultFormState,
      isLoading: true,
    });

    render(<ProfessorProfile />);

    expect(screen.getByText('Loading faculty profile...')).toBeInTheDocument();
    expect(screen.queryByText('Update Faculty Profile')).not.toBeInTheDocument();
  });

  // --- READ-ONLY MODE ---
  it('renders read-only profile view by default when not in edit mode', () => {
    render(<ProfessorProfile />);

    expect(screen.getByText('Dr. Marie Curie')).toBeInTheDocument();
    expect(screen.getByText('Radiology')).toBeInTheDocument();
    expect(screen.getByText('Nobel laureate in Physics and Chemistry.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
  });

  it('switches to editing mode when clicking Edit Profile button in read-only view', async () => {
    const user = userEvent.setup();
    render(<ProfessorProfile />);

    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    await user.click(editBtn);

    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  // --- EDIT MODE FORM & ACTIONS ---
  it('renders edit form structure when isEditing is true', () => {
    vi.mocked(useProfessorProfileForm).mockReturnValue({
      ...mockDefaultFormState,
      isEditing: true,
    });

    render(<ProfessorProfile />);

    expect(screen.getByText('Update Faculty Profile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  it('triggers handleCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(useProfessorProfileForm).mockReturnValue({
      ...mockDefaultFormState,
      isEditing: true,
    });

    render(<ProfessorProfile />);

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelBtn);

    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it('triggers handleSubmit when form is submitted', () => {
    vi.mocked(useProfessorProfileForm).mockReturnValue({
      ...mockDefaultFormState,
      isEditing: true,
    });

    const { container } = render(<ProfessorProfile />);

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  // --- MUTATION FEEDBACK BANNERS & STATES ---
  it('displays success feedback banner when profile update succeeds', () => {
    vi.mocked(useProfessorProfileForm).mockReturnValue({
      ...mockDefaultFormState,
      updateProfileMutation: {
        ...mockDefaultFormState.updateProfileMutation,
        isSuccess: true,
      },
    });

    render(<ProfessorProfile />);

    expect(screen.getByText('Faculty profile successfully updated!')).toBeInTheDocument();
  });

  it('displays error feedback banner with specific message when profile update fails', () => {
    vi.mocked(useProfessorProfileForm).mockReturnValue({
      ...mockDefaultFormState,
      updateProfileMutation: {
        ...mockDefaultFormState.updateProfileMutation,
        isError: true,
        error: { message: 'Server validation failed' },
      },
    });

    render(<ProfessorProfile />);

    expect(screen.getByText('Submission failed: Server validation failed')).toBeInTheDocument();
  });

  it('displays error feedback banner with default fallback message when error message is missing', () => {
    vi.mocked(useProfessorProfileForm).mockReturnValue({
      ...mockDefaultFormState,
      updateProfileMutation: {
        ...mockDefaultFormState.updateProfileMutation,
        isError: true,
        error: null,
      },
    });

    render(<ProfessorProfile />);

    expect(screen.getByText('Submission failed: Failed to update profile.')).toBeInTheDocument();
  });

  it('disables Save button and shows "Syncing..." text while mutation is pending', () => {
    vi.mocked(useProfessorProfileForm).mockReturnValue({
      ...mockDefaultFormState,
      isEditing: true,
      updateProfileMutation: {
        ...mockDefaultFormState.updateProfileMutation,
        isPending: true,
      },
    });

    render(<ProfessorProfile />);

    const saveBtn = screen.getByRole('button', { name: /Syncing\.\.\./i });
    expect(saveBtn).toBeDisabled();
  });
});