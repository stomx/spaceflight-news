import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert, AlertTitle, AlertDescription } from '../alert';

describe('Alert Components', () => {
  describe('Alert', () => {
    it('div 요소로 렌더링된다', () => {
      render(<Alert data-testid="alert">알림 내용</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();
      expect(alert.tagName).toBe('DIV');
    });

    it('role="alert" 속성이 설정된다', () => {
      render(<Alert data-testid="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('role', 'alert');
    });

    it('data-slot 속성이 설정된다', () => {
      render(<Alert data-testid="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-slot', 'alert');
    });

    it('기본 클래스가 적용된다', () => {
      render(<Alert data-testid="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass(
        'relative',
        'items-start',
        'grid',
        'px-4',
        'py-3',
        'border',
        'rounded-lg',
        'w-full',
        'text-sm'
      );
    });
  });

  describe('Alert variants', () => {
    it('default variant가 올바른 클래스를 가진다', () => {
      render(<Alert variant="default" data-testid="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('bg-card', 'text-card-foreground');
    });

    it('destructive variant가 올바른 클래스를 가진다', () => {
      render(<Alert variant="destructive" data-testid="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('text-destructive', 'bg-card');
    });

    it('variant가 지정되지 않으면 default를 사용한다', () => {
      render(<Alert data-testid="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('bg-card', 'text-card-foreground');
    });
  });

  describe('AlertTitle', () => {
    it('올바르게 렌더링된다', () => {
      render(<AlertTitle data-testid="title">알림 제목</AlertTitle>);
      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('data-slot', 'alert-title');
      expect(title).toHaveTextContent('알림 제목');
    });

    it('기본 클래스가 적용된다', () => {
      render(<AlertTitle data-testid="title" />);
      const title = screen.getByTestId('title');
      expect(title).toHaveClass(
        'col-start-2',
        'line-clamp-1',
        'min-h-4',
        'font-medium',
        'tracking-tight'
      );
    });

    it('커스텀 className이 적용된다', () => {
      render(<AlertTitle className="custom-title" data-testid="title" />);
      const title = screen.getByTestId('title');
      expect(title).toHaveClass('custom-title', 'font-medium');
    });
  });

  describe('AlertDescription', () => {
    it('올바르게 렌더링된다', () => {
      render(<AlertDescription data-testid="description">알림 설명</AlertDescription>);
      const description = screen.getByTestId('description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('data-slot', 'alert-description');
      expect(description).toHaveTextContent('알림 설명');
    });

    it('기본 클래스가 적용된다', () => {
      render(<AlertDescription data-testid="description" />);
      const description = screen.getByTestId('description');
      expect(description).toHaveClass(
        'text-muted-foreground',
        'col-start-2',
        'grid',
        'justify-items-start',
        'gap-1',
        'text-sm'
      );
    });

    it('커스텀 className이 적용된다', () => {
      render(<AlertDescription className="custom-desc" data-testid="description" />);
      const description = screen.getByTestId('description');
      expect(description).toHaveClass('custom-desc', 'text-muted-foreground');
    });
  });

  describe('통합 사용', () => {
    it('완전한 Alert 구조가 올바르게 렌더링된다', () => {
      render(
        <Alert variant="default" data-testid="complete-alert">
          <svg data-testid="icon" />
          <AlertTitle data-testid="title">중요한 알림</AlertTitle>
          <AlertDescription data-testid="description">
            이것은 중요한 정보입니다. 확인해주세요.
          </AlertDescription>
        </Alert>
      );

      expect(screen.getByTestId('complete-alert')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('중요한 알림');
      expect(screen.getByTestId('description')).toHaveTextContent('이것은 중요한 정보입니다. 확인해주세요.');
    });

    it('destructive Alert가 올바르게 렌더링된다', () => {
      render(
        <Alert variant="destructive" data-testid="error-alert">
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>문제가 발생했습니다.</AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId('error-alert');
      expect(alert).toHaveClass('text-destructive');
      expect(screen.getByText('오류 발생')).toBeInTheDocument();
      expect(screen.getByText('문제가 발생했습니다.')).toBeInTheDocument();
    });
  });

  describe('아이콘 지원', () => {
    it('아이콘이 있을 때 적절한 그리드 레이아웃이 적용된다', () => {
      render(
        <Alert data-testid="alert-with-icon">
          <svg data-testid="icon" />
          <AlertTitle>제목</AlertTitle>
        </Alert>
      );

      const alert = screen.getByTestId('alert-with-icon');
      expect(alert).toHaveClass('has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]');
    });

    it('아이콘에 적절한 스타일이 적용된다', () => {
      render(
        <Alert data-testid="alert">
          <svg data-testid="icon" />
          <AlertTitle>제목</AlertTitle>
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('[&>svg]:size-4', '[&>svg]:text-current');
    });
  });

  describe('접근성', () => {
    it('role="alert"이 설정되어 스크린 리더에서 즉시 알림된다', () => {
      render(<Alert>긴급 알림</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('긴급 알림');
    });
  });

  describe('스타일링', () => {
    it('모든 컴포넌트가 커스텀 props를 받을 수 있다', () => {
      render(
        <Alert id="custom-alert" data-custom="value" data-testid="alert">
          <AlertTitle id="custom-title" data-testid="title">제목</AlertTitle>
          <AlertDescription id="custom-desc" data-testid="description">설명</AlertDescription>
        </Alert>
      );

      expect(screen.getByTestId('alert')).toHaveAttribute('id', 'custom-alert');
      expect(screen.getByTestId('alert')).toHaveAttribute('data-custom', 'value');
      expect(screen.getByTestId('title')).toHaveAttribute('id', 'custom-title');
      expect(screen.getByTestId('description')).toHaveAttribute('id', 'custom-desc');
    });
  });
});
