import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route } from '../articles/index';

// Mock dependencies
vi.mock('@/features/article-list', () => ({
  ArticleListFeature: () => <div data-testid="article-list">Article List</div>,
}));

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn((path) => (config: any) => ({
    component: config.component,
    path,
  })),
}));

describe('Articles Index Page', () => {
  const ArticlesComponent = (Route as any).component;

  describe('라우트 설정', () => {
    it('올바른 경로로 설정된다', () => {
      expect((Route as any).path).toBe('/articles/');
    });
  });

  describe('컴포넌트 렌더링', () => {
    it('ArticleListFeature를 렌더링한다', () => {
      render(<ArticlesComponent />);

      expect(screen.getByTestId('article-list')).toBeInTheDocument();
      expect(screen.getByText('Article List')).toBeInTheDocument();
    });
  });
});
