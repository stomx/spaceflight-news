import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Badge, badgeVariants } from '../badge';

describe('Badge Component', () => {
  describe('기본 렌더링', () => {
    it('span 요소로 렌더링된다', () => {
      render(<Badge>테스트 배지</Badge>);
      const badge = screen.getByText('테스트 배지');
      expect(badge).toBeInTheDocument();
      expect(badge.tagName).toBe('SPAN');
    });

    it('children이 올바르게 렌더링된다', () => {
      render(<Badge>중요</Badge>);
      expect(screen.getByText('중요')).toBeInTheDocument();
    });

    it('data-slot 속성이 설정된다', () => {
      render(<Badge>테스트</Badge>);
      const badge = screen.getByText('테스트');
      expect(badge).toHaveAttribute('data-slot', 'badge');
    });

    it('기본 클래스가 적용된다', () => {
      render(<Badge>테스트</Badge>);
      const badge = screen.getByText('테스트');
      expect(badge).toHaveClass(
        'inline-flex',
        'justify-center',
        'items-center',
        'gap-1',
        'px-2',
        'py-0.5',
        'border',
        'rounded-md'
      );
    });
  });

  describe('variants', () => {
    it('default variant가 올바른 클래스를 가진다', () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('bg-primary', 'text-primary-foreground', 'border-transparent');
    });

    it('secondary variant가 올바른 클래스를 가진다', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      const badge = screen.getByText('Secondary');
      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground', 'border-transparent');
    });

    it('destructive variant가 올바른 클래스를 가진다', () => {
      render(<Badge variant="destructive">Destructive</Badge>);
      const badge = screen.getByText('Destructive');
      expect(badge).toHaveClass('bg-destructive', 'text-white', 'border-transparent');
    });

    it('outline variant가 올바른 클래스를 가진다', () => {
      render(<Badge variant="outline">Outline</Badge>);
      const badge = screen.getByText('Outline');
      expect(badge).toHaveClass('text-foreground');
      expect(badge).not.toHaveClass('border-transparent');
    });
  });

  describe('asChild prop', () => {
    it('asChild가 true일 때 Slot을 사용한다', () => {
      render(
        <Badge asChild>
          <a href="/test">링크 배지</a>
        </Badge>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('data-slot', 'badge');
      expect(link).toHaveClass('bg-primary'); // default variant 클래스
    });

    it('asChild가 false일 때 span 태그를 사용한다', () => {
      render(<Badge asChild={false}>일반 배지</Badge>);

      const badge = screen.getByText('일반 배지');
      expect(badge).toBeInTheDocument();
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('스타일링', () => {
    it('커스텀 className이 올바르게 적용된다', () => {
      render(<Badge className="custom-badge">커스텀</Badge>);
      const badge = screen.getByText('커스텀');
      expect(badge).toHaveClass('custom-badge');
    });

    it('variant와 className이 모두 적용된다', () => {
      render(<Badge variant="secondary" className="extra-class">Mixed</Badge>);
      const badge = screen.getByText('Mixed');
      expect(badge).toHaveClass('bg-secondary', 'extra-class');
    });
  });

  describe('아이콘과 함께 사용', () => {
    it('아이콘이 포함된 배지가 올바르게 렌더링된다', () => {
      render(
        <Badge>
          <svg data-testid="icon">test icon</svg>
          알림
        </Badge>
      );

      const badge = screen.getByText('알림');
      const icon = screen.getByTestId('icon');

      expect(badge).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(badge).toHaveClass('[&>svg]:size-3');
    });
  });

  describe('추가 props', () => {
    it('onClick 이벤트가 올바르게 전달된다', () => {
      const handleClick = vi.fn();
      render(<Badge onClick={handleClick}>클릭 가능</Badge>);

      const badge = screen.getByText('클릭 가능');
      badge.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('role 속성이 올바르게 전달된다', () => {
      render(<Badge role="status">상태</Badge>);
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });

    it('aria 속성이 올바르게 전달된다', () => {
      render(<Badge aria-label="중요 알림">⚠️</Badge>);
      const badge = screen.getByLabelText('중요 알림');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('링크로 사용할 때', () => {
    it('링크 배지가 hover 효과를 가진다', () => {
      render(
        <Badge asChild variant="default">
          <a href="/link">링크</a>
        </Badge>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('[a&]:hover:bg-primary/90');
    });

    it('아웃라인 배지 링크가 hover 효과를 가진다', () => {
      render(
        <Badge asChild variant="outline">
          <a href="/link">아웃라인 링크</a>
        </Badge>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('[a&]:hover:bg-accent');
    });
  });

  describe('badgeVariants 함수', () => {
    it('default 옵션으로 올바른 클래스를 생성한다', () => {
      const classes = badgeVariants();
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('border-transparent');
    });

    it('커스텀 variant로 올바른 클래스를 생성한다', () => {
      const classes = badgeVariants({ variant: 'destructive' });
      expect(classes).toContain('bg-destructive');
      expect(classes).toContain('text-white');
    });

    it('커스텀 className이 포함된다', () => {
      const classes = badgeVariants({ className: 'custom-class' });
      expect(classes).toContain('custom-class');
    });
  });
});
