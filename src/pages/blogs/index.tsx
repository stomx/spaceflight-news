import { BlogListFeature } from '@/features/blog-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/blogs/')({
  component: BlogListFeature,
});
