import type { Article } from '@/shared/types/news';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { ArticleItem } from './ArticleItem';

interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return <div className="py-8 text-muted-foreground text-center">표시할 기사가 없습니다.</div>;
  }
  return (
    <section className="flex flex-col gap-4">
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </section>
  );
}

export function ArticleListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="rounded-md w-full h-32" />
      ))}
    </div>
  );
}
