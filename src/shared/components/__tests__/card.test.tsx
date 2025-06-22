import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('div 요소로 렌더링된다', () => {
      render(<Card data-testid="card">카드 콘텐츠</Card>);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card.tagName).toBe('DIV');
    });

    it('data-slot 속성이 설정된다', () => {
      render(<Card data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('data-slot', 'card');
    });

    it('기본 클래스가 적용된다', () => {
      render(<Card data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass(
        'bg-card',
        'text-card-foreground',
        'flex',
        'flex-col',
        'gap-6',
        'rounded-xl',
        'border',
        'shadow-sm'
      );
    });

    it('커스텀 className이 적용된다', () => {
      render(<Card className="custom-card" data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-card', 'bg-card');
    });

    it('추가 props가 전달된다', () => {
      render(<Card id="my-card" role="region" data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('id', 'my-card');
      expect(card).toHaveAttribute('role', 'region');
    });
  });

  describe('CardHeader', () => {
    it('올바르게 렌더링된다', () => {
      render(<CardHeader data-testid="header">헤더</CardHeader>);
      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-slot', 'card-header');
    });

    it('기본 클래스가 적용된다', () => {
      render(<CardHeader data-testid="header" />);
      const header = screen.getByTestId('header');
      expect(header).toHaveClass(
        '@container/card-header',
        'grid',
        'auto-rows-min',
        'grid-rows-[auto_auto]',
        'items-start',
        'gap-1.5',
        'px-6'
      );
    });
  });

  describe('CardTitle', () => {
    it('올바르게 렌더링된다', () => {
      render(<CardTitle data-testid="title">제목</CardTitle>);
      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('data-slot', 'card-title');
      expect(title).toHaveTextContent('제목');
    });

    it('기본 클래스가 적용된다', () => {
      render(<CardTitle data-testid="title" />);
      const title = screen.getByTestId('title');
      expect(title).toHaveClass('leading-none', 'font-semibold');
    });
  });

  describe('CardDescription', () => {
    it('올바르게 렌더링된다', () => {
      render(<CardDescription data-testid="description">설명</CardDescription>);
      const description = screen.getByTestId('description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('data-slot', 'card-description');
      expect(description).toHaveTextContent('설명');
    });

    it('기본 클래스가 적용된다', () => {
      render(<CardDescription data-testid="description" />);
      const description = screen.getByTestId('description');
      expect(description).toHaveClass('text-muted-foreground', 'text-sm');
    });
  });

  describe('CardAction', () => {
    it('올바르게 렌더링된다', () => {
      render(<CardAction data-testid="action">액션</CardAction>);
      const action = screen.getByTestId('action');
      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute('data-slot', 'card-action');
      expect(action).toHaveTextContent('액션');
    });

    it('기본 클래스가 적용된다', () => {
      render(<CardAction data-testid="action" />);
      const action = screen.getByTestId('action');
      expect(action).toHaveClass(
        'col-start-2',
        'row-span-2',
        'row-start-1',
        'self-start',
        'justify-self-end'
      );
    });
  });

  describe('CardContent', () => {
    it('올바르게 렌더링된다', () => {
      render(<CardContent data-testid="content">콘텐츠</CardContent>);
      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'card-content');
      expect(content).toHaveTextContent('콘텐츠');
    });

    it('기본 클래스가 적용된다', () => {
      render(<CardContent data-testid="content" />);
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('px-6');
    });
  });

  describe('CardFooter', () => {
    it('올바르게 렌더링된다', () => {
      render(<CardFooter data-testid="footer">푸터</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-slot', 'card-footer');
      expect(footer).toHaveTextContent('푸터');
    });

    it('기본 클래스가 적용된다', () => {
      render(<CardFooter data-testid="footer" />);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('flex', 'items-center', 'px-6', '[.border-t]:pt-6');
    });
  });

  describe('통합 사용', () => {
    it('전체 카드 구조가 올바르게 렌더링된다', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">카드 제목</CardTitle>
            <CardDescription data-testid="description">카드 설명</CardDescription>
            <CardAction data-testid="action">
              <button>액션</button>
            </CardAction>
          </CardHeader>
          <CardContent data-testid="content">
            <p>카드 본문 내용</p>
          </CardContent>
          <CardFooter data-testid="footer">
            <button>확인</button>
            <button>취소</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('카드 제목');
      expect(screen.getByTestId('description')).toHaveTextContent('카드 설명');
      expect(screen.getByTestId('action')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toHaveTextContent('카드 본문 내용');
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('스타일링 시스템', () => {
    it('모든 컴포넌트가 커스텀 className을 받을 수 있다', () => {
      render(
        <Card className="card-custom" data-testid="card">
          <CardHeader className="header-custom" data-testid="header" />
          <CardTitle className="title-custom" data-testid="title" />
          <CardDescription className="desc-custom" data-testid="description" />
          <CardAction className="action-custom" data-testid="action" />
          <CardContent className="content-custom" data-testid="content" />
          <CardFooter className="footer-custom" data-testid="footer" />
        </Card>
      );

      expect(screen.getByTestId('card')).toHaveClass('card-custom');
      expect(screen.getByTestId('header')).toHaveClass('header-custom');
      expect(screen.getByTestId('title')).toHaveClass('title-custom');
      expect(screen.getByTestId('description')).toHaveClass('desc-custom');
      expect(screen.getByTestId('action')).toHaveClass('action-custom');
      expect(screen.getByTestId('content')).toHaveClass('content-custom');
      expect(screen.getByTestId('footer')).toHaveClass('footer-custom');
    });
  });
});
