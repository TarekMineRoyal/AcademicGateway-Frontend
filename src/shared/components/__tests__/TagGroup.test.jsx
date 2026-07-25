import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TagGroup from '../TagGroup';

describe('TagGroup Component', () => {
  const sampleItems = [
    { id: '1', name: 'Software Architecture' },
    { id: '2', name: 'Distributed Systems' },
  ];

  // ==========================================================================
  // HAPPY PATH TESTS
  // ==========================================================================
  describe('Happy Path', () => {
    it('renders section title and list of badges correctly', () => {
      render(
        <TagGroup
          title="Academic Focus Areas"
          items={sampleItems}
          emptyText="No focus areas."
        />
      );

      expect(screen.getByRole('heading', { level: 3, name: /academic focus areas/i })).toBeInTheDocument();
      expect(screen.getByText('Software Architecture')).toBeInTheDocument();
      expect(screen.getByText('Distributed Systems')).toBeInTheDocument();
      expect(screen.queryByText('No focus areas.')).not.toBeInTheDocument();
    });

    it('renders emptyText fallback when items array is empty', () => {
      render(
        <TagGroup
          title="Academic Focus Areas"
          items={[]}
          emptyText="No focus areas configured."
        />
      );

      expect(screen.getByRole('heading', { level: 3, name: /academic focus areas/i })).toBeInTheDocument();
      expect(screen.getByText('No focus areas configured.')).toBeInTheDocument();
    });

    it('applies custom badgeClassName correctly to rendered badges', () => {
      const customClass = 'custom-badge-style';

      render(
        <TagGroup
          title="Skills"
          items={sampleItems}
          emptyText="No skills."
          badgeClassName={customClass}
        />
      );

      const badge = screen.getByText('Software Architecture');
      expect(badge).toHaveClass('custom-badge-style');
    });
  });

  // ==========================================================================
  // EDGE CASE TESTS
  // ==========================================================================
  describe('Edge Cases', () => {
    it('renders emptyText when items prop is undefined (falls back to default empty array)', () => {
      render(
        <TagGroup
          title="Technical Competencies"
          emptyText="No competencies declared."
        />
      );

      expect(screen.getByText('No competencies declared.')).toBeInTheDocument();
    });

    it('uses default badge styling when badgeClassName is omitted', () => {
      render(
        <TagGroup
          title="Skills"
          items={[{ id: '1', name: 'React' }]}
          emptyText="No skills."
        />
      );

      const badge = screen.getByText('React');
      expect(badge).toHaveClass('bg-primary/5', 'text-primary');
    });
  });
});