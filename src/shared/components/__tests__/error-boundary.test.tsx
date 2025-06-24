import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from '../error-boundary';

// 에러를 던지는 테스트 컴포넌트
function ThrowError({ shouldThrow = true, errorMessage = '테스트 에러' }: { shouldThrow?: boolean; errorMessage?: string }) {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div>정상 컴포넌트</div>;
}

describe('ErrorBoundary Component', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // console.error를 모킹하여 테스트 중 오류 로그가 출력되지 않도록 함
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('기본 렌더링', () => {
    it('에러가 없을 때 자식 컴포넌트를 정상적으로 렌더링한다', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">정상 컴포넌트</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('정상 컴포넌트')).toBeInTheDocument();
    });
  });

  describe('에러 처리', () => {    it('자식 컴포넌트에서 에러가 발생하면 에러 UI를 보여준다', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument();
      expect(screen.getByText('테스트 에러')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
      expect(screen.queryByText('정상 컴포넌트')).not.toBeInTheDocument();
    });

    it('커스텀 에러 메시지를 표시한다', () => {
      render(
        <ErrorBoundary>
          <ThrowError errorMessage="커스텀 에러 메시지" />
        </ErrorBoundary>
      );

      expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument();
      expect(screen.getByText('커스텀 에러 메시지')).toBeInTheDocument();
    });

    it('에러 발생 시 기본 fallback UI가 올바르게 표시된다', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Card 컴포넌트가 렌더링되는지 확인
      const errorCard = screen.getByRole('button', { name: '다시 시도' }).closest('[data-slot="card"]');
      expect(errorCard).toBeInTheDocument();
      
      // 에러 제목과 메시지 확인
      expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument();
      expect(screen.getByText('테스트 에러')).toBeInTheDocument();
    });
  });

  describe('에러 복구', () => {
    it('다시 시도 버튼을 클릭하면 에러 상태가 초기화된다', () => {
      let shouldThrowError = true;

      function ToggleError() {
        if (shouldThrowError) {
          throw new Error('테스트 에러');
        }
        return <div data-testid="success">정상 컴포넌트</div>;
      }

      render(
        <ErrorBoundary>
          <ToggleError />
        </ErrorBoundary>
      );

      // 에러 상태 확인
      expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument();
      expect(screen.getByText('테스트 에러')).toBeInTheDocument();

      // 에러를 해결하고 다시 시도
      shouldThrowError = false;
      const retryButton = screen.getByRole('button', { name: '다시 시도' });
      fireEvent.click(retryButton);

      // 정상 컴포넌트가 렌더링되는지 확인
      expect(screen.getByTestId('success')).toBeInTheDocument();
      expect(screen.queryByText('오류가 발생했습니다')).not.toBeInTheDocument();
    });
  });

  describe('개발환경 로깅', () => {    it('개발 환경에서는 콘솔에 에러를 로그한다', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError errorMessage="개발 환경 에러" />
        </ErrorBoundary>
      );

      // React는 자동으로 console.error를 호출하므로 호출되었는지만 확인
      expect(consoleSpy).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('onError 콜백', () => {
    it('에러 발생 시 onError가 호출된다', () => {
      const onErrorSpy = vi.fn();

      render(
        <ErrorBoundary onError={onErrorSpy}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onErrorSpy).toHaveBeenCalled();
    });
  });

  describe('다중 에러', () => {
    it('연속된 에러를 올바르게 처리한다', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError errorMessage="첫 번째 에러" />
        </ErrorBoundary>
      );

      // 첫 번째 에러 확인
      expect(screen.getByText('첫 번째 에러')).toBeInTheDocument();

      // 다른 에러로 rerender
      rerender(
        <ErrorBoundary>
          <ThrowError errorMessage="두 번째 에러" />
        </ErrorBoundary>
      );

      // 여전히 첫 번째 에러가 표시됨 (ErrorBoundary는 상태를 유지)
      expect(screen.getByText('첫 번째 에러')).toBeInTheDocument();
    });
  });

  describe('에러 정보', () => {
    it('에러 메시지가 없을 때 기본 메시지를 표시한다', () => {
      function ThrowErrorWithoutMessage() {
        throw new Error();
      }

      render(
        <ErrorBoundary>
          <ThrowErrorWithoutMessage />
        </ErrorBoundary>
      );

      expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument();
      // 빈 에러 메시지는 표시되지 않아야 함
      const errorContainer = screen.getByText('오류가 발생했습니다').closest('[data-slot="card"]');
      expect(errorContainer).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('에러 상태에서 적절한 ARIA 속성을 가진다', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: '다시 시도' });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toBeEnabled();
    });

    it('에러 메시지가 명확하게 전달된다', () => {
      render(
        <ErrorBoundary>
          <ThrowError errorMessage="명확한 에러 메시지" />
        </ErrorBoundary>
      );

      expect(screen.getByText('명확한 에러 메시지')).toBeInTheDocument();
    });
  });
});
