import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { queryClient } from '../query-client';

describe('queryClient', () => {
  it('should be an instance of QueryClient', () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it('should have correct default query options', () => {
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000); // 5분
    expect(defaultOptions.queries?.gcTime).toBe(5 * 60 * 1000); // 5분
  });

  it('should have consistent staleTime and gcTime', () => {
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.staleTime).toEqual(defaultOptions.queries?.gcTime);
  });

  it('should be configured for proper caching behavior', () => {
    const defaultOptions = queryClient.getDefaultOptions();

    // 5분 = 300초 = 300,000ms
    const expectedTime = 5 * 60 * 1000;

    expect(defaultOptions.queries?.staleTime).toBe(expectedTime);
    expect(defaultOptions.queries?.gcTime).toBe(expectedTime);
  });

  it('should allow query creation and execution', () => {
    // QueryClient의 기본 메소드들이 존재하는지 확인
    expect(typeof queryClient.fetchQuery).toBe('function');
    expect(typeof queryClient.setQueryData).toBe('function');
    expect(typeof queryClient.getQueryData).toBe('function');
    expect(typeof queryClient.invalidateQueries).toBe('function');
    expect(typeof queryClient.clear).toBe('function');
  });

  it('should have proper query cache configuration', () => {
    const queryCache = queryClient.getQueryCache();

    expect(queryCache).toBeDefined();
    expect(typeof queryCache.find).toBe('function');
    expect(typeof queryCache.findAll).toBe('function');
  });

  it('should have proper mutation cache configuration', () => {
    const mutationCache = queryClient.getMutationCache();

    expect(mutationCache).toBeDefined();
    expect(typeof mutationCache.find).toBe('function');
    expect(typeof mutationCache.findAll).toBe('function');
  });

  it('should be able to mount and unmount', () => {
    expect(() => {
      queryClient.mount();
    }).not.toThrow();

    expect(() => {
      queryClient.unmount();
    }).not.toThrow();
  });

  it('should handle query data operations', () => {
    const testKey = ['test', 'query'];
    const testData = { id: 1, name: 'test' };

    // 데이터 설정
    queryClient.setQueryData(testKey, testData);

    // 데이터 조회
    const retrievedData = queryClient.getQueryData(testKey);
    expect(retrievedData).toEqual(testData);

    // 데이터 제거
    queryClient.removeQueries({ queryKey: testKey });
    const removedData = queryClient.getQueryData(testKey);
    expect(removedData).toBeUndefined();
  });
});
