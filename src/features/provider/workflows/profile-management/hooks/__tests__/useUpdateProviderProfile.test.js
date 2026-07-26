import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateProviderProfile } from '../useUpdateProviderProfile';
import { updateProviderProfile } from '../../../../providerApi';

// Mock the API module
vi.mock('../../../../providerApi', () => ({
  updateProviderProfile: vi.fn(),
}));

describe('useUpdateProviderProfile', () => {
  let queryClient;

  // Helper function to create a fresh QueryClientProvider wrapper for each test
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

  it('should call updateProviderProfile with correct payload when mutated', async () => {
    const mockPayload = {
      companyName: 'Acme Corp',
      companyDescription: 'Innovative Solutions',
      websiteUrl: 'https://acme.com',
    };

    updateProviderProfile.mockResolvedValueOnce({ id: 'prov-123', ...mockPayload });

    const { result } = renderHook(() => useUpdateProviderProfile('prov-123'), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(mockPayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateProviderProfile).toHaveBeenCalledTimes(1);
    expect(updateProviderProfile).toHaveBeenCalledWith(mockPayload);
  });

  it('should invalidate providerProfile query cache on mutation success', async () => {
    const providerId = 'provider-99';
    updateProviderProfile.mockResolvedValueOnce({ id: providerId });

    const wrapper = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateProviderProfile(providerId), { wrapper });

    act(() => {
      result.current.mutate({ companyName: 'New Name' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['providerProfile', providerId],
    });
  });
});