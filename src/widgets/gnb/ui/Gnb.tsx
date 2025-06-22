import { Button } from '@/shared/components/button';
import { DEFAULT_LIMIT } from '@/shared/config';
import { cleanSearchParams } from '@/shared/lib/utils';
import type { SearchParams } from '@/shared/types/news';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link, useMatchRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { motion } from 'framer-motion';
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
      {
        label: 'Reports',
        to: '/reports',
      },
    ],
    [],
  );

  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const isArticleDetail = !!matchRoute({ to: '/articles/$articleId' });
  const isBlogDetail = !!matchRoute({ to: '/blogs/$blogId' });
  const isReportDetail = !!matchRoute({ to: '/reports/$reportId' });
  const isDetailPage = isArticleDetail || isBlogDetail || isReportDetail;

  const handleBack = () => {
    const page = Number(search.page) || 1;
    const limit = Number(search.limit) || DEFAULT_LIMIT;

    const searchParams = cleanSearchParams(search, page, limit) as SearchParams;

    if (isArticleDetail) {
      navigate({ to: '/articles', search: searchParams });
    } else if (isBlogDetail) {
      navigate({ to: '/blogs', search: searchParams });
    } else if (isReportDetail) {
      navigate({ to: '/reports', search: searchParams });
    }
  };

  return (
    <motion.nav
      className="flex justify-between items-center gap-4 bg-background shadow-sm py-2 pr-6 pl-2 border-b"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2">
        {isDetailPage && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 h-auto text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {isArticleDetail && '기사 목록으로 돌아가기'}
              {isBlogDetail && '블로그 목록으로 돌아가기'}
              {isReportDetail && '보고서 목록으로 돌아가기'}
            </Button>
          </motion.div>
        )}
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {menus.map((menu) => (
          <motion.div
            key={menu.to}
            variants={{
              hidden: { x: 20, opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
            style={{ display: 'inline-block' }}
          >
            <Button asChild variant="ghost" size="sm" className="px-2">
              <Link to={menu.to} className="[&.active]:font-bold capitalize">
                {menu.label}
              </Link>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.nav>
  );
}
