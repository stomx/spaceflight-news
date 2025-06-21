import { useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  loadingStates: Record<string, boolean>;
}

export function useLoading(initialState = false) {
  const [globalLoading, setGlobalLoading] = useState(initialState);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((loading: boolean) => {
    setGlobalLoading(loading);
  }, []);

  const setLoadingState = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const clearLoadingState = useCallback((key: string) => {
    setLoadingStates(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const isLoadingAny = useCallback(() => {
    return globalLoading || Object.values(loadingStates).some(Boolean);
  }, [globalLoading, loadingStates]);

  const isLoadingKey = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const withLoading = useCallback(
    <T extends any[], R>(fn: (...args: T) => Promise<R>, key?: string) => {
      return async (...args: T): Promise<R> => {
        if (key) {
          setLoadingState(key, true);
        } else {
          setLoading(true);
        }

        try {
          return await fn(...args);
        } finally {
          if (key) {
            setLoadingState(key, false);
          } else {
            setLoading(false);
          }
        }
      };
    },
    [setLoading, setLoadingState]
  );

  return {
    isLoading: globalLoading,
    loadingStates,
    setLoading,
    setLoadingState,
    clearLoadingState,
    isLoadingAny,
    isLoadingKey,
    withLoading,
  };
}
