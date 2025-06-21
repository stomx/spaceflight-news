import { useCallback, useState } from 'react';

export interface ErrorState {
  error: Error | null;
  isError: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
  });

  const handleError = useCallback((error: Error | string) => {
    const errorObj = error instanceof Error ? error : new Error(error);
    setErrorState({
      error: errorObj,
      isError: true,
    });
    // 개발환경에서만 콘솔에 로그 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', errorObj);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
    });
  }, []);

  const withErrorHandling = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: 제네릭 함수 파라미터로 any 필요
    <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
      return async (...args: T): Promise<R | null> => {
        try {
          clearError();
          return await fn(...args);
        } catch (error) {
          handleError(error instanceof Error ? error : new Error(String(error)));
          return null;
        }
      };
    },
    [handleError, clearError],
  );

  return {
    ...errorState,
    handleError,
    clearError,
    withErrorHandling,
  };
}
