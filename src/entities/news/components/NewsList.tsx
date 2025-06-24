import { Button } from '@/shared/components/button';
import type { ReactNode } from 'react';

export interface NewsListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyText: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function NewsList<T>({
  items,
  renderItem,
  emptyText,
  page,
  totalPages,
  onPageChange,
}: NewsListProps<T>) {
  const total = totalPages ?? 1;
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground" data-testid="empty-list">
        {emptyText}
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="px-4 md:px-0">
      <section className="flex flex-col gap-3 md:gap-4 mx-auto w-full max-w-3xl">
        {items.map(renderItem)}
      </section>
      {page && totalPages && onPageChange && (
        <div className="flex justify-center items-center gap-3 mt-8 px-4">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            variant="outline"
            size="sm"
            className="min-w-[60px]"
          >
            이전
          </Button>
          <span className="text-muted-foreground text-sm font-medium px-2">
            {page} / {total}
          </span>
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            variant="outline"
            size="sm"
            className="min-w-[60px]"
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
