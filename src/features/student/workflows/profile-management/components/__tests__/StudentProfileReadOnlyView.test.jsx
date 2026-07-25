// __tests__/StudentProfileReadOnlyView.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentProfileReadOnlyView from '../StudentProfileReadOnlyView';
import StudentProfileHeader from '../StudentProfileHeader';
import StudentBiography from '../StudentBiography';
import ProfileTagGroup from '@/shared/components/TagGroup';
import { RecommendedSkillsGroup } from '@/features/skills';

// Mock sub-components to verify prop delegation
vi.mock('../StudentProfileHeader', () => ({
  default: vi.fn(({ fullName, graduationYear, onEditClick }) => (
    <div data-testid="student-profile-header">
      <span>{fullName}</span>
      <span>{graduationYear}</span>
      <button onClick={onEditClick}>Edit Header</button>
    </div>
  )),
}));

vi.mock('../StudentBiography', () => ({
  default: vi.fn(({ aboutMe }) => (
    <div data-testid="student-biography">{aboutMe}</div>
  )),
}));

vi.mock('@/shared/components/TagGroup', () => ({
  default: vi.fn(({ title, items, emptyText }) => (
    <div data-testid={`tag-group-${title}`}>
      <span>{title}</span>
      <span>Count: {items ? items.length : 0}</span>
      <span>{emptyText}</span>
    </div>
  )),
}));

vi.mock('@/features/skills', () => ({
  RecommendedSkillsGroup: vi.fn(({ recommendedSkills, selectedSkillIds, isLoading }) => (
    <div data-testid="recommended-skills-group">
      <span>Recs Count: {recommendedSkills ? recommendedSkills.length : 0}</span>
      <span>Selected Skill IDs: {selectedSkillIds ? selectedSkillIds.join(',') : ''}</span>
      <span>Loading: {String(isLoading)}</span>
    </div>
  )),
}));

describe('StudentProfileReadOnlyView', () => {
  const defaultProps = {
    fullName: 'Jane Doe',
    graduationYear: 2026,
    aboutMe: 'Computer Science enthusiast',
    selectedMajors: [{ id: 'm1', name: 'Computer Science' }],
    selectedSpecialties: [{ id: 'sp1', name: 'Software Engineering' }],
    selectedSkills: [{ id: 's1', name: 'React' }],
    recommendedSkills: [{ id: 's2', name: 'TypeScript' }],
    selectedSkillIds: ['s1'],
    isRecsSkillsLoading: false,
    onEditClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Sub-Component Orchestration & Prop Delegation', () => {
    it('should pass correct props to StudentProfileHeader', () => {
      render(<StudentProfileReadOnlyView {...defaultProps} />);

      expect(screen.getByTestId('student-profile-header')).toBeDefined();
      expect(screen.getByText('Jane Doe')).toBeDefined();

      const headerCall = vi.mocked(StudentProfileHeader).mock.calls[0][0];
      expect(headerCall.fullName).toBe('Jane Doe');
      expect(headerCall.graduationYear).toBe(2026);
      expect(headerCall.onEditClick).toBe(defaultProps.onEditClick);
    });

    it('should pass correct props to StudentBiography', () => {
      render(<StudentProfileReadOnlyView {...defaultProps} />);

      expect(screen.getByTestId('student-biography')).toBeDefined();

      const bioCall = vi.mocked(StudentBiography).mock.calls[0][0];
      expect(bioCall.aboutMe).toBe('Computer Science enthusiast');
    });

    it('should render 3 ProfileTagGroup instances with specific titles and emptyTexts', () => {
      render(<StudentProfileReadOnlyView {...defaultProps} />);

      expect(screen.getByTestId('tag-group-Academic Majors')).toBeDefined();
      expect(screen.getByTestId('tag-group-Sub-Track Focus Areas')).toBeDefined();
      expect(screen.getByTestId('tag-group-Technical Core Competencies')).toBeDefined();

      const tagGroupCalls = vi.mocked(ProfileTagGroup).mock.calls;
      expect(tagGroupCalls).toHaveLength(3);

      // Academic Majors TagGroup
      expect(tagGroupCalls[0][0].title).toBe('Academic Majors');
      expect(tagGroupCalls[0][0].items).toEqual(defaultProps.selectedMajors);
      expect(tagGroupCalls[0][0].emptyText).toBe('No academic majors configured.');

      // Sub-Track Focus Areas TagGroup
      expect(tagGroupCalls[1][0].title).toBe('Sub-Track Focus Areas');
      expect(tagGroupCalls[1][0].items).toEqual(defaultProps.selectedSpecialties);
      expect(tagGroupCalls[1][0].emptyText).toBe('No sub-track focus specialties selected.');

      // Technical Core Competencies TagGroup
      expect(tagGroupCalls[2][0].title).toBe('Technical Core Competencies');
      expect(tagGroupCalls[2][0].items).toEqual(defaultProps.selectedSkills);
      expect(tagGroupCalls[2][0].emptyText).toBe('No technical core competencies declared.');
    });

    it('should pass correct props to RecommendedSkillsGroup', () => {
      render(<StudentProfileReadOnlyView {...defaultProps} isRecsSkillsLoading={true} />);

      expect(screen.getByTestId('recommended-skills-group')).toBeDefined();

      const recsCall = vi.mocked(RecommendedSkillsGroup).mock.calls[0][0];
      expect(recsCall.recommendedSkills).toEqual(defaultProps.recommendedSkills);
      expect(recsCall.selectedSkillIds).toEqual(defaultProps.selectedSkillIds);
      expect(recsCall.isLoading).toBe(true);
    });
  });

  describe('Default Fallbacks & Edge Cases', () => {
    it('should render without crashing when optional array props are omitted', () => {
      render(
        <StudentProfileReadOnlyView
          fullName="John Smith"
          onEditClick={vi.fn()}
        />
      );

      const tagGroupCalls = vi.mocked(ProfileTagGroup).mock.calls;
      expect(tagGroupCalls[0][0].items).toEqual([]);
      expect(tagGroupCalls[1][0].items).toEqual([]);
      expect(tagGroupCalls[2][0].items).toEqual([]);

      const recsCall = vi.mocked(RecommendedSkillsGroup).mock.calls[0][0];
      expect(recsCall.recommendedSkills).toEqual([]);
      expect(recsCall.selectedSkillIds).toEqual([]);
      expect(recsCall.isLoading).toBe(false);
    });
  });
});