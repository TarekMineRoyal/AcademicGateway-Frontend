import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProviderProfile from './ProviderProfile';
import { useProviderProfileForm } from './hooks/useProviderProfileForm';

// Mock the composite hook
vi.mock('./hooks/useProviderProfileForm', () => ({
  useProviderProfileForm: vi.fn(),
}));

describe('ProviderProfile Orchestrator', () => {
  const mockFormReturn = {
    profile: {
      companyName: 'Acme Corp',
      companyDescription: 'Enterprise software solutions',
      websiteUrl: 'https://acme.com',
      isVerified: true,
    },
    isLoading: false,
    updateProfileMutation: {
      isSuccess: false,
      isError: false,
      isPending: false,
      isLoading: false,
      error: null,
    },
    companyName: 'Acme Corp',
    setCompanyName: vi.fn(),
    companyDescription: 'Enterprise software solutions',
    setCompanyDescription: vi.fn(),
    websiteUrl: 'https://acme.com',
    setWebsiteUrl: vi.fn(),
    isEditing: false,
    setIsEditing: vi.fn(),
    handleCancel: vi.fn(),
    handleSubmit: vi.fn((e) => e?.preventDefault()),
  };

  it('renders loading state when isLoading is true[cite: 20]', () => {
    useProviderProfileForm.mockReturnValue({
      ...mockFormReturn,
      isLoading: true,
    });

    render(<ProviderProfile />);
    expect(screen.getByText('Loading provider profile...')).toBeInTheDocument();
  });

  it('renders read-only view by default when not editing[cite: 20]', () => {
    useProviderProfileForm.mockReturnValue(mockFormReturn);

    render(<ProviderProfile />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
  });

  it('renders edit form when isEditing is true[cite: 20]', () => {
    useProviderProfileForm.mockReturnValue({
      ...mockFormReturn,
      isEditing: true,
    });

    render(<ProviderProfile />);
    expect(screen.getByText('Update Corporate Profile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('displays success feedback banner when updateProfileMutation is successful[cite: 20]', () => {
    useProviderProfileForm.mockReturnValue({
      ...mockFormReturn,
      updateProfileMutation: {
        ...mockFormReturn.updateProfileMutation,
        isSuccess: true,
      },
    });

    render(<ProviderProfile />);
    expect(screen.getByText('Provider profile successfully updated!')).toBeInTheDocument();
  });

  it('displays error feedback banner when updateProfileMutation fails[cite: 20]', () => {
    useProviderProfileForm.mockReturnValue({
      ...mockFormReturn,
      updateProfileMutation: {
        ...mockFormReturn.updateProfileMutation,
        isError: true,
        error: { message: 'Network connection lost' },
      },
    });

    render(<ProviderProfile />);
    expect(screen.getByText('Submission failed: Network connection lost')).toBeInTheDocument();
  });

  it('calls setIsEditing when the edit button is clicked in read-only view[cite: 20]', () => {
    const setIsEditing = vi.fn();
    useProviderProfileForm.mockReturnValue({
      ...mockFormReturn,
      setIsEditing,
    });

    render(<ProviderProfile />);
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));

    expect(setIsEditing).toHaveBeenCalledWith(true);
  });

  it('calls handleCancel when the cancel button is clicked in edit mode[cite: 20]', () => {
    const handleCancel = vi.fn();
    useProviderProfileForm.mockReturnValue({
      ...mockFormReturn,
      isEditing: true,
      handleCancel,
    });

    render(<ProviderProfile />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});