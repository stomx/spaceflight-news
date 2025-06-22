import { ArticleDetailFeature } from '@/features/article-detail';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/articles/$articleId')({
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const { articleId } = useParams({ from: '/articles/$articleId' });

  return <ArticleDetailFeature articleId={articleId} />;
}
