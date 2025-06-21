import { routeTree } from '../routeTree.gen';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryProvider } from './providers/query-provider';
import { queryClient } from '../shared/api/query-client';

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
