import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProfessorProfileHeader } from '../ProfessorProfileHeader';

describe('ProfessorProfileHeader', () => {
  const defaultProfile = {
    fullName: 'Dr. Ada Lovelace',
    rank: 'Full Professor',
    department: 'Computer Science',
    email: 'ada@university.edu',
    currentProjectCount: 2,
    maxSupervisionCapacity: 5,
    isAcceptingProjects: true,
  };

  // --- EDGE CASES: NULL / MISSING PROPS ---
  it('should render nothing (null) when profile prop is null or undefined', () => {
    const { container: nullContainer } = render(<ProfessorProfileHeader profile={null} />);
    expect(nullContainer.firstChild).toBeNull();

    const { container: undefinedContainer } = render(<ProfessorProfileHeader profile={undefined} />);
    expect(undefinedContainer.firstChild).toBeNull();
  });

  it('should handle minimal profile object and render fallback values gracefully', () => {
    render(<ProfessorProfileHeader profile={{}} />);

    // Fallback full name
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Faculty Member');

    // Rank, department, and email should not be rendered
    expect(screen.queryByText(/Professor/i)).not.toBeInTheDocument();

    // Capacity fallback (0 / N/A Slots)
    expect(screen.getByText(/0 \/ N\/A Slots/i)).toBeInTheDocument();
  });

  // --- HAPPY PATH & DATA RENDERING ---
  it('should render all profile information correctly', () => {
    render(<ProfessorProfileHeader profile={defaultProfile} />);

    // Full name and initial
    expect(screen.getByText('Dr. Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument(); // Initial of 'Dr. Ada Lovelace'

    // Rank, department, and email
    expect(screen.getByText('Full Professor')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();

    const emailLink = screen.getByRole('link', { name: 'ada@university.edu' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:ada@university.edu');

    // Capacity text
    expect(screen.getByText(/2 \/ 5 Slots \(Accepting Supervisees\)/i)).toBeInTheDocument();
  });

  // --- EDGE CASES: CAPACITY STATES & STYLING ---
  it('should display "Accepting Supervisees" with emerald text styling when not full', () => {
    render(<ProfessorProfileHeader profile={defaultProfile} />);

    const capacityBadge = screen.getByText(/2 \/ 5 Slots \(Accepting Supervisees\)/i);
    expect(capacityBadge).toHaveClass('text-emerald-700');
  });

  it('should display "Full" with amber text styling when at or exceeding capacity', () => {
    const fullProfile = {
      ...defaultProfile,
      currentProjectCount: 5,
      maxSupervisionCapacity: 5,
    };

    render(<ProfessorProfileHeader profile={fullProfile} />);

    const capacityBadge = screen.getByText(/5 \/ 5 Slots \(Full\)/i);
    expect(capacityBadge).toBeInTheDocument();
    expect(capacityBadge).toHaveClass('text-amber-700');
  });

  it('should display "Full" when professor is explicitly not accepting projects regardless of count', () => {
    const notAcceptingProfile = {
      ...defaultProfile,
      isAcceptingProjects: false,
      currentProjectCount: 1,
      maxSupervisionCapacity: 5,
    };

    render(<ProfessorProfileHeader profile={notAcceptingProfile} />);

    expect(screen.getByText(/1 \/ 5 Slots \(Full\)/i)).toBeInTheDocument();
  });

  // --- EDIT BUTTON INTERACTIONS & STATES ---
  it('should render edit button when isEditing is false and onEditClick is provided', () => {
    const handleEdit = vi.fn();
    render(<ProfessorProfileHeader profile={defaultProfile} isEditing={false} onEditClick={handleEdit} />);

    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
  });

  it('should call onEditClick when edit button is clicked', async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    render(<ProfessorProfileHeader profile={defaultProfile} isEditing={false} onEditClick={handleEdit} />);

    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    await user.click(editBtn);

    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it('should NOT render edit button when isEditing is true', () => {
    render(<ProfessorProfileHeader profile={defaultProfile} isEditing={true} onEditClick={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /Edit Profile/i })).not.toBeInTheDocument();
  });

  it('should NOT render edit button when onEditClick is missing', () => {
    render(<ProfessorProfileHeader profile={defaultProfile} isEditing={false} />);

    expect(screen.queryByRole('button', { name: /Edit Profile/i })).not.toBeInTheDocument();
  });
});