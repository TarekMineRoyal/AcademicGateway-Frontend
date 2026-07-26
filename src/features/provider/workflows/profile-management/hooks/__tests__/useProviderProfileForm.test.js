import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProviderProfileForm } from '../useProviderProfileForm';
import { useProviderProfileData } from '../useProviderProfileData';

// Mock the provider profile data hook
vi.mock('../useProviderProfileData', () => ({
  useProviderProfileData: vi.fn(),
}));

describe('useProviderProfileForm', () => {
  const mockMutate = vi.fn();
  const mockData = {
    profile: {
      companyName: 'Acme Corp',
      companyDescription: 'Leading provider of tech solutions',
      websiteUrl: 'https://acme.com',
    },
    isLoading: false,
    updateProfileMutation: {
      mutate: mockMutate,
      isLoading: false,
      isSuccess: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize local form fields from provider profile data', () => {
    useProviderProfileData.mockReturnValue(mockData);

    const { result } = renderHook(() => useProviderProfileForm());

    expect(result.current.companyName).toBe('Acme Corp');
    expect(result.current.companyDescription).toBe('Leading provider of tech solutions');
    expect(result.current.websiteUrl).toBe('https://acme.com');
    expect(result.current.isEditing).toBe(false);
  });

  it('should fall back to empty strings when profile fields are null/undefined', () => {
    useProviderProfileData.mockReturnValue({
      ...mockData,
      profile: {
        companyName: null,
        companyDescription: null,
        websiteUrl: null,
      },
    });

    const { result } = renderHook(() => useProviderProfileForm());

    expect(result.current.companyName).toBe('');
    expect(result.current.companyDescription).toBe('');
    expect(result.current.websiteUrl).toBe('');
  });

  it('should update local form state when state setters are called', () => {
    useProviderProfileData.mockReturnValue(mockData);

    const { result } = renderHook(() => useProviderProfileForm());

    act(() => {
      result.current.setCompanyName('Beta LLC');
      result.current.setCompanyDescription('New description');
      result.current.setWebsiteUrl('https://beta.com');
      result.current.setIsEditing(true);
    });

    expect(result.current.companyName).toBe('Beta LLC');
    expect(result.current.companyDescription).toBe('New description');
    expect(result.current.websiteUrl).toBe('https://beta.com');
    expect(result.current.isEditing).toBe(true);
  });

  it('should reset form state to profile data and set isEditing to false on handleCancel', () => {
    useProviderProfileData.mockReturnValue(mockData);

    const { result } = renderHook(() => useProviderProfileForm());

    act(() => {
      result.current.setCompanyName('Unsaved Changes Corp');
      result.current.setIsEditing(true);
    });

    expect(result.current.companyName).toBe('Unsaved Changes Corp');

    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.companyName).toBe('Acme Corp');
    expect(result.current.isEditing).toBe(false);
  });

  it('should trim whitespace, convert empty strings to null, and call mutate on handleSubmit', () => {
    useProviderProfileData.mockReturnValue(mockData);

    mockMutate.mockImplementation((payload, options) => {
      options?.onSuccess?.();
    });

    const { result } = renderHook(() => useProviderProfileForm());

    act(() => {
      result.current.setCompanyName('   Acme Global   ');
      result.current.setCompanyDescription('   '); // whitespace only -> should become null
      result.current.setWebsiteUrl('  https://acme.global  ');
      result.current.setIsEditing(true);
    });

    const mockEvent = { preventDefault: vi.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(
      {
        companyName: 'Acme Global',
        companyDescription: null,
        websiteUrl: 'https://acme.global',
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    );
    expect(result.current.isEditing).toBe(false);
  });
});