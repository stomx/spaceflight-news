import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route } from '../blogs/index';

// Mock dependencies
vi.mock('@/features/blog-list', () => ({
  BlogListFeature: () => <div data-testid="blog-list">Blog List</div>,
}));

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn((path) => (config: any) => ({
    component: config.component,
    path,
  })),
}));

describe('Blogs Index Page', () => {
  const BlogsComponent = (Route as any).component;

  describe('라우트 설정', () => {
    it('올바른 경로로 설정된다', () => {
      expect((Route as any).path).toBe('/blogs/');
    });
  });

  describe('컴포넌트 렌더링', () => {
    it('BlogListFeature를 렌더링한다', () => {
      render(<BlogsComponent />);

      expect(screen.getByTestId('blog-list')).toBeInTheDocument();
      expect(screen.getByText('Blog List')).toBeInTheDocument();
    });
  });
});
