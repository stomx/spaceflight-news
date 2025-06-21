import { NewsCard } from '@/entities/news/components/NewsCard';
import { NewsList } from '@/entities/news/components/NewsList';
import { useNewsListModel } from '@/shared/hooks/useNewsListModel';
import type { Blog } from '@/shared/types/news';
import { useNavigate } from '@tanstack/react-router';

export function BlogListFeature() {
  const { data, isLoading, isError, error, page, limit, totalPages, search } = useNewsListModel<Blog>('blogs');
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    navigate({ search: { ...search, page: newPage, limit } });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <div className="text-muted-foreground text-sm">블로그를 불러오는 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <div className="text-lg font-medium mb-2">블로그를 불러올 수 없습니다</div>
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
