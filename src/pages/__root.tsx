import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-2 p-2">
        <Link to="/articles" className="[&.active]:font-bold">
          Article
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});
