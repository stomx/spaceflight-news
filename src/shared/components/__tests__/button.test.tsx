import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonVariants } from '../button';

describe('Button Component', () => {
  describe('기본 렌더링', () => {
    it('button 태그로 렌더링된다', () => {
      render(<Button>테스트 버튼</Button>);
      const button = screen.getByRole('button', { name: '테스트 버튼' });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('children이 올바르게 렌더링된다', () => {
      render(<Button>클릭하세요</Button>);
      expect(screen.getByText('클릭하세요')).toBeInTheDocument();
    });

    it('data-slot 속성이 설정된다', () => {
      render(<Button>테스트</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-slot', 'button');
    });
  });

  describe('variants', () => {
    it('default variant가 올바른 클래스를 가진다', () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('destructive variant가 올바른 클래스를 가진다', () => {
      render(<Button variant="destructive">Destructive</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive', 'text-white');
    });

    it('outline variant가 올바른 클래스를 가진다', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'bg-background');
    });

    it('secondary variant가 올바른 클래스를 가진다', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('ghost variant가 올바른 클래스를 가진다', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent');
    });

    it('link variant가 올바른 클래스를 가진다', () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary', 'underline-offset-4');
    });
  });

  describe('sizes', () => {
    it('default size가 올바른 클래스를 가진다', () => {
      render(<Button size="default">Default Size</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'px-4', 'py-2');
    });

    it('sm size가 올바른 클래스를 가진다', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3');
    });

    it('lg size가 올바른 클래스를 가진다', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-6');
    });

    it('icon size가 올바른 클래스를 가진다', () => {
      render(<Button size="icon">🔍</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('size-9');
    });
  });

  describe('상호작용', () => {
    it('클릭 이벤트가 올바르게 호출된다', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>클릭</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disabled 상태에서 클릭이 무시된다', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick} disabled>비활성화됨</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disabled 버튼이 올바른 클래스를 가진다', () => {
      render(<Button disabled>비활성화됨</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none');
      expect(button).toBeDisabled();
    });
  });

  describe('asChild prop', () => {
    it('asChild가 true일 때 Slot을 사용한다', () => {
      render(
        <Button asChild>
          <a href="/test">링크 버튼</a>
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('data-slot', 'button');
    });

    it('asChild가 false일 때 button 태그를 사용한다', () => {
      render(<Button asChild={false}>일반 버튼</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('추가 props', () => {
    it('커스텀 className이 올바르게 적용된다', () => {
      render(<Button className="custom-class">커스텀</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('type prop이 올바르게 전달된다', () => {
      render(<Button type="submit">제출</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('aria 속성이 올바르게 전달된다', () => {
      render(<Button aria-label="테스트 버튼">버튼</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '테스트 버튼');
    });
  });

  describe('buttonVariants 함수', () => {
    it('default 옵션으로 올바른 클래스를 생성한다', () => {
      const classes = buttonVariants();
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('h-9');
    });

    it('커스텀 variant와 size로 올바른 클래스를 생성한다', () => {
      const classes = buttonVariants({ variant: 'secondary', size: 'lg' });
      expect(classes).toContain('bg-secondary');
      expect(classes).toContain('h-10');
    });

    it('커스텀 className이 포함된다', () => {
      const classes = buttonVariants({ className: 'custom-class' });
      expect(classes).toContain('custom-class');
    });
  });
});
