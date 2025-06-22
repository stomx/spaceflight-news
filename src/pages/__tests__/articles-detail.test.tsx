import { useParams } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route } from '../articles/$articleId';

// Mock dependencies
vi.mock('@/features/article-detail', () => ({
  ArticleDetailFeature: ({ articleId }: { articleId: string }) => (
    <div data-testid="article-detail">Article Detail: {articleId}</div>
  ),
}));

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn((path) => (config: any) => ({
    component: config.component,
    path,
  })),
  useParams: vi.fn(),
}));

const mockUseParams = vi.mocked(useParams);

describe('Article Detail Page', () => {
  const ArticleDetailComponent = (Route as any).component;

  describe('라우트 설정', () => {
    it('올바른 경로로 설정된다', () => {
      expect((Route as any).path).toBe('/articles/$articleId');
    });
  });

  describe('컴포넌트 렌더링', () => {
    it('ArticleDetailFeature를 articleId와 함께 렌더링한다', () => {
      mockUseParams.mockReturnValue({ articleId: 'test-article-123' });

      render(<ArticleDetailComponent />);

      expect(screen.getByTestId('article-detail')).toBeInTheDocument();
      expect(screen.getByText('Article Detail: test-article-123')).toBeInTheDocument();
    });

    it('useParams에서 올바른 from 경로를 사용한다', () => {
      mockUseParams.mockReturnValue({ articleId: 'another-article' });

      render(<ArticleDetailComponent />);

      expect(mockUseParams).toHaveBeenCalledWith({ from: '/articles/$articleId' });
    });
  });
});
