import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfessorProfileModal } from '../ProfessorProfileModal';
import { useProfessorProfile } from '../../hooks/useProfessorProfile';

vi.mock('../../hooks/useProfessorProfile', () => ({
  useProfessorProfile: vi.fn(),
}));

describe('ProfessorProfileModal', () => {
  const mockProfessor = {
    id: 'prof-101',
    fullName: 'Dr. Katherine Johnson',
    rank: 'Full Professor',
    department: 'Mathematics',
    email: 'katherine@university.edu',
    currentProjectCount: 2,
    maxSupervisionCapacity: 5,
    isAcceptingProjects: true,
    researchInterests: ['Orbital Mechanics', 'Applied Mathematics'],
    aboutMe: 'Pioneer in spaceflight dynamics.',
  };

  const defaultProps = {
    professorId: 'prof-101',
    isOpen: true,
    onClose: vi.fn(),
    onSelect: vi.fn(),
    isSelected: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- VISIBILITY & PROPS GUARD ---
  it('returns null when isOpen is false', () => {
    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: null,
      isLoading: false,
      error: null,
    });

    const { container } = render(<ProfessorProfileModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when professorId is null or empty', () => {
    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: null,
      isLoading: false,
      error: null,
    });

    const { container: nullContainer } = render(
      <ProfessorProfileModal {...defaultProps} professorId={null} />
    );
    expect(nullContainer.firstChild).toBeNull();

    const { container: emptyContainer } = render(
      <ProfessorProfileModal {...defaultProps} professorId="" />
    );
    expect(emptyContainer.firstChild).toBeNull();
  });

  // --- LOADING & ERROR STATES ---
  it('displays loading spinner and message when isLoading is true', () => {
    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: null,
      isLoading: true,
      error: null,
    });

    render(<ProfessorProfileModal {...defaultProps} />);

    expect(
      screen.getByText('Fetching advisor record & research profile...')
    ).toBeInTheDocument();
  });

  it('displays API error message on fetch failure', () => {
    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: null,
      isLoading: false,
      error: { response: { data: { message: 'Failed to fetch details from server' } } },
    });

    render(<ProfessorProfileModal {...defaultProps} />);

    expect(screen.getByText('Failed to fetch details from server')).toBeInTheDocument();
  });

  it('displays fallback error message if error payload is missing specific response message', () => {
    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: null,
      isLoading: false,
      error: new Error('Network failure'),
    });

    render(<ProfessorProfileModal {...defaultProps} />);

    expect(
      screen.getByText('Unable to load professor profile details.')
    ).toBeInTheDocument();
  });

  // --- PROFESSOR DETAILS RENDERING ---
  it('renders all professor profile information correctly', () => {
    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: mockProfessor,
      isLoading: false,
      error: null,
    });

    render(<ProfessorProfileModal {...defaultProps} />);

    expect(screen.getByText('Dr. Katherine Johnson')).toBeInTheDocument();
    expect(screen.getByText('Full Professor')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();

    const emailLink = screen.getByRole('link', { name: 'katherine@university.edu' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:katherine@university.edu');

    expect(screen.getByText('Orbital Mechanics')).toBeInTheDocument();
    expect(screen.getByText('Applied Mathematics')).toBeInTheDocument();
    expect(screen.getByText('Pioneer in spaceflight dynamics.')).toBeInTheDocument();

    expect(
      screen.getByText(/2 \/ 5 Active Supervisees \(Accepting Students\)/i)
    ).toBeInTheDocument();
  });

  it('renders fallback text when research interests or bio are missing', () => {
    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: {
        id: 'prof-102',
        fullName: 'Dr. Minimal',
        researchInterests: [],
        aboutMe: null,
      },
      isLoading: false,
      error: null,
    });

    render(<ProfessorProfileModal {...defaultProps} />);

    expect(screen.getByText('No research interests listed.')).toBeInTheDocument();
    expect(
      screen.getByText('No detailed background provided by this faculty member.')
    ).toBeInTheDocument();
  });

  // --- CAPACITY & SELECTION STATES ---
  it('shows capacity reached state and disables select button when professor is full', () => {
    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: {
        ...mockProfessor,
        currentProjectCount: 5,
        maxSupervisionCapacity: 5,
      },
      isLoading: false,
      error: null,
    });

    render(<ProfessorProfileModal {...defaultProps} />);

    expect(
      screen.getByText(/5 \/ 5 Active Supervisees \(At Full Capacity\)/i)
    ).toBeInTheDocument();

    const selectBtn = screen.getByRole('button', { name: /Capacity Reached/i });
    expect(selectBtn).toBeDisabled();
  });

  it('shows selected state and disables select button when isSelected is true', () => {
    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: mockProfessor,
      isLoading: false,
      error: null,
    });

    render(<ProfessorProfileModal {...defaultProps} isSelected={true} />);

    const selectBtn = screen.getByRole('button', { name: /Selected Advisor/i });
    expect(selectBtn).toBeDisabled();
  });

  // --- ACTION BUTTON INTERACTIONS ---
  it('triggers onClose when header close button or footer close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: mockProfessor,
      isLoading: false,
      error: null,
    });

    render(<ProfessorProfileModal {...defaultProps} onClose={handleClose} />);

    // Footer close button
    const footerCloseBtn = screen.getByRole('button', { name: /^Close$/i });
    await user.click(footerCloseBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onSelect with professor payload and closes modal when Select button is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const handleClose = vi.fn();

    vi.mocked(useProfessorProfile).mockReturnValue({
      professor: mockProfessor,
      isLoading: false,
      error: null,
    });

    render(
      <ProfessorProfileModal
        {...defaultProps}
        onSelect={handleSelect}
        onClose={handleClose}
      />
    );

    const selectBtn = screen.getByRole('button', { name: /Select as Advisor/i });
    await user.click(selectBtn);

    expect(handleSelect).toHaveBeenCalledWith(mockProfessor);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});