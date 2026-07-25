// __tests__/StudentProfileHeader.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StudentProfileHeader from '../StudentProfileHeader';

describe('StudentProfileHeader', () => {
  const defaultProps = {
    fullName: 'Alex Morgan',
    graduationYear: 2026,
    onEditClick: vi.fn(),
  };

  it('should render full name and formatted graduation year when numeric year is provided', () => {
    render(<StudentProfileHeader {...defaultProps} />);

    expect(screen.getByText('Alex Morgan')).toBeDefined();
    expect(screen.getByText('Class of 2026')).toBeDefined();
  });

  it('should format graduation year correctly when passed as a string', () => {
    render(
      <StudentProfileHeader
        fullName="Alex Morgan"
        graduationYear="2027"
        onEditClick={vi.fn()}
      />
    );

    expect(screen.getByText('Class of 2027')).toBeDefined();
  });

  it('should render "Class Year Unspecified" when graduationYear is null or undefined', () => {
    render(
      <StudentProfileHeader
        fullName="Alex Morgan"
        graduationYear={null}
        onEditClick={vi.fn()}
      />
    );

    expect(screen.getByText('Class Year Unspecified')).toBeDefined();
    expect(screen.queryByText(/Class of/i)).toBeNull();
  });

  it('should render "Class Year Unspecified" when graduationYear is an empty string', () => {
    render(
      <StudentProfileHeader
        fullName="Alex Morgan"
        graduationYear=""
        onEditClick={vi.fn()}
      />
    );

    expect(screen.getByText('Class Year Unspecified')).toBeDefined();
  });

  it('should call onEditClick callback when Edit Academic Profile button is clicked', () => {
    const onEditClickMock = vi.fn();
    render(
      <StudentProfileHeader
        {...defaultProps}
        onEditClick={onEditClickMock}
      />
    );

    const editButton = screen.getByRole('button', { name: /Edit Academic Profile/i });
    fireEvent.click(editButton);

    expect(onEditClickMock).toHaveBeenCalledTimes(1);
  });
});