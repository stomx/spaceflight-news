import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../tooltip';

describe('Tooltip Component', () => {
  beforeEach(() => {
    // CSS transition이 즉시 완료되도록 설정
    const style = document.createElement('style');
    style.textContent = `
      * {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
  });

  describe('기본 렌더링', () => {
    it('올바르게 렌더링된다', () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
          <TooltipContent data-testid="content">툴팁 내용</TooltipContent>
        </Tooltip>
      );

      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('트리거 요소가 올바르게 표시된다', () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="trigger">호버하세요</TooltipTrigger>
          <TooltipContent>도움말 텍스트</TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveTextContent('호버하세요');
    });
  });

  describe('상호작용', () => {
    it('마우스 호버시 툴팁이 나타난다', async () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
          <TooltipContent>호버 툴팁</TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId('trigger');
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        // 여러 요소 중 첫 번째를 선택
        const tooltips = screen.getAllByText('호버 툴팁');
        expect(tooltips[0]).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('마우스가 벗어나면 툴팁이 사라진다', async () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
          <TooltipContent>호버 툴팁</TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId('trigger');

      // 호버 후 툴팁 나타남
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        expect(screen.getAllByText('호버 툴팁')[0]).toBeInTheDocument();
      });

      // 마우스 나감
      await act(async () => {
        fireEvent.mouseLeave(trigger);
      });

      await waitFor(() => {
        expect(screen.queryByText('호버 툴팁')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('접근성', () => {
    it('적절한 ARIA 속성이 설정된다', async () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
          <TooltipContent>ARIA 툴팁</TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId('trigger');
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        // role="tooltip"을 가진 요소 찾기
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();

        // aria-describedby 속성 확인
        const describedBy = trigger.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(tooltip.id).toBe(describedBy);
      }, { timeout: 1000 });
    });
  });

  describe('커스텀 컨텐츠', () => {
    it('다양한 콘텐츠를 표시할 수 있다', async () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="trigger">정보 버튼</TooltipTrigger>
          <TooltipContent>
            <div>
              <h4>제목</h4>
              <p>상세 설명이 여기에 표시됩니다.</p>
            </div>
          </TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId('trigger');
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        expect(screen.getByText('제목')).toBeInTheDocument();
        expect(screen.getByText('상세 설명이 여기에 표시됩니다.')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('텍스트만 포함하는 간단한 툴팁', async () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="trigger">간단한 버튼</TooltipTrigger>
          <TooltipContent>간단한 설명</TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId('trigger');
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        expect(screen.getAllByText('간단한 설명')[0]).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('커스텀 스타일링', () => {
    it('커스텀 className이 적용된다', async () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
          <TooltipContent className="custom-tooltip">커스텀 툴팁</TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId('trigger');
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        const tooltip = screen.getAllByText('커스텀 툴팁')[0].closest('[data-slot="tooltip-content"]');
        expect(tooltip).toHaveClass('custom-tooltip');
      }, { timeout: 1000 });
    });

    it('sideOffset이 적용된다', async () => {
      render(
        <Tooltip>
          <TooltipTrigger data-testid="trigger">버튼</TooltipTrigger>
          <TooltipContent sideOffset={20}>오프셋 툴팁</TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByTestId('trigger');
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });

      await waitFor(() => {
        expect(screen.getAllByText('오프셋 툴팁')[0]).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });
});
