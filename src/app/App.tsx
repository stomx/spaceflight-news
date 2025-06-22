import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen';
import { queryClient } from '../shared/api/query-client';
import { QueryProvider } from './providers/query-provider';

const router = createRouter({
  routeTree,
  basepath: '/spaceflight-news',
  scrollRestoration: true,
});

export function App() {
  return (
    <QueryProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
