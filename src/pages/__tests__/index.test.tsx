import { redirect } from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';
import { Route } from '../index';

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn((path) => (config: any) => ({
    beforeLoad: config.beforeLoad,
    component: config.component,
    path,
  })),
  redirect: vi.fn(),
}));

const mockRedirect = vi.mocked(redirect);

describe('Index Page Component', () => {
  describe('라우트 설정', () => {
    it('올바른 경로로 설정된다', () => {
      expect((Route as any).path).toBe('/');
    });

    it('component가 null을 반환한다', () => {
      const component = (Route as any).component;
      expect(component()).toBeNull();
    });
  });

  describe('리다이렉트 로직', () => {
    it('beforeLoad에서 articles로 리다이렉트한다', () => {
      const beforeLoad = (Route as any).beforeLoad;

      mockRedirect.mockImplementation(({ to }) => {
        throw new Error(`Redirect to ${to}`);
      });

      expect(() => beforeLoad()).toThrow('Redirect to /articles');
      expect(mockRedirect).toHaveBeenCalledWith({ to: '/articles' });
    });
  });
});
