import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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