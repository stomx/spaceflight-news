import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NewsDetail } from '../NewsDetail';
import type { Article, Blog, Report } from '@/shared/types/news';

// Mock LazyImage component
vi.mock('@/shared/components/lazy-image', () => ({
  LazyImage: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Linkedin: () => <div data-testid="linkedin-icon" />,
  Rocket: () => <div data-testid="rocket-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Twitter: () => <div data-testid="twitter-icon" />,
  User: () => <div data-testid="user-icon" />,
}));

const mockArticle: Article = {
  id: 1,
  title: '테스트 아티클 제목',
  summary: '테스트 아티클 요약 내용입니다.',
  image_url: 'https://example.com/image.jpg',
  url: 'https://example.com/article',
  news_site: 'Test News Site',
  published_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T10:00:00Z',
  featured: true,
  authors: [
    {
      name: 'John Doe',
      socials: {
        x: 'https://twitter.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
      },
    },
  ],
  launches: [
    {
      launch_id: 'launch1',
      provider: 'SpaceX',
    },
  ],
  events: [
    {
      event_id: 1,
      provider: 'NASA',
    },
  ],
};

const mockBlog: Blog = {
  id: 2,
  title: '테스트 블로그 제목',
  summary: '테스트 블로그 요약 내용입니다.',
  image_url: 'https://example.com/blog-image.jpg',
  url: 'https://example.com/blog',
  news_site: 'Test Blog Site',
  published_at: '2024-01-02T10:00:00Z',
  updated_at: '2024-01-02T10:00:00Z',
  featured: false,
  authors: [
    {
      name: 'Jane Smith',
    },
  ],
  launches: [],
  events: [],
};

const mockReport: Report = {
  id: 3,
  title: '테스트 리포트 제목',
  summary: '테스트 리포트 요약 내용입니다.',
  image_url: 'https://example.com/report-image.jpg',
  url: 'https://example.com/report',
  news_site: 'Test Report Site',
  published_at: '2024-01-03T10:00:00Z',
  updated_at: '2024-01-03T12:00:00Z',
  authors: [],
};

describe('NewsDetail Component', () => {
  describe('기본 렌더링', () => {
    it('뉴스 상세 정보를 올바르게 렌더링한다', () => {
      render(<NewsDetail news={mockArticle} />);

      expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
      expect(screen.getByText(mockArticle.summary)).toBeInTheDocument();
      expect(screen.getByText(mockArticle.news_site)).toBeInTheDocument();
    });

    it('이미지가 올바르게 표시된다', () => {
      render(<NewsDetail news={mockArticle} />);

      const image = screen.getByAltText(mockArticle.title);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockArticle.image_url);
    });

    it('발행일이 올바르게 표시된다', () => {
      render(<NewsDetail news={mockArticle} />);

      // 발행일이 한국어 형식으로 표시되는지 확인
      expect(screen.getByText(/발행:/)).toBeInTheDocument();
    });

    it('뉴스 사이트 정보가 표시된다', () => {
      render(<NewsDetail news={mockArticle} />);

      expect(screen.getByText(mockArticle.news_site)).toBeInTheDocument();
      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
    });
  });

  describe('Article 타입 전용 기능', () => {
    it('특집 배지가 표시된다', () => {
      render(<NewsDetail news={mockArticle} />);

      expect(screen.getByText('특집')).toBeInTheDocument();
      expect(screen.getAllByTestId('star-icon')).toHaveLength(2); // One in badge, one in events section
    });

    it('특집이 아닌 경우 배지가 표시되지 않는다', () => {
      const nonFeaturedArticle = { ...mockArticle, featured: false };
      render(<NewsDetail news={nonFeaturedArticle} />);

      expect(screen.queryByText('특집')).not.toBeInTheDocument();
    });

    it('관련 발사 정보가 표시된다', () => {
      render(<NewsDetail news={mockArticle} />);

      expect(screen.getByText('관련 발사 정보')).toBeInTheDocument();
      expect(screen.getByText('발사 ID: launch1')).toBeInTheDocument();
      expect(screen.getByText('제공: SpaceX')).toBeInTheDocument();
      expect(screen.getByTestId('rocket-icon')).toBeInTheDocument();
    });

    it('관련 이벤트 정보가 표시된다', () => {
      render(<NewsDetail news={mockArticle} />);

      expect(screen.getByText('관련 이벤트')).toBeInTheDocument();
      expect(screen.getByText('이벤트 ID: 1')).toBeInTheDocument();
      expect(screen.getByText('제공: NASA')).toBeInTheDocument();
    });
  });

  describe('작성자 정보', () => {
    it('작성자 정보가 표시된다', () => {
      render(<NewsDetail news={mockArticle} />);

      expect(screen.getByText('작성자')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });

    it('소셜 링크가 표시된다', () => {
      render(<NewsDetail news={mockArticle} />);

      const twitterLink = screen.getByRole('link', { name: 'X' });
      const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });

      expect(twitterLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/johndoe');
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/johndoe');
    });

    it('모든 소셜 링크가 올바르게 표시된다', () => {
      const allSocialsAuthor = {
        name: 'Social Butterfly',
        socials: {
          x: 'https://twitter.com/social',
          linkedin: 'https://linkedin.com/in/social',
          mastodon: 'https://mastodon.social/@social',
          bluesky: 'https://bsky.app/profile/social.bsky.social',
          youtube: 'https://youtube.com/c/social',
          instagram: 'https://instagram.com/social',
        },
      };
      const newsWithAllSocials = { ...mockArticle, authors: [allSocialsAuthor] };

      render(<NewsDetail news={newsWithAllSocials} />);

      expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute('href', allSocialsAuthor.socials.x);
      expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', allSocialsAuthor.socials.linkedin);
      expect(screen.getByRole('link', { name: 'Mastodon' })).toHaveAttribute('href', allSocialsAuthor.socials.mastodon);
      expect(screen.getByRole('link', { name: 'Bluesky' })).toHaveAttribute('href', allSocialsAuthor.socials.bluesky);
      expect(screen.getByRole('link', { name: 'YouTube' })).toHaveAttribute('href', allSocialsAuthor.socials.youtube);
      expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', allSocialsAuthor.socials.instagram);
    });

    it('작성자가 없는 경우 작성자 섹션이 표시되지 않는다', () => {
      render(<NewsDetail news={mockReport} />);

      expect(screen.queryByText('작성자')).not.toBeInTheDocument();
    });
  });

  describe('외부 링크', () => {
    it('외부 링크 버튼이 표시된다', () => {
      render(<NewsDetail news={mockArticle} />);

      const externalLink = screen.getByRole('button', { name: /원문 보러가기/i });
      expect(externalLink).toBeInTheDocument();
      expect(screen.getByTestId('external-link-icon')).toBeInTheDocument();
    });

    it('외부 링크 클릭 시 콜백이 호출된다', () => {
      const onExternalLinkClick = vi.fn();
      render(<NewsDetail news={mockArticle} onExternalLinkClick={onExternalLinkClick} />);

      const externalLink = screen.getByRole('button', { name: /원문 보러가기/i });
      fireEvent.click(externalLink);

      expect(onExternalLinkClick).toHaveBeenCalledWith(mockArticle.url);
    });

    it('콜백이 없는 경우 window.open이 호출된다', () => {
      const windowOpen = vi.spyOn(window, 'open').mockImplementation(() => null);
      render(<NewsDetail news={mockArticle} />);

      const externalLink = screen.getByRole('button', { name: /원문 보러가기/i });
      fireEvent.click(externalLink);

      expect(windowOpen).toHaveBeenCalledWith(
        mockArticle.url,
        '_blank',
        'noopener,noreferrer'
      );

      windowOpen.mockRestore();
    });
  });

  describe('다양한 뉴스 타입', () => {
    it('Blog 타입을 올바르게 렌더링한다', () => {
      render(<NewsDetail news={mockBlog} />);

      expect(screen.getByText(mockBlog.title)).toBeInTheDocument();
      expect(screen.getByText(mockBlog.summary)).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();

      // Article 전용 기능은 표시되지 않음
      expect(screen.queryByText('관련 발사 정보')).not.toBeInTheDocument();
      expect(screen.queryByText('관련 이벤트')).not.toBeInTheDocument();
    });

    it('Report 타입을 올바르게 렌더링한다', () => {
      render(<NewsDetail news={mockReport} />);

      expect(screen.getByText(mockReport.title)).toBeInTheDocument();
      expect(screen.getByText(mockReport.summary)).toBeInTheDocument();

      // 작성자 정보가 없어도 오류가 발생하지 않음
      expect(screen.queryByText('작성자')).not.toBeInTheDocument();
    });
  });

  describe('날짜 표시', () => {
    it('발행일과 수정일이 다른 경우 수정일도 표시된다', () => {
      render(<NewsDetail news={mockReport} />);

      expect(screen.getByText(/발행:/)).toBeInTheDocument();
      expect(screen.getByText(/수정:/)).toBeInTheDocument();
    });

    it('발행일과 수정일이 같은 경우 수정일이 표시되지 않는다', () => {
      render(<NewsDetail news={mockBlog} />);

      expect(screen.getByText(/발행:/)).toBeInTheDocument();
      expect(screen.queryByText(/수정:/)).not.toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('제목이 h1 태그로 렌더링된다', () => {
      render(<NewsDetail news={mockArticle} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(mockArticle.title);
    });

    it('이미지에 적절한 alt 텍스트가 설정된다', () => {
      render(<NewsDetail news={mockArticle} />);

      const image = screen.getByAltText(mockArticle.title);
      expect(image).toBeInTheDocument();
    });

    it('외부 링크가 새 창에서 열리도록 설정된다', () => {
      render(<NewsDetail news={mockArticle} />);

      const socialLinks = screen.getAllByRole('link');
      socialLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });
});
