import type { Blog } from '@/entities/blog/api/types';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { BlogItem } from './BlogItem';

interface BlogListProps {
  blogs: Blog[];
}

export function BlogList({ blogs }: BlogListProps) {
  if (blogs.length === 0) {
    return <div className="py-8 text-muted-foreground text-center">표시할 기사가 없습니다.</div>;
  }
  return (
    <section className="flex flex-col gap-4">
      {blogs.map((blog) => (
        <BlogItem key={blog.id} blog={blog} />
      ))}
    </section>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="rounded-md w-full h-32" />
      ))}
    </div>
  );
}
