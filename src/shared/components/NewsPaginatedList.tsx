import { Button } from '@/shared/components/button';
import type { UseQueryResult } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type React from 'react';

interface NewsPaginatedListProps<T> {
  useQuery: (params: { limit: number; offset: number }) => UseQueryResult<{ count: number; results: T[] }, Error>;
  ListComponent: React.ComponentType<{ items: T[] }>;
  SkeletonComponent: React.ComponentType;
  defaultLimit?: number;
}

export function NewsPaginatedList<T>({
  useQuery,
  ListComponent,
  SkeletonComponent,
  defaultLimit = 10,
}: NewsPaginatedListProps<T>) {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const page = Number(search.page) || 1;
  const limit = Number(search.limit) || defaultLimit;
  const offset = (page - 1) * limit;

  const { data, isLoading, isError, error } = useQuery({ limit, offset });

  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    navigate({
      search: { ...search, page: newPage, limit },
    });
  };

  if (isLoading) return <SkeletonComponent />;
  if (isError) return <div className="py-8 text-destructive text-center">에러 발생: {error ? error.message : ''}</div>;
  if (!data) return <div className="py-8 text-muted-foreground text-center">데이터가 없습니다.</div>;

  return (
    <div className="flex flex-col gap-4 mx-auto w-full max-w-3xl">
      <ListComponent items={data.results} />
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          variant="outline"
          className="cursor-pointer"
        >
          이전
        </Button>
        <span className="text-muted-foreground text-sm">
          {page} / {totalPages || 1}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          variant="outline"
          className="cursor-pointer"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
