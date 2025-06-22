import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useToast, ToastProvider } from '../toast';

// Toast 컴포넌트를 테스트하기 위한 헬퍼 컴포넌트
function ToastTester() {
  const { addToast } = useToast();

  return (
    <div>
      <button
        onClick={() => addToast({ 
          title: '성공', 
          message: '작업이 완료되었습니다',
          type: 'success'
        })}
        data-testid="success-button"
      >
        성공 토스트
      </button>
      <button
        onClick={() => addToast({ 
          title: '에러', 
          message: '오류가 발생했습니다',
          type: 'error'
        })}
        data-testid="error-button"
      >
        에러 토스트
      </button>
      <button
        onClick={() => addToast({ 
          title: '경고', 
          message: '주의가 필요합니다',
          type: 'warning'
        })}
        data-testid="warning-button"
      >
        경고 토스트
      </button>
      <button
        onClick={() => addToast({ 
          title: '정보', 
          message: '정보입니다',
          type: 'info'
        })}
        data-testid="info-button"
      >
        정보 토스트
      </button>
    </div>
  );
}

function ToastClearTester() {
  const { addToast, clearAllToasts } = useToast();

  return (
    <div>
      <button
        onClick={() => addToast({ 
          title: '테스트', 
          message: '테스트 메시지',
          type: 'info'
        })}
        data-testid="add-button"
      >
        토스트 추가
      </button>
      <button
        onClick={() => clearAllToasts()}
        data-testid="clear-button"
      >
        모두 제거
      </button>
    </div>
  );
}

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('기본 렌더링', () => {
    it('ToastProvider가 올바르게 렌더링된다', () => {
      render(
        <ToastProvider>
          <div data-testid="content">내용</div>
        </ToastProvider>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('useToast 훅을 사용할 수 있다', () => {
      render(
        <ToastProvider>
          <ToastTester />
        </ToastProvider>
      );

      expect(screen.getByTestId('success-button')).toBeInTheDocument();
      expect(screen.getByTestId('error-button')).toBeInTheDocument();
      expect(screen.getByTestId('warning-button')).toBeInTheDocument();
      expect(screen.getByTestId('info-button')).toBeInTheDocument();
    });
  });

  describe('Toast 표시', () => {
    it('성공 토스트를 표시할 수 있다', () => {
      render(
        <ToastProvider>
          <ToastTester />
        </ToastProvider>
      );

      const button = screen.getByTestId('success-button');
      fireEvent.click(button);

      expect(screen.getByText('성공')).toBeInTheDocument();
      expect(screen.getByText('작업이 완료되었습니다')).toBeInTheDocument();
    });

    it('에러 토스트를 표시할 수 있다', () => {
      render(
        <ToastProvider>
          <ToastTester />
        </ToastProvider>
      );

      const button = screen.getByTestId('error-button');
      fireEvent.click(button);

      expect(screen.getByText('에러')).toBeInTheDocument();
      expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument();
    });

    it('경고 토스트를 표시할 수 있다', () => {
      render(
        <ToastProvider>
          <ToastTester />
        </ToastProvider>
      );

      const button = screen.getByTestId('warning-button');
      fireEvent.click(button);

      expect(screen.getByText('경고')).toBeInTheDocument();
      expect(screen.getByText('주의가 필요합니다')).toBeInTheDocument();
    });

    it('정보 토스트를 표시할 수 있다', () => {
      render(
        <ToastProvider>
          <ToastTester />
        </ToastProvider>
      );

      const button = screen.getByTestId('info-button');
      fireEvent.click(button);

      expect(screen.getByText('정보')).toBeInTheDocument();
      expect(screen.getByText('정보입니다')).toBeInTheDocument();
    });
  });

  describe('Toast 자동 닫기', () => {
    it('일정 시간 후 자동으로 닫힌다', () => {
      render(
        <ToastProvider>
          <ToastTester />
        </ToastProvider>
      );

      const button = screen.getByTestId('success-button');
      fireEvent.click(button);

      expect(screen.getByText('성공')).toBeInTheDocument();

      // 5초 후 토스트가 사라짐
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.queryByText('성공')).not.toBeInTheDocument();
    });

    it('사용자 정의 지속 시간을 사용할 수 있다', () => {
      function CustomDurationTester() {
        const { addToast } = useToast();

        return (
          <button
            onClick={() => addToast({ 
              title: '커스텀', 
              message: '2초 후 사라집니다',
              type: 'info',
              duration: 2000
            })}
            data-testid="custom-button"
          >
            커스텀 지속시간
          </button>
        );
      }

      render(
        <ToastProvider>
          <CustomDurationTester />
        </ToastProvider>
      );

      const button = screen.getByTestId('custom-button');
      fireEvent.click(button);

      expect(screen.getByText('커스텀')).toBeInTheDocument();

      // 2초 후 토스트가 사라짐
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.queryByText('커스텀')).not.toBeInTheDocument();
    });
  });

  describe('다중 Toast', () => {
    it('여러 토스트를 동시에 표시할 수 있다', () => {
      render(
        <ToastProvider>
          <ToastTester />
        </ToastProvider>
      );

      const successButton = screen.getByTestId('success-button');
      const errorButton = screen.getByTestId('error-button');

      fireEvent.click(successButton);
      fireEvent.click(errorButton);

      expect(screen.getByText('성공')).toBeInTheDocument();
      expect(screen.getByText('에러')).toBeInTheDocument();
    });

    it('모든 토스트를 제거할 수 있다', () => {
      render(
        <ToastProvider>
          <ToastClearTester />
        </ToastProvider>
      );

      const addButton = screen.getByTestId('add-button');
      const clearButton = screen.getByTestId('clear-button');

      // 토스트 3개 추가
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      // 토스트들이 표시되는지 확인
      const toastElements = screen.getAllByText('테스트');
      expect(toastElements).toHaveLength(3);

      // 모든 토스트 제거
      fireEvent.click(clearButton);

      expect(screen.queryByText('테스트')).not.toBeInTheDocument();
    });
  });

  describe('Toast 닫기', () => {
    it('개별 토스트의 닫기 버튼으로 토스트를 닫을 수 있다', () => {
      render(
        <ToastProvider>
          <ToastTester />
        </ToastProvider>
      );

      const button = screen.getByTestId('success-button');
      fireEvent.click(button);

      expect(screen.getByText('성공')).toBeInTheDocument();

      // 닫기 버튼 클릭
      const closeButton = screen.getByRole('button', { name: '×' });
      fireEvent.click(closeButton);

      expect(screen.queryByText('성공')).not.toBeInTheDocument();
    });
  });

  describe('useToast 훅 에러 처리', () => {
    it('ToastProvider 없이 사용하면 에러를 발생시킨다', () => {
      function TestComponent() {
        const { addToast } = useToast();
        return <div onClick={() => addToast({ title: 'test', message: 'test', type: 'info' })}>Test</div>;
      }

      // 에러 메시지를 콘솔에서 숨기기 위해 스파이 설정
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useToast must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Toast 타입별 스타일', () => {
    it('각 타입별로 다른 스타일이 적용된다', () => {
      render(
        <ToastProvider>
          <ToastTester />
        </ToastProvider>
      );

      // 각 타입의 토스트 생성
      fireEvent.click(screen.getByTestId('success-button'));
      fireEvent.click(screen.getByTestId('error-button'));
      fireEvent.click(screen.getByTestId('warning-button'));
      fireEvent.click(screen.getByTestId('info-button'));

      // 모든 토스트가 표시되는지 확인
      expect(screen.getByText('성공')).toBeInTheDocument();
      expect(screen.getByText('에러')).toBeInTheDocument();
      expect(screen.getByText('경고')).toBeInTheDocument();
      expect(screen.getByText('정보')).toBeInTheDocument();
    });
  });
});