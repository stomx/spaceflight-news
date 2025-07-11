import { ArticleListFeature } from '@/features/article-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/articles/')({
  component: ArticleListFeature,
});
