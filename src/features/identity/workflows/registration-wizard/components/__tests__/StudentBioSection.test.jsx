import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StudentBioSection from '../StudentBioSection';

describe('StudentBioSection', () => {
  const defaultProps = {
    formValues: { aboutMe: '' },
    onFieldChange: vi.fn(),
  };

  it('renders default state correctly without crashing when formValues is empty or undefined', () => {
    render(<StudentBioSection onFieldChange={vi.fn()} />);

    expect(screen.getByLabelText(/about me \/ biography/i)).toBeInTheDocument();
    expect(screen.getByText('0 / 2000')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /skip \/ clear/i })
    ).not.toBeInTheDocument();
  });

  it('[AC] renders character counter accurately reflecting aboutMe length', () => {
    const text = 'a'.repeat(150);
    render(
      <StudentBioSection
        {...defaultProps}
        formValues={{ aboutMe: text }}
      />
    );

    expect(screen.getByText('150 / 2000')).toBeInTheDocument();
  });

  it('invokes onFieldChange with updated text when typing within character limit', async () => {
    const user = userEvent.setup();
    const onFieldChange = vi.fn();
    render(
      <StudentBioSection
        {...defaultProps}
        onFieldChange={onFieldChange}
      />
    );

    const textarea = screen.getByPlaceholderText(/tell us a little bit about yourself/i);
    await user.type(textarea, 'Testing bio');

    expect(onFieldChange).toHaveBeenCalledWith('aboutMe', 'T');
  });

  it('[AC] renders "Skip / Clear" button when aboutMe has text and triggers onFieldChange with empty string on click', async () => {
    const user = userEvent.setup();
    const onFieldChange = vi.fn();
    render(
      <StudentBioSection
        formValues={{ aboutMe: 'Existing biography text' }}
        onFieldChange={onFieldChange}
      />
    );

    const clearButton = screen.getByRole('button', { name: /skip \/ clear/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(onFieldChange).toHaveBeenCalledTimes(1);
    expect(onFieldChange).toHaveBeenCalledWith('aboutMe', '');
  });

  describe('Boundary & Limit Edge Cases', () => {
    it('allows typing up to max limit boundary (2000 chars)', async () => {
      const user = userEvent.setup();
      const onFieldChange = vi.fn();
      const text1999 = 'a'.repeat(1999);

      render(
        <StudentBioSection
          formValues={{ aboutMe: text1999 }}
          onFieldChange={onFieldChange}
        />
      );

      const textarea = screen.getByPlaceholderText(/tell us a little bit about yourself/i);
      await user.type(textarea, 'b');

      expect(onFieldChange).toHaveBeenCalledWith('aboutMe', `${text1999}b`);
    });

    it('blocks typing and prevents onFieldChange invocation when input length exceeds 2000 chars', async () => {
      const user = userEvent.setup();
      const onFieldChange = vi.fn();
      const text2000 = 'a'.repeat(2000);

      render(
        <StudentBioSection
          formValues={{ aboutMe: text2000 }}
          onFieldChange={onFieldChange}
        />
      );

      const textarea = screen.getByPlaceholderText(/tell us a little bit about yourself/i);
      await user.type(textarea, 'z');

      expect(onFieldChange).not.toHaveBeenCalled();
    });

    it('handles over-limit prop values gracefully by rendering red error indicators', () => {
      const text2001 = 'a'.repeat(2001);

      render(
        <StudentBioSection
          {...defaultProps}
          formValues={{ aboutMe: text2001 }}
        />
      );

      const counter = screen.getByText('2001 / 2000');
      expect(counter).toBeInTheDocument();
      expect(counter).toHaveClass('text-red-500');

      const textarea = screen.getByPlaceholderText(/tell us a little bit about yourself/i);
      expect(textarea).toHaveClass('border-red-500');
    });
  });
});