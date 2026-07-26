import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProfessorProfileReadOnlyView } from '../ProfessorProfileReadOnlyView';

describe('ProfessorProfileReadOnlyView', () => {
  const completeProfile = {
    fullName: 'Dr. Alan Turing',
    rank: 'Professor',
    department: 'Mathematics',
    email: 'alan@turing.ac.uk',
    currentProjectCount: 3,
    maxSupervisionCapacity: 5,
    researchInterests: ['Cryptography', 'Computation', 'AI'],
    aboutMe: 'Father of modern computer science.',
  };

  // --- EDGE CASES: NULL / MISSING PROPS ---
  it('returns null when profile prop is null or undefined', () => {
    const { container: nullContainer } = render(<ProfessorProfileReadOnlyView profile={null} />);
    expect(nullContainer.firstChild).toBeNull();

    const { container: undefinedContainer } = render(<ProfessorProfileReadOnlyView profile={undefined} />);
    expect(undefinedContainer.firstChild).toBeNull();
  });

  // --- HAPPY PATH ---
  it('renders complete profile data including header, research interests, and bio', () => {
    render(<ProfessorProfileReadOnlyView profile={completeProfile} />);

    // Header info check
    expect(screen.getByText('Dr. Alan Turing')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();

    // Research interests tags check
    expect(screen.getByText('Cryptography')).toBeInTheDocument();
    expect(screen.getByText('Computation')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();

    // About Me bio check
    expect(screen.getByText('Father of modern computer science.')).toBeInTheDocument();
  });

  // --- FALLBACK STATES & EDGE CASES ---
  it('displays fallback message when researchInterests is empty or omitted', () => {
    const { rerender } = render(
      <ProfessorProfileReadOnlyView profile={{ fullName: 'Dr. Test', researchInterests: [] }} />
    );
    expect(screen.getByText('No research interests specified yet.')).toBeInTheDocument();

    rerender(<ProfessorProfileReadOnlyView profile={{ fullName: 'Dr. Test' }} />);
    expect(screen.getByText('No research interests specified yet.')).toBeInTheDocument();
  });

  it('displays fallback message when aboutMe is empty or omitted', () => {
    const { rerender } = render(
      <ProfessorProfileReadOnlyView profile={{ fullName: 'Dr. Test', aboutMe: '' }} />
    );
    expect(screen.getByText('No detailed background provided.')).toBeInTheDocument();

    rerender(<ProfessorProfileReadOnlyView profile={{ fullName: 'Dr. Test' }} />);
    expect(screen.getByText('No detailed background provided.')).toBeInTheDocument();
  });

  // --- INTERACTION PROPAGATION ---
  it('triggers onEditClick callback when edit button in header is clicked', async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();

    render(<ProfessorProfileReadOnlyView profile={completeProfile} onEditClick={handleEdit} />);

    const editButton = screen.getByRole('button', { name: /Edit Profile/i });
    await user.click(editButton);

    expect(handleEdit).toHaveBeenCalledTimes(1);
  });
});