import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AdvisorCard } from '../AdvisorCard';

describe('AdvisorCard', () => {
  const mockProfessor = {
    id: 'prof-99',
    fullName: 'Dr. Claude Shannon',
    email: 'claude@university.edu',
    department: 'Electrical Engineering',
    researchInterests: ['Information Theory', 'Cryptography', 'Circuit Design', 'Boolean Algebra'],
    currentProjectCount: 1,
    maxSupervisionCapacity: 4,
    isAcceptingProjects: true,
  };

  const defaultProps = {
    professor: mockProfessor,
    rankIndex: 0,
    isSelected: false,
    onSelect: vi.fn(),
    onViewProfile: vi.fn(),
  };

  // --- GUARD CLAUSE ---
  it('returns null when professor prop is missing or null', () => {
    const { container: nullContainer } = render(<AdvisorCard professor={null} rankIndex={0} />);
    expect(nullContainer.firstChild).toBeNull();

    const { container: undefinedContainer } = render(<AdvisorCard professor={undefined} rankIndex={0} />);
    expect(undefinedContainer.firstChild).toBeNull();
  });

  // --- HAPPY PATH RENDERING ---
  it('renders professor name, match rank, department, email, and capacity', () => {
    render(<AdvisorCard {...defaultProps} />);

    expect(screen.getByText('Dr. Claude Shannon')).toBeInTheDocument();
    expect(screen.getByText('#1 Match')).toBeInTheDocument(); // rankIndex 0 -> #1 Match
    expect(screen.getByText('Electrical Engineering')).toBeInTheDocument();
    expect(screen.getByText('claude@university.edu')).toBeInTheDocument();

    expect(screen.getByText(/1 \/ 4 slots/i)).toBeInTheDocument();
  });

  it('formats match rank index correctly for higher ranks', () => {
    render(<AdvisorCard {...defaultProps} rankIndex={4} />);

    expect(screen.getByText('#5 Match')).toBeInTheDocument();
  });

  // --- RESEARCH INTERESTS & TRUNCATION ---
  it('displays up to 3 research interests and shows +N more badge for remainder', () => {
    render(<AdvisorCard {...defaultProps} />);

    expect(screen.getByText('Information Theory')).toBeInTheDocument();
    expect(screen.getByText('Cryptography')).toBeInTheDocument();
    expect(screen.getByText('Circuit Design')).toBeInTheDocument();

    // 4th interest 'Boolean Algebra' is hidden behind +1 more tag
    expect(screen.queryByText('Boolean Algebra')).not.toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('displays fallback message when researchInterests array is empty', () => {
    const profNoInterests = {
      ...mockProfessor,
      researchInterests: [],
    };

    render(<AdvisorCard {...defaultProps} professor={profNoInterests} />);

    expect(screen.getByText('No research interests specified.')).toBeInTheDocument();
  });

  // --- CAPACITY & SELECTION STATES ---
  it('renders "Selected" button text and highlighted styling when isSelected is true', () => {
    render(<AdvisorCard {...defaultProps} isSelected={true} />);

    expect(screen.getByRole('button', { name: /Selected/i })).toBeInTheDocument();
  });

  it('renders "Capacity Full" button text and disables select button when professor is at capacity', () => {
    const fullProf = {
      ...mockProfessor,
      currentProjectCount: 4,
      maxSupervisionCapacity: 4,
    };

    render(<AdvisorCard {...defaultProps} professor={fullProf} />);

    expect(screen.getByText(/4 \/ 4 slots \(Full\)/i)).toBeInTheDocument();

    const selectBtn = screen.getByRole('button', { name: /Capacity Full/i });
    expect(selectBtn).toBeDisabled();
  });

  // --- USER INTERACTIONS ---
  it('calls onViewProfile callback with professor payload when View Profile button is clicked', async () => {
    const user = userEvent.setup();
    const handleViewProfile = vi.fn();

    render(<AdvisorCard {...defaultProps} onViewProfile={handleViewProfile} />);

    const viewBtn = screen.getByRole('button', { name: /View Profile/i });
    await user.click(viewBtn);

    expect(handleViewProfile).toHaveBeenCalledWith(mockProfessor);
  });

  it('calls onSelect callback with professor payload when Select Advisor button is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<AdvisorCard {...defaultProps} onSelect={handleSelect} />);

    const selectBtn = screen.getByRole('button', { name: /Select Advisor/i });
    await user.click(selectBtn);

    expect(handleSelect).toHaveBeenCalledWith(mockProfessor);
  });

  it('does NOT call onSelect when select button is clicked on a full capacity advisor', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    const fullProf = {
      ...mockProfessor,
      currentProjectCount: 4,
      maxSupervisionCapacity: 4,
    };

    render(<AdvisorCard {...defaultProps} professor={fullProf} onSelect={handleSelect} />);

    const selectBtn = screen.getByRole('button', { name: /Capacity Full/i });
    await user.click(selectBtn);

    expect(handleSelect).not.toHaveBeenCalled();
  });
});