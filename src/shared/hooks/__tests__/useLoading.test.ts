import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useLoading } from '../useLoading';

describe('useLoading', () => {
  it('초기 상태가 올바르게 설정되어야 한다', () => {
    const { result } = renderHook(() => useLoading());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.loadingStates).toEqual({});
    expect(result.current.isLoadingAny()).toBe(false);
  });

  it('커스텀 초기 상태로 시작할 수 있어야 한다', () => {
    const { result } = renderHook(() => useLoading(true));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isLoadingAny()).toBe(true);
  });

  it('글로벌 로딩 상태를 설정할 수 있어야 한다', () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isLoadingAny()).toBe(true);
  });

  it('특정 키의 로딩 상태를 설정할 수 있어야 한다', () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.setLoadingState('test-key', true);
    });

    expect(result.current.isLoadingKey('test-key')).toBe(true);
    expect(result.current.isLoadingAny()).toBe(true);
    expect(result.current.isLoading).toBe(false); // 글로벌은 여전히 false
  });

  it('특정 키의 로딩 상태를 지울 수 있어야 한다', () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.setLoadingState('test-key', true);
    });

    expect(result.current.isLoadingKey('test-key')).toBe(true);

    act(() => {
      result.current.clearLoadingState('test-key');
    });

    expect(result.current.isLoadingKey('test-key')).toBe(false);
    expect(result.current.isLoadingAny()).toBe(false);
  });

  it('withLoading이 성공적인 함수를 올바르게 처리해야 한다', async () => {
    const { result } = renderHook(() => useLoading());
    const successfulFn = vi.fn().mockResolvedValue('성공');

    const wrappedFn = result.current.withLoading(successfulFn);

    // 비동기 함수 실행
    let returnValue: unknown;
    await act(async () => {
      returnValue = await wrappedFn('테스트 인자');
    });

    expect(returnValue).toBe('성공');
    expect(successfulFn).toHaveBeenCalledWith('테스트 인자');
    expect(result.current.isLoading).toBe(false);
  });

  it('withLoading이 키를 사용해서 특정 로딩 상태를 관리해야 한다', async () => {
    const { result } = renderHook(() => useLoading());
    const successfulFn = vi.fn().mockResolvedValue('성공');

    const wrappedFn = result.current.withLoading(successfulFn, 'test-key');

    // 비동기 함수 실행
    await act(async () => {
      await wrappedFn();
    });

    expect(result.current.isLoadingKey('test-key')).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('withLoading이 실패한 함수에서도 로딩 상태를 올바르게 해제해야 한다', async () => {
    const { result } = renderHook(() => useLoading());
    const failingFn = vi.fn().mockRejectedValue(new Error('함수 실패'));

    const wrappedFn = result.current.withLoading(failingFn);

    try {
      await act(async () => {
        await wrappedFn();
      });
    } catch (_error) {
      // 에러가 발생해도 로딩 상태는 해제되어야 함
      expect(result.current.isLoading).toBe(false);
    }
  });

  it('여러 키의 로딩 상태가 올바르게 관리되어야 한다', () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.setLoadingState('key1', true);
      result.current.setLoadingState('key2', true);
    });

    expect(result.current.isLoadingKey('key1')).toBe(true);
    expect(result.current.isLoadingKey('key2')).toBe(true);
    expect(result.current.isLoadingAny()).toBe(true);

    act(() => {
      result.current.setLoadingState('key1', false);
    });

    expect(result.current.isLoadingKey('key1')).toBe(false);
    expect(result.current.isLoadingKey('key2')).toBe(true);
    expect(result.current.isLoadingAny()).toBe(true); // key2가 여전히 true

    act(() => {
      result.current.setLoadingState('key2', false);
    });

    expect(result.current.isLoadingAny()).toBe(false);
  });
});
