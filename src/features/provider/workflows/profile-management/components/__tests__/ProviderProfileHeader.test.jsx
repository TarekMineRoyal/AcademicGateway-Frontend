import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProviderProfileHeader from '../ProviderProfileHeader';

describe('ProviderProfileHeader', () => {
  it('renders company name and verified status badge when verified', () => {
    const onEditClick = vi.fn();
    render(
      <ProviderProfileHeader
        companyName="Acme Corp"
        isVerified={true}
        onEditClick={onEditClick}
      />
    );

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.queryByText('Pending Verification')).not.toBeInTheDocument();
  });

  it('renders fallback company name and pending verification badge when not verified', () => {
    const onEditClick = vi.fn();
    render(
      <ProviderProfileHeader
        companyName=""
        isVerified={false}
        onEditClick={onEditClick}
      />
    );

    expect(screen.getByText('Unnamed Provider')).toBeInTheDocument();
    expect(screen.getByText('Pending Verification')).toBeInTheDocument();
    expect(screen.queryByText('Verified')).not.toBeInTheDocument();
  });

  it('calls onEditClick when edit button is clicked', () => {
    const onEditClick = vi.fn();
    render(
      <ProviderProfileHeader
        companyName="Acme Corp"
        isVerified={true}
        onEditClick={onEditClick}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editButton);

    expect(onEditClick).toHaveBeenCalledTimes(1);
  });
});