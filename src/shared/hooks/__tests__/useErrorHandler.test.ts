import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useErrorHandler } from '../useErrorHandler';

describe('useErrorHandler', () => {
  it('초기 상태가 올바르게 설정되어야 한다', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('Error 객체로 에러를 처리할 수 있어야 한다', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('테스트 에러');

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.isError).toBe(true);
  });

  it('문자열로 에러를 처리할 수 있어야 한다', () => {
    const { result } = renderHook(() => useErrorHandler());
    const errorMessage = '문자열 에러';

    act(() => {
      result.current.handleError(errorMessage);
    });

    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.isError).toBe(true);
  });

  it('에러를 지울 수 있어야 한다', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('테스트 에러');

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.isError).toBe(true);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('withErrorHandling이 성공적인 함수를 올바르게 처리해야 한다', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const successfulFn = vi.fn().mockResolvedValue('성공');

    const wrappedFn = result.current.withErrorHandling(successfulFn);
    const returnValue = await act(async () => await wrappedFn('테스트 인자'));

    expect(returnValue).toBe('성공');
    expect(successfulFn).toHaveBeenCalledWith('테스트 인자');
    expect(result.current.isError).toBe(false);
  });

  it('withErrorHandling이 실패한 함수를 올바르게 처리해야 한다', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const failingFn = vi.fn().mockRejectedValue(new Error('함수 실패'));

    const wrappedFn = result.current.withErrorHandling(failingFn);
    const returnValue = await act(async () => await wrappedFn());

    expect(returnValue).toBeNull();
    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe('함수 실패');
  });

  it('withErrorHandling이 에러 상태를 지우고 새로운 시도를 해야 한다', async () => {
    const { result } = renderHook(() => useErrorHandler());

    // 먼저 에러 상태를 만든다
    act(() => {
      result.current.handleError('이전 에러');
    });
    expect(result.current.isError).toBe(true);

    // 성공하는 함수를 실행한다
    const successfulFn = vi.fn().mockResolvedValue('성공');
    const wrappedFn = result.current.withErrorHandling(successfulFn);

    await act(async () => await wrappedFn());

    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('개발 환경에서는 에러를 콘솔에 출력해야 한다', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('개발 모드 에러');

    act(() => {
      result.current.handleError(testError);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error handled:', testError);

    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});
