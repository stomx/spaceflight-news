import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/articles/$articleId')({
  component: ArticleDetailPage,
});

import { useParams } from '@tanstack/react-router';

function ArticleDetailPage() {
  const { articleId } = useParams({ from: '/articles/$articleId' });

  // TODO: articleId로 API 호출 및 상세 렌더링
  return (
    <div>
      <h1>기사 상세</h1>
      <div>기사 ID: {articleId}</div>
      {/* 실제 상세 내용 렌더링 */}
    </div>
  );
}
