import { Button } from '@/shared/components/button';
import { memo } from 'react';

interface NewsListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyText?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

function NewsListComponent<T>({
  items,
  renderItem,
  emptyText = '표시할 항목이 없습니다.',
  page,
  totalPages,
  onPageChange,
}: NewsListProps<T>) {
  if (!items.length) {
    return <div className="py-8 text-muted-foreground text-center">{emptyText}</div>;
  }

  return (
    <div>
      <section className="flex flex-col gap-4 mx-auto w-full max-w-3xl">
        {items.map(renderItem)}
      </section>
      {page && totalPages && onPageChange && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button onClick={() => onPageChange(page - 1)} disabled={page === 1} variant="outline">
            이전
          </Button>
          <span className="text-muted-foreground text-sm">
            {page} / {totalPages || 1}
          </span>
          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            variant="outline"
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}

// 제네릭 컴포넌트의 메모화를 위한 타입 캐스팅
export const NewsList = memo(NewsListComponent) as typeof NewsListComponent;
