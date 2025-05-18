import HomePage from '@/pages/home';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/shared/styles/index.css';
import { queryClient } from '@/shared/api/query-client';
import { QueryProvider } from './providers/query-provider';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider client={queryClient}>
      <HomePage />
    </QueryProvider>
  </StrictMode>,
);
