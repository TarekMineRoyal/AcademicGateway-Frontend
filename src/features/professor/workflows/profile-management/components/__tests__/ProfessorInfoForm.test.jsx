import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfessorInfoForm } from '../ProfessorInfoForm';

describe('ProfessorInfoForm', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      fullName: 'Dr. Eleanor Vance',
      setFullName: vi.fn(),
      department: 'Computer Science',
      setDepartment: vi.fn(),
      rank: 'Associate Professor',
      setRank: vi.fn(),
      maxSupervisionCapacity: 5,
      setMaxSupervisionCapacity: vi.fn(),
      researchInterests: ['Machine Learning', 'AI Ethics'],
      setResearchInterests: vi.fn(),
      aboutMe: 'Passionate about AI safety.',
      setAboutMe: vi.fn(),
    };
  });

  // --- INITIAL RENDERING ---
  it('renders all form fields with initial prop values', () => {
    render(<ProfessorInfoForm {...defaultProps} />);

    expect(screen.getByDisplayValue('Dr. Eleanor Vance')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Associate Professor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Computer Science')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Passionate about AI safety.')).toBeInTheDocument();

    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('AI Ethics')).toBeInTheDocument();
  });

  it('displays empty state text when researchInterests is an empty array', () => {
    render(<ProfessorInfoForm {...defaultProps} researchInterests={[]} />);

    expect(screen.getByText('No research interests added yet.')).toBeInTheDocument();
  });

  // --- FIELD INPUT CHANGES ---
  it('calls corresponding setters on field input changes', () => {
    render(<ProfessorInfoForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Dr\. Eleanor Vance/i);
    fireEvent.change(nameInput, { target: { value: 'Dr. Eleanor Vance Updated' } });
    expect(defaultProps.setFullName).toHaveBeenCalledWith('Dr. Eleanor Vance Updated');

    const rankInput = screen.getByPlaceholderText(/e\.g\. Associate Professor/i);
    fireEvent.change(rankInput, { target: { value: 'Full Professor' } });
    expect(defaultProps.setRank).toHaveBeenCalledWith('Full Professor');

    const deptInput = screen.getByPlaceholderText(/e\.g\. Computer Science/i);
    fireEvent.change(deptInput, { target: { value: 'Mathematics' } });
    expect(defaultProps.setDepartment).toHaveBeenCalledWith('Mathematics');

    const capInput = screen.getByDisplayValue('5');
    fireEvent.change(capInput, { target: { value: '8' } });
    expect(defaultProps.setMaxSupervisionCapacity).toHaveBeenCalledWith('8');

    const bioInput = screen.getByPlaceholderText(/Describe your background/i);
    fireEvent.change(bioInput, { target: { value: 'New updated bio.' } });
    expect(defaultProps.setAboutMe).toHaveBeenCalledWith('New updated bio.');
  });

  // --- ADDING RESEARCH INTERESTS ---
  it('adds a new research interest when clicking the Add button', async () => {
    const user = userEvent.setup();
    render(<ProfessorInfoForm {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Add a research topic/i);
    const addBtn = screen.getByRole('button', { name: /Add/i });

    await user.type(input, 'Robotics');
    await user.click(addBtn);

    expect(defaultProps.setResearchInterests).toHaveBeenCalledWith([
      'Machine Learning',
      'AI Ethics',
      'Robotics',
    ]);
    expect(input).toHaveValue('');
  });

  it('adds a new research interest when pressing Enter key in input field', async () => {
    const user = userEvent.setup();
    render(<ProfessorInfoForm {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Add a research topic/i);
    await user.type(input, 'Quantum Computing{Enter}');

    expect(defaultProps.setResearchInterests).toHaveBeenCalledWith([
      'Machine Learning',
      'AI Ethics',
      'Quantum Computing',
    ]);
  });

  // --- RESEARCH INTEREST EDGE CASES ---
  it('trims leading and trailing whitespace when adding a topic', async () => {
    const user = userEvent.setup();
    render(<ProfessorInfoForm {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Add a research topic/i);
    await user.type(input, '   NLP   {Enter}');

    expect(defaultProps.setResearchInterests).toHaveBeenCalledWith([
      'Machine Learning',
      'AI Ethics',
      'NLP',
    ]);
  });

  it('does NOT add empty or whitespace-only research interest', async () => {
    const user = userEvent.setup();
    render(<ProfessorInfoForm {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Add a research topic/i);
    await user.type(input, '     {Enter}');

    expect(defaultProps.setResearchInterests).not.toHaveBeenCalled();
  });

  it('does NOT add duplicate research interest if topic already exists', async () => {
    const user = userEvent.setup();
    render(<ProfessorInfoForm {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Add a research topic/i);
    await user.type(input, 'Machine Learning{Enter}');

    expect(defaultProps.setResearchInterests).not.toHaveBeenCalled();
  });

  // --- REMOVING RESEARCH INTERESTS ---
  it('removes an interest item when clicking its remove button', async () => {
    const user = userEvent.setup();
    render(<ProfessorInfoForm {...defaultProps} />);

    const pill = screen.getByText('Machine Learning');
    const removeBtn = pill.querySelector('button');

    await user.click(removeBtn);

    expect(defaultProps.setResearchInterests).toHaveBeenCalledWith(['AI Ethics']);
  });
});