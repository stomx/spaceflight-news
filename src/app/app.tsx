import { routeTree } from '@/routeTree.gen';
import { queryClient } from '@/shared/api/query-client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from './providers/query-provider';
import '@/shared/styles/index.css';

const router = createRouter({ routeTree });

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
);
