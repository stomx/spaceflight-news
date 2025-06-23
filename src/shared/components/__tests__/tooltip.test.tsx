import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../tooltip';

describe('Tooltip Component', () => {
  describe('기본 렌더링', () => {
    it('올바르게 렌더링된다', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
            <TooltipContent>기본 툴팁</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('트리거 요소가 올바르게 표시된다', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">클릭하세요</TooltipTrigger>
            <TooltipContent>도움말</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('클릭하세요');
    });
  });

  describe('상호작용', () => {
    it('마우스 호버시 툴팁이 나타난다', async () => {
      const user = userEvent.setup();

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
            <TooltipContent>호버 툴팁</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const trigger = screen.getByTestId('trigger');

      await user.hover(trigger);

      await waitFor(() => {
        const tooltips = screen.getAllByText('호버 툴팁');
        expect(tooltips[0]).toBeInTheDocument();
      });
    });

    it('포커스시 툴팁이 나타나고 블러시 사라진다', async () => {
      const user = userEvent.setup();
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
            <TooltipContent>포커스 툴팁</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      // userEvent.tab()을 사용하여 포커스를 시뮬레이션합니다.
      await user.tab();

      await waitFor(() => {
        // getByText 대신 getByRole을 사용하여 정확한 툴팁 요소를 찾습니다.
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByRole('tooltip')).toHaveTextContent('포커스 툴팁');
      });

      // 다시 tab()을 호출하여 포커스를 다른 곳으로 이동시켜 블러 효과를 냅니다.
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('접근성', () => {
    it('적절한 ARIA 속성이 설정된다', async () => {
      const user = userEvent.setup();

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
            <TooltipContent>접근성 툴팁</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const trigger = screen.getByTestId('trigger');

      await user.hover(trigger);

      await waitFor(() => {
        // role="tooltip"을 가진 요소 찾기
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('접근성 툴팁');
      });
    });
  });

  describe('커스텀 컨텐츠', () => {
    it('다양한 콘텐츠를 표시할 수 있다', async () => {
      const user = userEvent.setup();

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">정보 버튼</TooltipTrigger>
            <TooltipContent>
              <div>
                <h4>제목</h4>
                <p>상세 설명이 여기에 표시됩니다.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const trigger = screen.getByTestId('trigger');

      await user.hover(trigger);

      await waitFor(() => {
        const titles = screen.getAllByText('제목');
        const descriptions = screen.getAllByText('상세 설명이 여기에 표시됩니다.');
        expect(titles[0]).toBeInTheDocument();
        expect(descriptions[0]).toBeInTheDocument();
      });
    });

    it('텍스트만 포함하는 간단한 툴팁', async () => {
      const user = userEvent.setup();

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">간단한 버튼</TooltipTrigger>
            <TooltipContent>간단한 설명</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const trigger = screen.getByTestId('trigger');

      await user.hover(trigger);

      await waitFor(() => {
        const tooltips = screen.getAllByText('간단한 설명');
        expect(tooltips[0]).toBeInTheDocument();
      });
    });
  });

  describe('커스텀 스타일링', () => {
    it('커스텀 className이 적용된다', async () => {
      const user = userEvent.setup();

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
            <TooltipContent className="custom-tooltip">커스텀 툴팁</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const trigger = screen.getByTestId('trigger');

      await user.hover(trigger);

      await waitFor(() => {
        const tooltips = screen.getAllByText('커스텀 툴팁');
        const tooltip = tooltips[0].closest('[data-slot="tooltip-content"]');
        expect(tooltip).toHaveClass('custom-tooltip');
      });
    });

    it('sideOffset이 적용된다', async () => {
      const user = userEvent.setup();

      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
            <TooltipContent sideOffset={10}>오프셋 툴팁</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const trigger = screen.getByTestId('trigger');

      await user.hover(trigger);

      await waitFor(() => {
        const tooltips = screen.getAllByText('오프셋 툴팁');
        expect(tooltips[0]).toBeInTheDocument();
      });
    });
  });
});
