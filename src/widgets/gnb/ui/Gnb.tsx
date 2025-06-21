import { Button } from '@/shared/components/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link, useMatchRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useMemo } from 'react';

export function Gnb() {
  const menus = useMemo(
    () => [
      {
        label: 'Articles',
        to: '/articles',
      },
      {
        label: 'Blogs',
        to: '/blogs',
      },
    ],
    [],
  );

  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const isArticleDetail = !!matchRoute({ to: '/articles/$articleId' });
  const isBlogDetail = !!matchRoute({ to: '/blogs/$blogId' });
  const isDetailPage = isArticleDetail || isBlogDetail;

  const handleBack = () => {
    if (isArticleDetail) {
      navigate({ to: '/articles', search });
    } else if (isBlogDetail) {
      navigate({ to: '/blogs', search });
    }
  };

  return (
    <nav className="flex justify-between items-center gap-4 bg-background shadow-sm py-2 pr-6 pl-2 border-b">
      <div className="flex items-center gap-2">
        {isDetailPage && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleBack}
            aria-label="목록으로"
            className="p-0 w-8 h-8 cursor-pointer"
          >
            <ArrowLeftIcon />
          </Button>
        )}
      </div>
      <div>
        {menus.map((menu) => (
          <Button asChild variant="ghost" size="sm" className="px-2" key={menu.to}>
            <Link to={menu.to} className="[&.active]:font-bold capitalize">
              {menu.label}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
