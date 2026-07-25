// __tests__/StudentPersonalInfoForm.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentPersonalInfoForm from '../StudentPersonalInfoForm';

describe('StudentPersonalInfoForm', () => {
  const defaultProps = {
    fullName: 'Jane Doe',
    setFullName: vi.fn(),
    graduationYear: '2026',
    setGraduationYear: vi.fn(),
    aboutMe: 'Software engineering student',
    setAboutMe: vi.fn(),
  };

  const getAboutMeTextarea = () =>
    screen.getByPlaceholderText(/Tell us a little bit about yourself/i);

  const getGraduationInput = () =>
    screen.getByPlaceholderText('e.g. 2027');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Render & Initial Field Values', () => {
    it('should render input fields with provided prop values and correct character counter', () => {
      render(<StudentPersonalInfoForm {...defaultProps} />);

      const nameInput = screen.getByDisplayValue('Jane Doe');
      const yearInput = getGraduationInput();
      const aboutMeInput = getAboutMeTextarea();

      expect(nameInput.value).toBe('Jane Doe');
      expect(yearInput.value).toBe('2026');
      expect(aboutMeInput.value).toBe('Software engineering student');
      
      // Character count: "Software engineering student".length = 28
      expect(screen.getByText('28 / 2000')).toBeDefined();
    });

    it('should render fallback empty string and 0 / 2000 counter when aboutMe is null or undefined', () => {
      render(
        <StudentPersonalInfoForm
          {...defaultProps}
          aboutMe={undefined}
        />
      );

      const aboutMeInput = getAboutMeTextarea();
      expect(aboutMeInput.value).toBe('');
      expect(screen.getByText('0 / 2000')).toBeDefined();
    });
  });

  describe('User Interactivity & Callbacks', () => {
    it('should call setFullName when full name input changes', () => {
      render(<StudentPersonalInfoForm {...defaultProps} />);

      const nameInput = screen.getByDisplayValue('Jane Doe');
      fireEvent.change(nameInput, { target: { value: 'John Smith' } });

      expect(defaultProps.setFullName).toHaveBeenCalledTimes(1);
      expect(defaultProps.setFullName).toHaveBeenCalledWith('John Smith');
    });

    it('should call setGraduationYear when graduation year input changes', () => {
      render(<StudentPersonalInfoForm {...defaultProps} />);

      const yearInput = getGraduationInput();
      fireEvent.change(yearInput, { target: { value: '2028' } });

      expect(defaultProps.setGraduationYear).toHaveBeenCalledTimes(1);
      expect(defaultProps.setGraduationYear).toHaveBeenCalledWith('2028');
    });

    it('should call setAboutMe when typed text length is under MAX_ABOUT_ME_LENGTH (2000)', () => {
      render(<StudentPersonalInfoForm {...defaultProps} />);

      const aboutMeInput = getAboutMeTextarea();
      fireEvent.change(aboutMeInput, { target: { value: 'Updated bio text' } });

      expect(defaultProps.setAboutMe).toHaveBeenCalledTimes(1);
      expect(defaultProps.setAboutMe).toHaveBeenCalledWith('Updated bio text');
    });
  });

  describe('Character Limit Enforcement & Styling (2000 Limit)', () => {
    it('should call setAboutMe when typed text length is exactly 2000 characters', () => {
      render(<StudentPersonalInfoForm {...defaultProps} />);

      const boundaryText = 'a'.repeat(2000);
      const aboutMeInput = getAboutMeTextarea();
      fireEvent.change(aboutMeInput, { target: { value: boundaryText } });

      expect(defaultProps.setAboutMe).toHaveBeenCalledWith(boundaryText);
    });

    it('should NOT call setAboutMe when typed text length exceeds 2000 characters', () => {
      render(<StudentPersonalInfoForm {...defaultProps} />);

      const oversizedText = 'a'.repeat(2001);
      const aboutMeInput = getAboutMeTextarea();
      fireEvent.change(aboutMeInput, { target: { value: oversizedText } });

      expect(defaultProps.setAboutMe).not.toHaveBeenCalled();
    });

    it('should apply standard slate counter text style when aboutMe length <= 2000', () => {
      render(<StudentPersonalInfoForm {...defaultProps} aboutMe="Short text" />);

      const counterSpan = screen.getByText('10 / 2000');
      expect(counterSpan.className).toContain('text-slate-400');
      expect(counterSpan.className).not.toContain('text-red-500');
    });

    it('should apply red error styling to counter span when aboutMe prop exceeds 2000 characters', () => {
      const longProp = 'a'.repeat(2005);
      render(<StudentPersonalInfoForm {...defaultProps} aboutMe={longProp} />);

      const counterSpan = screen.getByText('2005 / 2000');
      expect(counterSpan.className).toContain('text-red-500');
      expect(counterSpan.className).toContain('font-bold');
    });
  });
});