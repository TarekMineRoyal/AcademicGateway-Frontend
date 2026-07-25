import { describe, it, expect } from 'vitest';
import { UserRole } from '@/config/roles';
import { registrationStrategies } from '../registrationStrategies';

describe('registrationStrategies', () => {
  describe('STUDENT Strategy', () => {
    const studentStrategy = registrationStrategies[UserRole.STUDENT];

    describe('validate', () => {
      it('should return true for valid inputs', () => {
        const validForm = {
          fullName: 'Jane Doe',
          aboutMe: 'Passionate student developer.',
        };
        expect(studentStrategy.validate(validForm)).toBe(true);
      });

      it('should return false if fullName is missing, empty, or whitespace-only', () => {
        expect(studentStrategy.validate({ fullName: '', aboutMe: '' })).toBe(false);
        expect(studentStrategy.validate({ fullName: '   ', aboutMe: '' })).toBe(false);
      });

      it('should return true when optional aboutMe is omitted', () => {
        expect(studentStrategy.validate({ fullName: 'Jane Doe' })).toBe(true);
      });

      it('should enforce 2000 character limit boundary on aboutMe', () => {
        const exactly2000 = 'a'.repeat(2000);
        const chars2001 = 'a'.repeat(2001);

        expect(
          studentStrategy.validate({ fullName: 'Jane Doe', aboutMe: exactly2000 })
        ).toBe(true);

        expect(
          studentStrategy.validate({ fullName: 'Jane Doe', aboutMe: chars2001 })
        ).toBe(false);
      });
    });

    describe('compileDto', () => {
      it('should convert graduationYear string to integer and map array fields', () => {
        const formValues = {
          email: 'student@example.com',
          password: 'securePassword123',
          fullName: 'Jane Doe',
          aboutMe: '  Computer Science major  ',
          graduationYear: '2026',
          majorIds: [1, 2],
          specialtyIds: [10],
          skillIds: [101, 102, 103],
        };

        const result = studentStrategy.compileDto(formValues);

        expect(result).toEqual({
          email: 'student@example.com',
          username: 'student@example.com',
          password: 'securePassword123',
          fullName: 'Jane Doe',
          aboutMe: 'Computer Science major',
          graduationYear: 2026,
          majorIds: [1, 2],
          specialtyIds: [10],
          skillIds: [101, 102, 103],
        });
      });

      it('should handle missing or empty optional fields cleanly', () => {
        const formValues = {
          email: 'student@example.com',
          password: 'securePassword123',
          fullName: 'Jane Doe',
          aboutMe: '   ',
          graduationYear: '',
          majorIds: [],
          specialtyIds: [],
          skillIds: [],
        };

        const result = studentStrategy.compileDto(formValues);

        expect(result.graduationYear).toBeNull();
        expect(result.aboutMe).toBeNull();
      });

      it('should set graduationYear and aboutMe to null when omitted entirely', () => {
        const formValues = {
          email: 'student@example.com',
          password: 'securePassword123',
          fullName: 'Jane Doe',
        };

        const result = studentStrategy.compileDto(formValues);

        expect(result.graduationYear).toBeNull();
        expect(result.aboutMe).toBeNull();
      });
    });

    describe('getReviewItems', () => {
      it('should return formatted summary review items', () => {
        const formValues = { fullName: 'Jane Doe', graduationYear: '2026' };
        const items = studentStrategy.getReviewItems(formValues);

        expect(items).toEqual([
          { label: 'Full Name', value: 'Jane Doe' },
          { label: 'Target Graduation Year', value: '2026' },
        ]);
      });
    });
  });

  describe('PROFESSOR Strategy', () => {
    const professorStrategy = registrationStrategies[UserRole.PROFESSOR];

    describe('validate', () => {
      it('should return true when all required fields are present and valid', () => {
        const validForm = {
          fullName: 'Dr. Alan Turing',
          academicDepartment: 'Computer Science',
          rank: 'Full Professor',
          aboutMe: 'Researcher in AI',
        };
        expect(professorStrategy.validate(validForm)).toBe(true);
      });

      it('should fail validation if department or rank is empty or whitespace-only', () => {
        const baseForm = {
          fullName: 'Dr. Alan Turing',
          academicDepartment: 'Computer Science',
          rank: 'Full Professor',
        };

        expect(professorStrategy.validate({ ...baseForm, academicDepartment: '' })).toBe(false);
        expect(professorStrategy.validate({ ...baseForm, academicDepartment: '   ' })).toBe(false);
        expect(professorStrategy.validate({ ...baseForm, rank: '' })).toBe(false);
        expect(professorStrategy.validate({ ...baseForm, rank: '   ' })).toBe(false);
      });

      it('should enforce 2000 character limit boundary on aboutMe', () => {
        const baseForm = {
          fullName: 'Dr. Alan Turing',
          academicDepartment: 'Computer Science',
          rank: 'Full Professor',
        };

        expect(
          professorStrategy.validate({ ...baseForm, aboutMe: 'a'.repeat(2000) })
        ).toBe(true);

        expect(
          professorStrategy.validate({ ...baseForm, aboutMe: 'a'.repeat(2001) })
        ).toBe(false);
      });
    });

    describe('compileDto', () => {
      it('should parse valid maxSupervisionCapacity to integer', () => {
        const formValues = {
          email: 'prof@university.edu',
          password: 'password123',
          fullName: 'Dr. Alan Turing',
          academicDepartment: 'Computer Science',
          rank: 'Professor',
          maxSupervisionCapacity: '5',
        };

        const result = professorStrategy.compileDto(formValues);
        expect(result.maxSupervisionCapacity).toBe(5);
      });

      it('should default maxSupervisionCapacity to 3 when omitted, empty, or non-numeric', () => {
        const baseForm = {
          email: 'prof@university.edu',
          password: 'password123',
          fullName: 'Dr. Alan Turing',
          academicDepartment: 'CS',
          rank: 'Professor',
        };

        expect(
          professorStrategy.compileDto({ ...baseForm, maxSupervisionCapacity: '' }).maxSupervisionCapacity
        ).toBe(3);

        expect(
          professorStrategy.compileDto({ ...baseForm, maxSupervisionCapacity: undefined }).maxSupervisionCapacity
        ).toBe(3);

        expect(
          professorStrategy.compileDto({ ...baseForm, maxSupervisionCapacity: 'invalid' }).maxSupervisionCapacity
        ).toBe(3);
      });
    });
  });

  describe('PROVIDER Strategy', () => {
    const providerStrategy = registrationStrategies[UserRole.PROVIDER];

    describe('validate', () => {
      it('should return true for valid company details', () => {
        const validForm = {
          companyName: 'Acme Corp',
          companyDescription: 'Leading tech innovator.',
        };
        expect(providerStrategy.validate(validForm)).toBe(true);
      });

      it('should return false if companyName or companyDescription is empty or whitespace-only', () => {
        expect(
          providerStrategy.validate({ companyName: '  ', companyDescription: 'Valid desc' })
        ).toBe(false);

        expect(
          providerStrategy.validate({ companyName: 'Acme Corp', companyDescription: '   ' })
        ).toBe(false);
      });
    });

    describe('compileDto', () => {
      it('should trim websiteUrl', () => {
        const formValues = {
          email: 'contact@acme.com',
          password: 'password123',
          companyName: 'Acme Corp',
          companyDescription: 'Innovations',
          websiteUrl: '   https://acme.com   ',
        };

        const result = providerStrategy.compileDto(formValues);
        expect(result.websiteUrl).toBe('https://acme.com');
      });

      it('should set websiteUrl to null when empty or whitespace-only', () => {
        const formValues = {
          email: 'contact@acme.com',
          password: 'password123',
          companyName: 'Acme Corp',
          companyDescription: 'Innovations',
          websiteUrl: '   ',
        };

        const result = providerStrategy.compileDto(formValues);
        expect(result.websiteUrl).toBeNull();
      });
    });
  });
});