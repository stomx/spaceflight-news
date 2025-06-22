import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../api-client';
import { getArticleById, getBlogById, getReportById } from '../getNewsById';

// api-client 모킹
vi.mock('../api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockedApiClient = vi.mocked(apiClient);

describe('getNewsById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getArticleById', () => {
    it('should fetch article by ID with string parameter', async () => {
      const mockArticle = {
        id: 123,
        title: 'Test Article',
        summary: 'Test summary',
        publishedAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        featured: false,
        launches: [],
        events: [],
        newsSite: 'Test Site',
        url: 'https://test.com/article/123',
        imageUrl: 'https://test.com/image.jpg',
      };

      mockedApiClient.get.mockResolvedValue(mockArticle);

      const result = await getArticleById('123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/articles/123/');
      expect(result).toEqual(mockArticle);
    });

    it('should fetch article by ID with number parameter', async () => {
      const mockArticle = {
        id: 456,
        title: 'Another Test Article',
        summary: 'Another test summary',
        publishedAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
        featured: true,
        launches: [],
        events: [],
        newsSite: 'Test Site 2',
        url: 'https://test.com/article/456',
        imageUrl: 'https://test.com/image2.jpg',
      };

      mockedApiClient.get.mockResolvedValue(mockArticle);

      const result = await getArticleById(456);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/articles/456/');
      expect(result).toEqual(mockArticle);
    });

    it('should handle API errors when fetching article', async () => {
      const error = new Error('Article not found');
      mockedApiClient.get.mockRejectedValue(error);

      await expect(getArticleById('999')).rejects.toThrow('Article not found');
      expect(mockedApiClient.get).toHaveBeenCalledWith('/articles/999/');
    });
  });

  describe('getBlogById', () => {
    it('should fetch blog by ID with string parameter', async () => {
      const mockBlog = {
        id: 123,
        title: 'Test Blog',
        summary: 'Test blog summary',
        publishedAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        featured: false,
        launches: [],
        events: [],
        newsSite: 'Blog Site',
        url: 'https://test.com/blog/123',
        imageUrl: 'https://test.com/blog-image.jpg',
      };

      mockedApiClient.get.mockResolvedValue(mockBlog);

      const result = await getBlogById('123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/blogs/123/');
      expect(result).toEqual(mockBlog);
    });

    it('should fetch blog by ID with number parameter', async () => {
      const mockBlog = {
        id: 456,
        title: 'Another Test Blog',
        summary: 'Another blog summary',
        publishedAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
        featured: true,
        launches: [],
        events: [],
        newsSite: 'Blog Site 2',
        url: 'https://test.com/blog/456',
        imageUrl: 'https://test.com/blog-image2.jpg',
      };

      mockedApiClient.get.mockResolvedValue(mockBlog);

      const result = await getBlogById(456);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/blogs/456/');
      expect(result).toEqual(mockBlog);
    });

    it('should handle API errors when fetching blog', async () => {
      const error = new Error('Blog not found');
      mockedApiClient.get.mockRejectedValue(error);

      await expect(getBlogById('999')).rejects.toThrow('Blog not found');
      expect(mockedApiClient.get).toHaveBeenCalledWith('/blogs/999/');
    });
  });

  describe('getReportById', () => {
    it('should fetch report by ID with string parameter', async () => {
      const mockReport = {
        id: 123,
        title: 'Test Report',
        summary: 'Test report summary',
        publishedAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        newsSite: 'Report Site',
        url: 'https://test.com/report/123',
        imageUrl: 'https://test.com/report-image.jpg',
      };

      mockedApiClient.get.mockResolvedValue(mockReport);

      const result = await getReportById('123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/reports/123/');
      expect(result).toEqual(mockReport);
    });

    it('should fetch report by ID with number parameter', async () => {
      const mockReport = {
        id: 456,
        title: 'Another Test Report',
        summary: 'Another report summary',
        publishedAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
        newsSite: 'Report Site 2',
        url: 'https://test.com/report/456',
        imageUrl: 'https://test.com/report-image2.jpg',
      };

      mockedApiClient.get.mockResolvedValue(mockReport);

      const result = await getReportById(456);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/reports/456/');
      expect(result).toEqual(mockReport);
    });

    it('should handle API errors when fetching report', async () => {
      const error = new Error('Report not found');
      mockedApiClient.get.mockRejectedValue(error);

      await expect(getReportById('999')).rejects.toThrow('Report not found');
      expect(mockedApiClient.get).toHaveBeenCalledWith('/reports/999/');
    });
  });

  describe('type safety', () => {
    it('should work with different ID types', async () => {
      const mockData = { id: 1, title: 'Test' };
      mockedApiClient.get.mockResolvedValue(mockData);

      // String IDs
      await getArticleById('123');
      await getBlogById('456');
      await getReportById('789');

      // Number IDs
      await getArticleById(123);
      await getBlogById(456);
      await getReportById(789);

      expect(mockedApiClient.get).toHaveBeenCalledTimes(6);
    });
  });
});
