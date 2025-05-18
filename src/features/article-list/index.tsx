import { NewsCard } from '@/shared/components/NewsCard';
import { NewsList } from '@/shared/components/NewsList';
import { useNewsListModel } from '@/shared/hooks/useNewsListModel';
import type { Article } from '@/shared/types/news';
import { useNavigate } from '@tanstack/react-router';

export function ArticleListFeature() {
  const { data, isLoading, isError, error, page, limit, totalPages, search } = useNewsListModel<Article>('articles');
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    navigate({ search: { ...search, page: newPage, limit } });
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error?.message}</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

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
