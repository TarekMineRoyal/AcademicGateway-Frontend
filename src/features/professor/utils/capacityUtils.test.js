import { describe, it, expect } from 'vitest';
import { isProfessorFull } from './capacityUtils';

describe('isProfessorFull', () => {
  it('should return false if professor is null or undefined', () => {
    expect(isProfessorFull(null)).toBe(false);
    expect(isProfessorFull(undefined)).toBe(false);
  });

  it('should return true if professor is explicitly not accepting projects', () => {
    const professor = {
      isAcceptingProjects: false,
      currentProjectCount: 1,
      maxSupervisionCapacity: 5,
    };
    expect(isProfessorFull(professor)).toBe(true);
  });

  it('should return false if currentProjectCount is missing or null', () => {
    expect(
      isProfessorFull({
        isAcceptingProjects: true,
        currentProjectCount: null,
        maxSupervisionCapacity: 5,
      })
    ).toBe(false);

    expect(
      isProfessorFull({
        isAcceptingProjects: true,
        currentProjectCount: undefined,
        maxSupervisionCapacity: 5,
      })
    ).toBe(false);
  });

  it('should return false if maxSupervisionCapacity is missing or null', () => {
    expect(
      isProfessorFull({
        isAcceptingProjects: true,
        currentProjectCount: 3,
        maxSupervisionCapacity: null,
      })
    ).toBe(false);

    expect(
      isProfessorFull({
        isAcceptingProjects: true,
        currentProjectCount: 3,
        maxSupervisionCapacity: undefined,
      })
    ).toBe(false);
  });

  it('should return false when currentProjectCount is less than maxSupervisionCapacity', () => {
    const professor = {
      isAcceptingProjects: true,
      currentProjectCount: 3,
      maxSupervisionCapacity: 5,
    };
    expect(isProfessorFull(professor)).toBe(false);
  });

  it('should return true when currentProjectCount equals maxSupervisionCapacity', () => {
    const professor = {
      isAcceptingProjects: true,
      currentProjectCount: 5,
      maxSupervisionCapacity: 5,
    };
    expect(isProfessorFull(professor)).toBe(true);
  });

  it('should return true when currentProjectCount exceeds maxSupervisionCapacity', () => {
    const professor = {
      isAcceptingProjects: true,
      currentProjectCount: 6,
      maxSupervisionCapacity: 5,
    };
    expect(isProfessorFull(professor)).toBe(true);
  });

  it('should handle string numbers correctly via numeric coercion', () => {
    const professor = {
      isAcceptingProjects: true,
      currentProjectCount: '5',
      maxSupervisionCapacity: '5',
    };
    expect(isProfessorFull(professor)).toBe(true);
  });
});