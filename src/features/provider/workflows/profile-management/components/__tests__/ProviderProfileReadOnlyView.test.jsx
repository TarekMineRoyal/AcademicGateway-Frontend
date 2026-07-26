import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProviderProfileReadOnlyView from '../ProviderProfileReadOnlyView';

describe('ProviderProfileReadOnlyView', () => {
  it('renders header, website link with correct attributes, and description when provided', () => {
    const onEditClick = vi.fn();
    render(
      <ProviderProfileReadOnlyView
        companyName="Acme Corp"
        companyDescription="Building enterprise tech solutions."
        websiteUrl="https://acme.com"
        isVerified={true}
        onEditClick={onEditClick}
      />
    );

    // Header checks
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();

    // Website Link checks
    const link = screen.getByRole('link', { name: /https:\/\/acme\.com/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://acme.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    // Description check
    expect(screen.getByText('Building enterprise tech solutions.')).toBeInTheDocument();
  });

  it('renders fallback placeholder text when websiteUrl and companyDescription are missing', () => {
    const onEditClick = vi.fn();
    render(
      <ProviderProfileReadOnlyView
        companyName="Acme Corp"
        companyDescription=""
        websiteUrl=""
        isVerified={false}
        onEditClick={onEditClick}
      />
    );

    expect(screen.getByText('No website URL provided.')).toBeInTheDocument();
    expect(screen.getByText('No company description provided yet.')).toBeInTheDocument();
  });

  it('triggers onEditClick when the edit button in header is clicked', () => {
    const onEditClick = vi.fn();
    render(
      <ProviderProfileReadOnlyView
        companyName="Acme Corp"
        onEditClick={onEditClick}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editButton);

    expect(onEditClick).toHaveBeenCalledTimes(1);
  });
});