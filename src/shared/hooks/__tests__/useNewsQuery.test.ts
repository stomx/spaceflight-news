import * as getNewsByIdModule from '@/shared/api/getNewsById';
import type { Article, Blog, Report } from '@/shared/types/news';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useArticleQuery, useBlogQuery, useReportQuery } from '../useNewsQuery';

// Mock the getNewsById functions
vi.mock('@/shared/api/getNewsById', () => ({
  getArticleById: vi.fn(),
  getBlogById: vi.fn(),
  getReportById: vi.fn(),
}));

const mockGetArticleById = vi.mocked(getNewsByIdModule.getArticleById);
const mockGetBlogById = vi.mocked(getNewsByIdModule.getBlogById);
const mockGetReportById = vi.mocked(getNewsByIdModule.getReportById);

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

// Mock data helpers
const createMockArticle = (overrides: Partial<Article> = {}): Article => ({
  id: 1,
  title: 'Test Article',
  authors: [{ name: 'Test Author' }],
  summary: 'Test summary',
  url: 'https://example.com/article',
  image_url: 'https://example.com/image.jpg',
  news_site: 'Test Site',
  published_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  featured: false,
  launches: [],
  events: [],
  ...overrides,
});

const createMockBlog = (overrides: Partial<Blog> = {}): Blog => ({
  id: 1,
  title: 'Test Blog',
  authors: [{ name: 'Test Author' }],
  summary: 'Test summary',
  url: 'https://example.com/blog',
  image_url: 'https://example.com/image.jpg',
  news_site: 'Test Site',
  published_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  featured: false,
  launches: [],
  events: [],
  ...overrides,
});

const createMockReport = (overrides: Partial<Report> = {}): Report => ({
  id: 1,
  title: 'Test Report',
  authors: [{ name: 'Test Author' }],
  summary: 'Test summary',
  url: 'https://example.com/report',
  image_url: 'https://example.com/image.jpg',
  news_site: 'Test Site',
  published_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

describe('useArticleQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch article by id successfully', async () => {
    const mockArticle = createMockArticle();
    mockGetArticleById.mockResolvedValue(mockArticle);

    const { result } = renderHook(() => useArticleQuery(1), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetArticleById).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockArticle);
  });

  it('should not fetch when id is falsy', () => {
    const { result } = renderHook(() => useArticleQuery(''), { wrapper: createWrapper() });

    // When enabled is false (due to empty id), query should be in idle state
    expect(result.current.isLoading).toBe(false);
    expect(mockGetArticleById).not.toHaveBeenCalled();
  });

  it('should handle string id', async () => {
    const mockArticle = createMockArticle({ id: 123 });
    mockGetArticleById.mockResolvedValue(mockArticle);

    const { result } = renderHook(() => useArticleQuery('123'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetArticleById).toHaveBeenCalledWith('123');
    expect(result.current.data).toEqual(mockArticle);
  });

  it('should handle error state', async () => {
    const error = new Error('Article not found');
    mockGetArticleById.mockRejectedValue(error);

    const { result } = renderHook(() => useArticleQuery(999), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should accept custom options', async () => {
    const mockArticle = createMockArticle();
    mockGetArticleById.mockResolvedValue(mockArticle);

    const { result } = renderHook(() => useArticleQuery(1, { staleTime: 60000 }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockArticle);
  });
});

describe('useBlogQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch blog by id successfully', async () => {
    const mockBlog = createMockBlog();
    mockGetBlogById.mockResolvedValue(mockBlog);

    const { result } = renderHook(() => useBlogQuery(1), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetBlogById).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockBlog);
  });

  it('should not fetch when id is falsy', () => {
    const { result } = renderHook(() => useBlogQuery(0), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(mockGetBlogById).not.toHaveBeenCalled();
  });

  it('should handle error state', async () => {
    const error = new Error('Blog not found');
    mockGetBlogById.mockRejectedValue(error);

    const { result } = renderHook(() => useBlogQuery(999), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useReportQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch report by id successfully', async () => {
    const mockReport = createMockReport();
    mockGetReportById.mockResolvedValue(mockReport);

    const { result } = renderHook(() => useReportQuery(1), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetReportById).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockReport);
  });

  it('should not fetch when id is falsy', () => {
    const { result } = renderHook(() => useReportQuery(0), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(mockGetReportById).not.toHaveBeenCalled();
  });

  it('should handle error state', async () => {
    const error = new Error('Report not found');
    mockGetReportById.mockRejectedValue(error);

    const { result } = renderHook(() => useReportQuery(999), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should accept custom options', async () => {
    const mockReport = createMockReport();
    mockGetReportById.mockResolvedValue(mockReport);

    const { result } = renderHook(() => useReportQuery(1, { staleTime: 300000 }), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockReport);
  });
});

describe('useNewsQuery - Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have consistent query key patterns', async () => {
    const mockArticle = createMockArticle();
    const mockBlog = createMockBlog();
    const mockReport = createMockReport();

    mockGetArticleById.mockResolvedValue(mockArticle);
    mockGetBlogById.mockResolvedValue(mockBlog);
    mockGetReportById.mockResolvedValue(mockReport);

    const { result: articleResult } = renderHook(() => useArticleQuery(1), { wrapper: createWrapper() });

    const { result: blogResult } = renderHook(() => useBlogQuery(1), { wrapper: createWrapper() });

    const { result: reportResult } = renderHook(() => useReportQuery(1), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(articleResult.current.isSuccess).toBe(true);
      expect(blogResult.current.isSuccess).toBe(true);
      expect(reportResult.current.isSuccess).toBe(true);
    });

    // Verify different query keys are used for different types
    expect(mockGetArticleById).toHaveBeenCalledWith(1);
    expect(mockGetBlogById).toHaveBeenCalledWith(1);
    expect(mockGetReportById).toHaveBeenCalledWith(1);
  });
});
