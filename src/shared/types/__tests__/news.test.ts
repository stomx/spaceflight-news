import { describe, expect, it } from 'vitest';
import type {
  Article,
  Author,
  AuthorSocials,
  Blog,
  EventInfo,
  LaunchInfo,
  PaginatedResponse,
  Report,
  SearchParams,
} from '../news';

describe('News Types', () => {
  describe('Author interface', () => {
    it('should accept author with only name', () => {
      const author: Author = {
        name: 'John Doe',
      };
      expect(author.name).toBe('John Doe');
      expect(author.socials).toBeUndefined();
    });

    it('should accept author with socials', () => {
      const socials: AuthorSocials = {
        x: '@johndoe',
        youtube: 'johndoe',
        instagram: 'johndoe',
        linkedin: 'johndoe',
        mastodon: '@johndoe@mastodon.social',
        bluesky: 'johndoe.bsky.social',
      };

      const author: Author = {
        name: 'John Doe',
        socials,
      };

      expect(author.name).toBe('John Doe');
      expect(author.socials).toEqual(socials);
    });

    it('should accept partial socials', () => {
      const author: Author = {
        name: 'John Doe',
        socials: {
          x: '@johndoe',
          youtube: 'johndoe',
        },
      };

      expect(author.socials?.x).toBe('@johndoe');
      expect(author.socials?.youtube).toBe('johndoe');
      expect(author.socials?.instagram).toBeUndefined();
    });
  });

  describe('LaunchInfo interface', () => {
    it('should have correct structure', () => {
      const launch: LaunchInfo = {
        launch_id: 'launch-123',
        provider: 'SpaceX',
      };

      expect(launch.launch_id).toBe('launch-123');
      expect(launch.provider).toBe('SpaceX');
    });
  });

  describe('EventInfo interface', () => {
    it('should have correct structure', () => {
      const event: EventInfo = {
        event_id: 123,
        provider: 'NASA',
      };

      expect(event.event_id).toBe(123);
      expect(event.provider).toBe('NASA');
    });
  });

  describe('Article interface', () => {
    it('should have correct structure with all NewsBase fields', () => {
      const article: Article = {
        id: 1,
        title: 'Test Article',
        authors: [{ name: 'John Doe' }],
        url: 'https://example.com/article/1',
        image_url: 'https://example.com/image.jpg',
        news_site: 'SpaceNews',
        summary: 'This is a test article summary',
        published_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T12:00:00Z',
        featured: true,
        launches: [],
        events: [],
        type: 'article',
      };

      expect(article.id).toBe(1);
      expect(article.title).toBe('Test Article');
      expect(article.type).toBe('article');
      expect(Array.isArray(article.authors)).toBe(true);
      expect(Array.isArray(article.launches)).toBe(true);
      expect(Array.isArray(article.events)).toBe(true);
    });

    it('should work without type field', () => {
      const article: Article = {
        id: 1,
        title: 'Test Article',
        authors: [{ name: 'John Doe' }],
        url: 'https://example.com/article/1',
        image_url: 'https://example.com/image.jpg',
        news_site: 'SpaceNews',
        summary: 'This is a test article summary',
        published_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T12:00:00Z',
        featured: false,
        launches: [],
        events: [],
      };

      expect(article.type).toBeUndefined();
    });
  });

  describe('Blog interface', () => {
    it('should have correct structure with all NewsBase fields', () => {
      const blog: Blog = {
        id: 2,
        title: 'Test Blog',
        authors: [{ name: 'Jane Doe' }],
        url: 'https://example.com/blog/2',
        image_url: 'https://example.com/blog-image.jpg',
        news_site: 'SpaceBlog',
        summary: 'This is a test blog summary',
        published_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T12:00:00Z',
        featured: false,
        launches: [{ launch_id: 'launch-123', provider: 'SpaceX' }],
        events: [{ event_id: 456, provider: 'NASA' }],
        type: 'blog',
      };

      expect(blog.id).toBe(2);
      expect(blog.title).toBe('Test Blog');
      expect(blog.type).toBe('blog');
      expect(blog.launches).toHaveLength(1);
      expect(blog.events).toHaveLength(1);
    });
  });

  describe('Report interface', () => {
    it('should have correct structure', () => {
      const report: Report = {
        id: 3,
        title: 'Test Report',
        authors: [{ name: 'Bob Smith' }],
        url: 'https://example.com/report/3',
        image_url: 'https://example.com/report-image.jpg',
        news_site: 'SpaceReport',
        summary: 'This is a test report summary',
        published_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T12:00:00Z',
        type: 'report',
      };

      expect(report.id).toBe(3);
      expect(report.title).toBe('Test Report');
      expect(report.type).toBe('report');
      // Report는 NewsBase를 상속하지 않으므로 launches, events 필드가 없음
      expect('launches' in report).toBe(false);
      expect('events' in report).toBe(false);
    });
  });

  describe('PaginatedResponse interface', () => {
    it('should work with Article type', () => {
      const response: PaginatedResponse<Article> = {
        count: 100,
        next: 'https://api.example.com/articles?page=2',
        previous: null,
        results: [
          {
            id: 1,
            title: 'Test Article',
            authors: [{ name: 'John Doe' }],
            url: 'https://example.com/article/1',
            image_url: 'https://example.com/image.jpg',
            news_site: 'SpaceNews',
            summary: 'Summary',
            published_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T12:00:00Z',
            featured: true,
            launches: [],
            events: [],
          },
        ],
      };

      expect(response.count).toBe(100);
      expect(response.next).toBe('https://api.example.com/articles?page=2');
      expect(response.previous).toBeNull();
      expect(response.results).toHaveLength(1);
      expect(response.results[0].id).toBe(1);
    });

    it('should work with Report type', () => {
      const response: PaginatedResponse<Report> = {
        count: 50,
        next: null,
        previous: 'https://api.example.com/reports?page=1',
        results: [],
      };

      expect(response.count).toBe(50);
      expect(response.next).toBeNull();
      expect(response.previous).toBe('https://api.example.com/reports?page=1');
      expect(response.results).toHaveLength(0);
    });
  });

  describe('SearchParams interface', () => {
    it('should accept empty object', () => {
      const params: SearchParams = {};
      expect(params.page).toBeUndefined();
      expect(params.limit).toBeUndefined();
    });

    it('should accept page only', () => {
      const params: SearchParams = { page: 2 };
      expect(params.page).toBe(2);
      expect(params.limit).toBeUndefined();
    });

    it('should accept limit only', () => {
      const params: SearchParams = { limit: 10 };
      expect(params.page).toBeUndefined();
      expect(params.limit).toBe(10);
    });

    it('should accept both page and limit', () => {
      const params: SearchParams = { page: 3, limit: 5 };
      expect(params.page).toBe(3);
      expect(params.limit).toBe(5);
    });
  });
});
