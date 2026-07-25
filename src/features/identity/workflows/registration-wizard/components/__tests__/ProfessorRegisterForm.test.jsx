import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ProfessorRegisterForm from '../ProfessorRegisterForm';

describe('ProfessorRegisterForm', () => {
  const defaultProps = {
    formValues: {
      fullName: '',
      academicDepartment: '',
      rank: '',
      maxSupervisionCapacity: '5',
      aboutMe: '',
    },
    onFieldChange: vi.fn(),
  };

  it('renders structural elements and all required form inputs', () => {
    render(<ProfessorRegisterForm {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: /faculty mentor profile/i })
    ).toBeInTheDocument();

    const fullNameInput = screen.getByPlaceholderText('e.g., Dr. Sarah Jenkins');
    const deptInput = screen.getByPlaceholderText('e.g., Department of Computer Science');
    const rankInput = screen.getByPlaceholderText('e.g., Associate Professor');
    const capacityInput = screen.getByRole('spinbutton');

    expect(fullNameInput).toBeRequired();
    expect(deptInput).toBeRequired();
    expect(rankInput).toBeRequired();
    expect(capacityInput).toBeRequired();
  });

  it('handles fallback gracefully when formValues is empty or undefined', () => {
    render(<ProfessorRegisterForm formValues={{}} onFieldChange={vi.fn()} />);

    expect(screen.getByPlaceholderText('e.g., Dr. Sarah Jenkins')).toHaveValue('');
    expect(screen.getByPlaceholderText('e.g., Department of Computer Science')).toHaveValue('');
    expect(screen.getByPlaceholderText('e.g., Associate Professor')).toHaveValue('');
    expect(screen.getByRole('spinbutton')).toHaveValue(null);
    expect(screen.getByText('0 / 2000')).toBeInTheDocument();
  });

  it('invokes onFieldChange when user types into text input fields', async () => {
    const user = userEvent.setup();
    const onFieldChange = vi.fn();
    render(
      <ProfessorRegisterForm
        {...defaultProps}
        onFieldChange={onFieldChange}
      />
    );

    await user.type(screen.getByPlaceholderText('e.g., Dr. Sarah Jenkins'), 'Dr. Alan Turing');
    expect(onFieldChange).toHaveBeenCalledWith('fullName', 'D');

    await user.type(
      screen.getByPlaceholderText('e.g., Department of Computer Science'),
      'Mathematics'
    );
    expect(onFieldChange).toHaveBeenCalledWith('academicDepartment', 'M');

    await user.type(
      screen.getByPlaceholderText('e.g., Associate Professor'),
      'Professor'
    );
    expect(onFieldChange).toHaveBeenCalledWith('rank', 'P');
  });

  it('updates maxSupervisionCapacity through real state updates', async () => {
    const user = userEvent.setup();
    
    // Real state harness
    function TestHarness() {
        const [values, setValues] = useState({ maxSupervisionCapacity: '5' });
        return (
            <ProfessorRegisterForm
                formValues={values}
                onFieldChange={(key, val) =>
                    setValues((prev) => ({ ...prev, [key]: val }))
                }
            />
        );
    }

    render(<TestHarness />);

    const capacityInput = screen.getByRole('spinbutton');
    
    await user.clear(capacityInput);
    await user.type(capacityInput, '12');

    expect(capacityInput).toHaveValue(12);
    });

  describe('Biography Section Integration ([AC] Character Counter & Clear Action)', () => {
    it('[AC] renders character counter accurately updating based on aboutMe input', () => {
      const text = 'a'.repeat(150);
      render(
        <ProfessorRegisterForm
          {...defaultProps}
          formValues={{ ...defaultProps.formValues, aboutMe: text }}
        />
      );

      expect(screen.getByText('150 / 2000')).toBeInTheDocument();
    });

    it('[AC] renders "Skip / Clear" button when aboutMe is populated and clears value on click', async () => {
      const user = userEvent.setup();
      const onFieldChange = vi.fn();

      render(
        <ProfessorRegisterForm
          {...defaultProps}
          formValues={{
            ...defaultProps.formValues,
            aboutMe: 'Researching quantum algorithms.',
          }}
          onFieldChange={onFieldChange}
        />
      );

      const clearBtn = screen.getByRole('button', { name: /skip \/ clear/i });
      expect(clearBtn).toBeInTheDocument();

      await user.click(clearBtn);
      expect(onFieldChange).toHaveBeenCalledWith('aboutMe', '');
    });

    it('does not render "Skip / Clear" button when aboutMe is empty', () => {
      render(<ProfessorRegisterForm {...defaultProps} />);

      expect(
        screen.queryByRole('button', { name: /skip \/ clear/i })
      ).not.toBeInTheDocument();
    });

    it('prevents typing in bio textarea beyond character limit boundary (2000 chars)', async () => {
      const user = userEvent.setup();
      const onFieldChange = vi.fn();
      const text2000 = 'x'.repeat(2000);

      render(
        <ProfessorRegisterForm
          {...defaultProps}
          formValues={{ ...defaultProps.formValues, aboutMe: text2000 }}
          onFieldChange={onFieldChange}
        />
      );

      const bioTextarea = screen.getByPlaceholderText(/tell us about your research background/i);
      await user.type(bioTextarea, 'y');

      expect(onFieldChange).not.toHaveBeenCalled();
    });
  });
});