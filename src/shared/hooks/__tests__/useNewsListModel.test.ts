import * as getPaginatedListModule from '@/shared/api/getPaginatedList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNewsListModel } from '../useNewsListModel';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useSearch: vi.fn(),
}));

vi.mock('@/shared/api/getPaginatedList', () => ({
  getPaginatedList: vi.fn(),
}));

vi.mock('@/shared/config', () => ({
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
}));

import { useSearch } from '@tanstack/react-router';
const mockUseSearch = vi.mocked(useSearch);
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

describe('useNewsListModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearch.mockReturnValue({});
  });

  it('should use default page and limit when no search params', async () => {
    mockUseSearch.mockReturnValue({});

    const mockResponse = {
      count: 100,
      next: null,
      previous: null,
      results: [{ id: 1, title: 'Test Article' }],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsListModel('articles'), { wrapper: createWrapper() });

    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);
    expect(result.current.offset).toBe(0);
  });

  it('should use search params when provided', async () => {
    mockUseSearch.mockReturnValue({ page: '3', limit: '20' });

    const mockResponse = {
      count: 100,
      next: null,
      previous: null,
      results: [{ id: 1, title: 'Test Article' }],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsListModel('articles'), { wrapper: createWrapper() });

    expect(result.current.page).toBe(3);
    expect(result.current.limit).toBe(20);
    expect(result.current.offset).toBe(40); // (3-1) * 20
  });

  it('should calculate totalPages correctly', async () => {
    mockUseSearch.mockReturnValue({ limit: '10' });

    const mockResponse = {
      count: 95,
      next: null,
      previous: null,
      results: [],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsListModel('articles'), { wrapper: createWrapper() });

    // Wait for query to complete
    await vi.waitFor(() => {
      expect(result.current.totalPages).toBe(10); // Math.ceil(95 / 10)
    });
  });

  it('should handle invalid search params with fallback to defaults', async () => {
    mockUseSearch.mockReturnValue({ page: 'invalid', limit: 'invalid' });

    const mockResponse = {
      count: 50,
      next: null,
      previous: null,
      results: [],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsListModel('articles'), { wrapper: createWrapper() });

    expect(result.current.page).toBe(1); // fallback to default
    expect(result.current.limit).toBe(10); // fallback to default
    expect(result.current.offset).toBe(0);
  });

  it('should work with different resource types', async () => {
    mockUseSearch.mockReturnValue({ page: '2', limit: '5' });

    const mockResponse = {
      count: 25,
      next: null,
      previous: null,
      results: [{ id: 1, title: 'Test Blog' }],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsListModel('blogs'), { wrapper: createWrapper() });

    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(5);
    expect(result.current.offset).toBe(5); // (2-1) * 5

    // Verify correct resource is called
    await vi.waitFor(() => {
      expect(mockGetPaginatedList).toHaveBeenCalledWith('blogs', { limit: 5, offset: 5 });
    });
  });

  it('should return query properties from usePaginatedListQuery', async () => {
    mockUseSearch.mockReturnValue({});

    const mockResponse = {
      count: 30,
      next: null,
      previous: null,
      results: [{ id: 1, title: 'Test' }],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsListModel('articles'), { wrapper: createWrapper() });

    await vi.waitFor(() => {
      expect(result.current.data).toEqual(mockResponse);
    });

    // Check that query properties are exposed
    expect(typeof result.current.isLoading).toBe('boolean');
    expect(typeof result.current.isError).toBe('boolean');
    expect(typeof result.current.error).toBeDefined();
    expect(typeof result.current.refetch).toBe('function');
  });

  it('should handle zero count correctly', async () => {
    mockUseSearch.mockReturnValue({ limit: '10' });

    const mockResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsListModel('articles'), { wrapper: createWrapper() });

    await vi.waitFor(() => {
      expect(result.current.totalPages).toBe(0); // Math.ceil(0 / 10)
    });
  });

  it('should handle large page numbers correctly', async () => {
    mockUseSearch.mockReturnValue({ page: '100', limit: '25' });

    const mockResponse = {
      count: 1000,
      next: null,
      previous: null,
      results: [],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsListModel('reports'), { wrapper: createWrapper() });

    expect(result.current.page).toBe(100);
    expect(result.current.limit).toBe(25);
    expect(result.current.offset).toBe(2475); // (100-1) * 25

    await vi.waitFor(() => {
      expect(result.current.totalPages).toBe(40); // Math.ceil(1000 / 25)
    });
  });

  it('should return search object for additional params', () => {
    const searchParams = { page: '2', limit: '15', category: 'tech', author: 'john' };
    mockUseSearch.mockReturnValue(searchParams);

    const mockResponse = {
      count: 50,
      next: null,
      previous: null,
      results: [],
    };

    mockGetPaginatedList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useNewsListModel('articles'), { wrapper: createWrapper() });

    expect(result.current.search).toEqual(searchParams);
  });
});
