import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Gnb } from '@/widgets/gnb/ui/Gnb';

export const Route = createRootRoute({
  component: () => (
    <>
      <Gnb />
      <div className="flex flex-col justify-center gap-2 p-4">
        <Outlet />
      </div>
    </>
  ),
});
