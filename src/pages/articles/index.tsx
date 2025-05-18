import { createFileRoute } from '@tanstack/react-router';
import { ArticleListFeature } from '@/features/article-list';

export const Route = createFileRoute('/articles/')({
  component: ArticleListFeature,
});
