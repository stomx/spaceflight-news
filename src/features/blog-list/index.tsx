import { NewsCard } from '@/shared/components/NewsCard';
import { NewsList } from '@/shared/components/NewsList';
import { useNewsListModel } from '@/shared/hooks/useNewsListModel';
import type { Blog } from '@/shared/types/news';
import { useNavigate } from '@tanstack/react-router';

export function BlogListFeature() {
  const { data, isLoading, isError, error, page, limit, totalPages, search } = useNewsListModel<Blog>('blogs');
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
      renderItem={(blog: Blog) => (
        <NewsCard
          key={blog.id}
          imageUrl={blog.image_url}
          title={blog.title}
          summary={blog.summary}
          date={new Date(blog.published_at).toLocaleDateString()}
          site={blog.news_site}
          featured={blog.featured}
        >
          {/* 버튼 등 children */}
        </NewsCard>
      )}
      emptyText="표시할 블로그가 없습니다."
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
