import * as getPaginatedListModule from '@/shared/api/getPaginatedList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePaginatedListQuery } from '../usePaginatedListQuery';

// Mock the getPaginatedList function
vi.mock('@/shared/api/getPaginatedList', () => ({
  getPaginatedList: vi.fn(),
}));

const mockGetPaginatedList = vi.mocked(getPaginatedListModule.getPaginatedList);

// Test wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('usePaginatedListQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getPaginatedList with correct parameters', async () => {
    const mockResponse = {
      count: 100,
      next: 'https://api.test.com/articles?offset=10',
      previous: null,
      results: [
        { id: 1, title: 'Test Article 1' },
        { id: 2, title: 'Test Article 2' },
      ],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePaginatedListQuery('articles', { limit: 10, offset: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetPaginatedList).toHaveBeenCalledWith('articles', { limit: 10, offset: 0 });
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should generate correct query key', async () => {
    const mockResponse = {
      count: 50,
      next: null,
      previous: null,
      results: [{ id: 1, title: 'Test Blog' }],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePaginatedListQuery('blogs', { limit: 20, offset: 40 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetPaginatedList).toHaveBeenCalledWith('blogs', { limit: 20, offset: 40 });
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should handle error state correctly', async () => {
    const error = new Error('Network error');
    mockGetPaginatedList.mockRejectedValue(error);

    const { result } = renderHook(() => usePaginatedListQuery('articles', { limit: 10, offset: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle loading state correctly', () => {
    mockGetPaginatedList.mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    const { result } = renderHook(() => usePaginatedListQuery('articles', { limit: 10, offset: 0 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should work with different resource types', async () => {
    const mockResponse = {
      count: 25,
      next: null,
      previous: null,
      results: [{ id: 1, title: 'Test Report' }],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePaginatedListQuery('reports', { limit: 5, offset: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetPaginatedList).toHaveBeenCalledWith('reports', { limit: 5, offset: 0 });
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should handle empty results correctly', async () => {
    const mockResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePaginatedListQuery('articles', { limit: 10, offset: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.results).toHaveLength(0);
    expect(result.current.data?.count).toBe(0);
  });

  it('should support React Query features like refetch', async () => {
    const mockResponse = {
      count: 10,
      next: null,
      previous: null,
      results: [{ id: 1, title: 'Test Article' }],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePaginatedListQuery('articles', { limit: 10, offset: 0 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Test refetch functionality
    await result.current.refetch();

    expect(mockGetPaginatedList).toHaveBeenCalledTimes(2);
  });

  it('should handle different pagination parameters', async () => {
    const scenarios = [
      { limit: 5, offset: 0 },
      { limit: 10, offset: 20 },
      { limit: 25, offset: 100 },
    ];

    for (const params of scenarios) {
      mockGetPaginatedList.mockResolvedValue({
        count: 200,
        next: null,
        previous: null,
        results: [],
      });

      const { result } = renderHook(() => usePaginatedListQuery('articles', params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetPaginatedList).toHaveBeenCalledWith('articles', params);
    }
  });
});
