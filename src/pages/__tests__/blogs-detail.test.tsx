import { useParams } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route } from '../blogs/$blogId';

// Mock dependencies
vi.mock('@/features/blog-detail', () => ({
  BlogDetailFeature: ({ blogId }: { blogId: string }) => <div data-testid="blog-detail">Blog Detail: {blogId}</div>,
}));

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn((path) => (config: any) => ({
    component: config.component,
    path,
  })),
  useParams: vi.fn(),
}));

const mockUseParams = vi.mocked(useParams);

describe('Blog Detail Page', () => {
  const BlogDetailComponent = (Route as any).component;

  describe('라우트 설정', () => {
    it('올바른 경로로 설정된다', () => {
      expect((Route as any).path).toBe('/blogs/$blogId');
    });
  });

  describe('컴포넌트 렌더링', () => {
    it('BlogDetailFeature를 blogId와 함께 렌더링한다', () => {
      mockUseParams.mockReturnValue({ blogId: 'test-blog-456' });

      render(<BlogDetailComponent />);

      expect(screen.getByTestId('blog-detail')).toBeInTheDocument();
      expect(screen.getByText('Blog Detail: test-blog-456')).toBeInTheDocument();
    });

    it('useParams에서 올바른 from 경로를 사용한다', () => {
      mockUseParams.mockReturnValue({ blogId: 'another-blog' });

      render(<BlogDetailComponent />);

      expect(mockUseParams).toHaveBeenCalledWith({ from: '/blogs/$blogId' });
    });
  });
});
