import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
  client: QueryClient;
}

/**
 * React Query 전역 Provider 컴포넌트입니다.
 * QueryClient 인스턴스를 주입받아 하위 트리에 제공합니다.
 */
export const QueryProvider = ({ client, children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
