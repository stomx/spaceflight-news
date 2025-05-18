import { Button } from '@/shared/components/ui/button';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useBlogsQuery } from './model/useBlogsQuery';
import { BlogList, BlogListSkeleton } from './ui/BlogList';

const DEFAULT_LIMIT = 10;

export function BlogListFeature() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const page = Number(search.page) || 1;
  const limit = Number(search.limit) || DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  const { data, isLoading, isError, error } = useBlogsQuery({ limit, offset });

  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    navigate({
      search: { ...search, page: newPage, limit },
    });
  };

  if (isLoading) return <BlogListSkeleton />;
  if (isError) return <div className="py-8 text-destructive text-center">에러 발생: {error?.message}</div>;
  if (!data) return <div className="py-8 text-muted-foreground text-center">데이터가 없습니다.</div>;

  return (
    <div>
      <BlogList blogs={data.results} />
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} variant="outline">
          이전
        </Button>
        <span className="text-muted-foreground text-sm">
          {page} / {totalPages || 1}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          variant="outline"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
