import { NewsCard } from '@/entities/news/components/NewsCard';
import { NewsListSkeleton } from '@/entities/news/components/NewsCardSkeleton';
import { NewsList } from '@/entities/news/components/NewsList';
import { useNewsListModel } from '@/shared/hooks/useNewsListModel';
import { cleanSearchParams } from '@/shared/lib/utils';
import type { Report } from '@/shared/types/news';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';

export function ReportListFeature() {
  const { data, isLoading, isError, error, page, limit, totalPages, search } = useNewsListModel<Report>('reports');
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    const searchParams = cleanSearchParams(search, newPage, limit);
    navigate({ search: searchParams as never });
  };

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <NewsListSkeleton count={limit} />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12 px-4 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="text-4xl mb-4"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          ⚠️
        </motion.div>
        <div className="text-lg font-medium mb-2">보고서를 불러올 수 없습니다</div>
        <div className="text-muted-foreground text-sm">
          {error?.message || '네트워크를 확인하고 다시 시도해주세요.'}
        </div>
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="text-4xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          📭
        </motion.div>
        <div className="text-muted-foreground">데이터가 없습니다.</div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <NewsList
        items={data.results}
        renderItem={(report) => (
          <NewsCard
            key={report.id}
            imageUrl={report.image_url}
            title={report.title}
            summary={report.summary}
            date={new Date(report.published_at).toLocaleDateString()}
            site={report.news_site}
            featured={report.featured}
            onClick={() => {
              const searchParams = cleanSearchParams(search, page, limit);
              navigate({
                to: `/reports/${report.id}`,
                search: searchParams as never
              });
            }}
          >
            {/* 버튼 등 children */}
          </NewsCard>
        )}
        emptyText="표시할 보고서가 없습니다."
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
}