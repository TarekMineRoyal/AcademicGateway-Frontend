import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  describe('Progress Math Normalization & Clamping', () => {
    it('renders standard numeric progress within 0 to 100 range', () => {
      render(<ProgressBar progress={45} />);

      expect(screen.getByText('45%')).toBeInTheDocument();
      const barElement = document.querySelector('.h-full');
      expect(barElement).toHaveStyle('width: 45%');
    });

    it('clamps negative progress values to 0%', () => {
      render(<ProgressBar progress={-50} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
      const barElement = document.querySelector('.h-full');
      expect(barElement).toHaveStyle('width: 0%');
    });

    it('clamps progress values exceeding 100 to 100%', () => {
      render(<ProgressBar progress={250} />);

      expect(screen.getByText('100%')).toBeInTheDocument();
      const barElement = document.querySelector('.h-full');
      expect(barElement).toHaveStyle('width: 100%');
    });

    it('handles boundary values 0 and 100 correctly', () => {
      const { unmount } = render(<ProgressBar progress={0} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
      unmount();

      render(<ProgressBar progress={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('handles floating point values accurately', () => {
      render(<ProgressBar progress={33.3} />);

      expect(screen.getByText('33.3%')).toBeInTheDocument();
      const barElement = document.querySelector('.h-full');
      expect(barElement).toHaveStyle('width: 33.3%');
    });
  });

  describe('Non-Numeric and Edge Case Inputs', () => {
    it('coerces valid numeric strings to numbers', () => {
      render(<ProgressBar progress="75" />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('defaults safely to 0% when progress is NaN', () => {
      render(<ProgressBar progress={NaN} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
      const barElement = document.querySelector('.h-full');
      expect(barElement).toHaveStyle('width: 0%');
    });

    it('defaults safely to 0% when progress is a non-numeric string', () => {
      render(<ProgressBar progress="invalid-string" />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('defaults safely to 0% when progress is null or undefined', () => {
      const { unmount } = render(<ProgressBar progress={null} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
      unmount();

      render(<ProgressBar progress={undefined} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('defaults safely to 0% for empty objects', () => {
      render(<ProgressBar progress={{}} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('Custom Class & Label Customization', () => {
    it('renders string and React node labels properly', () => {
      const { unmount } = render(<ProgressBar progress={50} label="Uploading..." />);
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
      unmount();

      render(
        <ProgressBar
          progress={50}
          label={<span data-testid="custom-label">Custom Node</span>}
        />
      );
      expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    });

    it('applies default barColorClass and valueColorClass when omitted', () => {
      render(<ProgressBar progress={50} />);

      const valueElement = screen.getByText('50%');
      expect(valueElement).toHaveClass('text-primary');

      const barElement = document.querySelector('.h-full');
      expect(barElement).toHaveClass('bg-primary');
    });

    it('applies custom barColorClass and valueColorClass styling props', () => {
      render(
        <ProgressBar
          progress={80}
          barColorClass="bg-emerald-500"
          valueColorClass="text-emerald-600"
        />
      );

      const valueElement = screen.getByText('80%');
      expect(valueElement).toHaveClass('text-emerald-600');

      const barElement = document.querySelector('.h-full');
      expect(barElement).toHaveClass('bg-emerald-500');
    });
  });
});