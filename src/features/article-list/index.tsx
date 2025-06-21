import { NewsCard } from '@/entities/news/components/NewsCard';
import { NewsListSkeleton } from '@/entities/news/components/NewsCardSkeleton';
import { NewsList } from '@/entities/news/components/NewsList';
import { useNewsListModel } from '@/shared/hooks/useNewsListModel';
import type { Article } from '@/shared/types/news';
import { useNavigate } from '@tanstack/react-router';

export function ArticleListFeature() {
  const { data, isLoading, isError, error, page, limit, totalPages, search } = useNewsListModel<Article>('articles');
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    navigate({ search: { ...search, page: newPage, limit } });
  };

  if (isLoading) {
    return <NewsListSkeleton count={limit} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <div className="text-lg font-medium mb-2">기사를 불러올 수 없습니다</div>
        <div className="text-muted-foreground text-sm">
          {error?.message || '네트워크를 확인하고 다시 시도해주세요.'}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-4xl mb-4">📭</div>
        <div className="text-muted-foreground">데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <NewsList
      items={data.results}
      renderItem={(article) => (
        <NewsCard
          key={article.id}
          imageUrl={article.image_url}
          title={article.title}
          summary={article.summary}
          date={new Date(article.published_at).toLocaleDateString()}
          site={article.news_site}
          featured={article.featured}
        >
          {/* 버튼 등 children */}
        </NewsCard>
      )}
      emptyText="표시할 기사가 없습니다."
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
