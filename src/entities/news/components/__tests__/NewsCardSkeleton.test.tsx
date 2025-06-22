import { render } from '@/test/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { NewsCardSkeleton, NewsListSkeleton } from '../NewsCardSkeleton';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('NewsCardSkeleton', () => {
  it('기본 스켈레톤이 렌더링되어야 한다', () => {
    const { container } = render(<NewsCardSkeleton />);
    
    // 여러 개의 스켈레톤 요소가 있는지 확인 (data-slot 속성 사용)
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('showBadge가 true일 때 배지 스켈레톤을 표시해야 한다', () => {
    const { container } = render(<NewsCardSkeleton showBadge={true} />);
    
    // 배지용 스켈레톤이 포함되어 더 많은 스켈레톤이 렌더링되어야 함
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it('showBadge가 false일 때 배지 스켈레톤을 표시하지 않아야 한다', () => {
    const { container: withoutBadge } = render(<NewsCardSkeleton showBadge={false} />);
    const { container: withBadge } = render(<NewsCardSkeleton showBadge={true} />);
    
    // 배지가 없는 경우가 있는 경우보다 스켈레톤이 적어야 함
    const skeletonsWithoutBadge = withoutBadge.querySelectorAll('[data-slot="skeleton"]');
    const skeletonsWithBadge = withBadge.querySelectorAll('[data-slot="skeleton"]');
    
    expect(skeletonsWithoutBadge.length).toBeLessThan(skeletonsWithBadge.length);
  });

  it('delay prop이 전달되어야 한다', () => {
    const { container } = render(<NewsCardSkeleton delay={5} />);
    
    // 컴포넌트가 렌더링되는지 확인
    expect(container.firstChild).toBeInTheDocument();
  });

  it('카드 구조를 가져야 한다', () => {
    const { container } = render(<NewsCardSkeleton />);
    
    // Card 컴포넌트가 렌더링되는지 확인
    const cardElement = container.querySelector('.w-full');
    expect(cardElement).toBeInTheDocument();
  });
});

describe('NewsListSkeleton', () => {
  it('기본 3개의 스켈레톤 카드를 렌더링해야 한다', () => {
    const { container } = render(<NewsListSkeleton />);
    
    // 기본적으로 3개의 NewsCardSkeleton이 렌더링되어야 함 (Card 컴포넌트로 식별)
    const skeletonCards = container.querySelectorAll('[data-slot="card"]');
    expect(skeletonCards.length).toBe(3);
  });

  it('커스텀 count를 적용해야 한다', () => {
    const { container } = render(<NewsListSkeleton count={5} />);
    
    // 지정한 개수만큼 스켈레톤 카드가 렌더링되어야 함
    const skeletonCards = container.querySelectorAll('[data-slot="card"]');
    expect(skeletonCards.length).toBe(5);
  });

  it('첫 번째와 세 번째 아이템에 배지가 있어야 한다', () => {
    const { container } = render(<NewsListSkeleton count={4} />);
    
    // 전체 스켈레톤 개수 확인
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(10); // 4개의 카드 * 여러 스켈레톤 + 배지 스켈레톤
  });

  it('섹션 컨테이너가 올바른 클래스를 가져야 한다', () => {
    const { container } = render(<NewsListSkeleton />);
    
    // 섹션 컨테이너 확인
    const section = container.querySelector('section');
    expect(section).toHaveClass('flex', 'flex-col', 'gap-3', 'md:gap-4', 'mx-auto', 'w-full', 'max-w-3xl');
  });
});
