import { render, screen, waitFor, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from "react";
import { describe, it, expect } from 'vitest';
import { ToastProvider, useToast } from '../toast';

// 테스트용 헬퍼 컴포넌트
function ToastTester() {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast({ type: 'success', title: '성공', message: '성공했습니다.' })}>
        Success
      </button>
      <button onClick={() => addToast({ type: 'error', title: '에러', message: '실패했습니다.' })}>
        Error
      </button>
    </div>
  );
}

function DismissTester() {
  const { toasts, removeToast } = useToast();
  return (
    <button onClick={() => toasts.forEach(t => removeToast(t.id))}>
      Dismiss All
    </button>
  );
}


describe('Toast Component', () => {
  it('성공 토스트를 표시할 수 있다', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Success' }));

    await waitFor(() => {
      expect(screen.getByText('성공')).toBeInTheDocument();
      expect(screen.getByText('성공했습니다.')).toBeInTheDocument();
    });
  });

  it('개별 토스트를 닫을 수 있다', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>,
    );
    
    await user.click(screen.getByRole('button', { name: 'Success' }));
    
    const closeButton = await screen.findByRole('button', { name: '×' });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('성공')).not.toBeInTheDocument();
    });
  });

  it('모든 토스트를 닫을 수 있다', async () => {
    const user = userEvent.setup();
     render(
      <ToastProvider>
        <ToastTester />
        <DismissTester />
      </ToastProvider>,
    );
    
    await user.click(screen.getByRole('button', { name: 'Success' }));
    await user.click(screen.getByRole('button', { name: 'Error' }));

    await user.click(screen.getByRole('button', { name: 'Dismiss All'}));

    await waitFor(() => {
       expect(screen.queryByText('성공')).not.toBeInTheDocument();
       expect(screen.queryByText('에러')).not.toBeInTheDocument();
    });
  });
});
describe('Toast 추가 동작', () => {
  it('사용 환경 외부에서 useToast 호출 시 에러를 발생시킨다', () => {
    const Test = () => {
      useToast();
      return null;
    };
    expect(() => render(<Test />)).toThrow('useToast must be used within a ToastProvider');
  });

  it('지정된 시간 후 토스트가 자동으로 사라진다', () => {
    vi.useFakeTimers();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.addToast({ type: 'success', message: 'bye' });
    });
    expect(result.current.toasts).toHaveLength(1);
    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.toasts).toHaveLength(0);
    vi.useRealTimers();
  });

  it('persistent 옵션을 사용하면 자동으로 사라지지 않는다', () => {
    vi.useFakeTimers();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.addToast({ type: 'success', message: 'keep', persistent: true, duration: 10 });
    });
    expect(result.current.toasts).toHaveLength(1);
    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.toasts).toHaveLength(1);
    vi.useRealTimers();
  });

  it('clearAllToasts 호출 시 모든 토스트가 제거된다', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.addToast({ type: 'success', message: 'a', persistent: true });
      result.current.addToast({ type: 'error', message: 'b', persistent: true });
      result.current.clearAllToasts();
    });
    expect(result.current.toasts).toHaveLength(0);
  });
});
