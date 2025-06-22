import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInfiniteScroll } from '../useInfiniteScroll';

// Mock scroll 이벤트
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

// Mock document 스크롤 속성
Object.defineProperty(document.documentElement, 'scrollTop', {
  value: 0,
  writable: true,
});

Object.defineProperty(document.documentElement, 'scrollHeight', {
  value: 2000,
  writable: true,
});

Object.defineProperty(document.documentElement, 'clientHeight', {
  value: 800,
  writable: true,
});

describe('useInfiniteScroll', () => {
  // biome-ignore lint/suspicious/noExplicitAny: Complex mock type for testing
  let mockQuery: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockQuery = {
      data: {
        pages: [
          { count: 100, results: [{ id: 1 }, { id: 2 }] },
          { count: 100, results: [{ id: 3 }, { id: 4 }] },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: vi.fn().mockResolvedValue({}),
    };
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useInfiniteScroll({ query: mockQuery }));

    expect(result.current.items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isFetchingMore).toBe(false);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.totalCount).toBe(100);
  });

  it('should register scroll event listener on mount', () => {
    renderHook(() => useInfiniteScroll({ query: mockQuery }));

    expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should not register scroll event listener when disabled', () => {
    renderHook(() => useInfiniteScroll({ query: mockQuery, enabled: false }));

    expect(mockAddEventListener).not.toHaveBeenCalled();
  });

  it('should remove scroll event listener on unmount', () => {
    const { unmount } = renderHook(() => useInfiniteScroll({ query: mockQuery }));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should fetch next page when scrolled to threshold', async () => {
    renderHook(() => useInfiniteScroll({ query: mockQuery, threshold: 100 }));

    // 스크롤 이벤트 핸들러 가져오기
    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // 스크롤 위치를 임계값 근처로 설정
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 1100, // scrollTop + clientHeight (800) = 1900, scrollHeight (2000) - threshold (100) = 1900
      writable: true,
    });

    // 스크롤 이벤트 시뮬레이션
    scrollHandler();

    await waitFor(() => {
      expect(mockQuery.fetchNextPage).toHaveBeenCalled();
    });
  });

  it('should not fetch when query is already fetching', () => {
    mockQuery.isFetching = true;

    renderHook(() => useInfiniteScroll({ query: mockQuery }));

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // 스크롤 위치를 임계값 근처로 설정
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 1100,
      writable: true,
    });

    scrollHandler();

    expect(mockQuery.fetchNextPage).not.toHaveBeenCalled();
  });

  it('should not fetch when fetching next page', () => {
    mockQuery.isFetchingNextPage = true;

    renderHook(() => useInfiniteScroll({ query: mockQuery }));

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // 스크롤 위치를 임계값 근처로 설정
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 1100,
      writable: true,
    });

    scrollHandler();

    expect(mockQuery.fetchNextPage).not.toHaveBeenCalled();
  });

  it('should not fetch when no next page available', () => {
    mockQuery.hasNextPage = false;

    renderHook(() => useInfiniteScroll({ query: mockQuery }));

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // 스크롤 위치를 임계값 근처로 설정
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 1100,
      writable: true,
    });

    scrollHandler();

    expect(mockQuery.fetchNextPage).not.toHaveBeenCalled();
  });

  it('should not fetch when scroll position is above threshold', () => {
    renderHook(() => useInfiniteScroll({ query: mockQuery, threshold: 100 }));

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // 스크롤 위치를 임계값보다 위로 설정
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 500, // scrollTop + clientHeight (800) = 1300, scrollHeight (2000) - threshold (100) = 1900
      writable: true,
    });

    scrollHandler();

    expect(mockQuery.fetchNextPage).not.toHaveBeenCalled();
  });

  it('should handle error state correctly', () => {
    mockQuery.isError = true;
    mockQuery.error = new Error('Test error');

    const { result } = renderHook(() => useInfiniteScroll({ query: mockQuery }));

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(new Error('Test error'));
  });

  it('should handle loading state correctly', () => {
    mockQuery.isLoading = true;

    const { result } = renderHook(() => useInfiniteScroll({ query: mockQuery }));

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle empty data correctly', () => {
    mockQuery.data = null;

    const { result } = renderHook(() => useInfiniteScroll({ query: mockQuery }));

    expect(result.current.items).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should handle isFetchingMore state during fetch', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: Function resolver for promise
    let resolveFetch: any;
    mockQuery.fetchNextPage = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const { result } = renderHook(() => useInfiniteScroll({ query: mockQuery }));

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    // 스크롤 위치를 임계값 근처로 설정
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 1100,
      writable: true,
    });

    scrollHandler();

    // fetchNextPage가 호출되면 isFetchingMore가 true가 되어야 함
    await waitFor(() => {
      expect(result.current.isFetchingMore).toBe(true);
    });

    // fetch 완료
    resolveFetch({});

    await waitFor(() => {
      expect(result.current.isFetchingMore).toBe(false);
    });
  });
});
