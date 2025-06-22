import { BlogDetailFeature } from '@/features/blog-detail';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/blogs/$blogId')({
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { blogId } = useParams({ from: '/blogs/$blogId' });

  return <BlogDetailFeature blogId={blogId} />;
}
