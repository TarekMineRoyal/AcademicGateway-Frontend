import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProviderProfileData } from '../useProviderProfileData';
import { useAuth } from '@/context/AuthContextCore';
import { getProviderProfile, updateProviderProfile } from '../../../../providerApi';

// Mock dependencies
vi.mock('@/context/AuthContextCore', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../../providerApi', () => ({
  getProviderProfile: vi.fn(),
  updateProviderProfile: vi.fn(),
}));

describe('useProviderProfileData', () => {
  let queryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const Wrapper = ({ children }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
    Wrapper.displayName = 'QueryClientWrapper';
    return Wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return providerId and fetch profile when user exists', async () => {
    const mockUser = { id: 'provider-123' };
    const mockProfile = {
      id: 'provider-123',
      companyName: 'Acme Corp',
      companyDescription: 'Leading Innovations',
      websiteUrl: 'https://acme.com',
      isVerified: true,
    };

    useAuth.mockReturnValue({ user: mockUser });
    getProviderProfile.mockResolvedValueOnce(mockProfile);

    const { result } = renderHook(() => useProviderProfileData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.providerId).toBe('provider-123');
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.profile).toEqual(mockProfile);
    expect(getProviderProfile).toHaveBeenCalledTimes(1);
  });

  it('should disable query when user or providerId is missing', () => {
    useAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useProviderProfileData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.providerId).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(getProviderProfile).not.toHaveBeenCalled();
  });

  it('should expose error state when getProviderProfile fails', async () => {
    const mockUser = { id: 'provider-123' };
    const mockError = new Error('Failed to fetch profile');

    useAuth.mockReturnValue({ user: mockUser });
    getProviderProfile.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useProviderProfileData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.error).toBeTruthy());

    expect(result.current.error.message).toBe('Failed to fetch profile');
  });

  it('should trigger updateProfileMutation and invalidate provider profile query on success', async () => {
    const mockUser = { id: 'provider-123' };
    const updatePayload = { companyName: 'Updated Acme Corp' };

    useAuth.mockReturnValue({ user: mockUser });
    getProviderProfile.mockResolvedValue({ id: 'provider-123', companyName: 'Acme Corp' });
    updateProviderProfile.mockResolvedValueOnce({ id: 'provider-123', ...updatePayload });

    const wrapper = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useProviderProfileData(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateProfileMutation.mutate(updatePayload);
    });

    await waitFor(() => expect(result.current.updateProfileMutation.isSuccess).toBe(true));

    expect(updateProviderProfile).toHaveBeenCalledWith(updatePayload);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['providerProfile', 'provider-123'],
    });
  });
});