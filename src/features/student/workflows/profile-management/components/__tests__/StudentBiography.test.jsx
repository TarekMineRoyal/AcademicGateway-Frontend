// __tests__/StudentBiography.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StudentBiography from '../StudentBiography';

describe('StudentBiography', () => {
  it('should render the section heading always', () => {
    render(<StudentBiography aboutMe="Test bio" />);
    expect(screen.getByText('About Me / Biography')).toBeDefined();
  });

  it('should render provided aboutMe biography text', () => {
    const sampleBio = 'Hello, I am a software engineering student passionate about full-stack development.';
    render(<StudentBiography aboutMe={sampleBio} />);

    expect(screen.getByText(sampleBio)).toBeDefined();
    expect(screen.queryByText('No biography provided yet.')).toBeNull();
  });

  it('should render empty state placeholder when aboutMe is an empty string', () => {
    render(<StudentBiography aboutMe="" />);

    expect(screen.getByText('No biography provided yet.')).toBeDefined();
  });

  it('should render empty state placeholder when aboutMe is undefined', () => {
    render(<StudentBiography aboutMe={undefined} />);

    expect(screen.getByText('No biography provided yet.')).toBeDefined();
  });

  it('should render empty state placeholder when aboutMe is null', () => {
    render(<StudentBiography aboutMe={null} />);

    expect(screen.getByText('No biography provided yet.')).toBeDefined();
  });
});