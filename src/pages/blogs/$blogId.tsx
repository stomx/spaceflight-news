import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/blogs/$blogId')({
  component: BlogDetailPage,
});

import { useParams } from '@tanstack/react-router';

function BlogDetailPage() {
  const { blogId } = useParams({ from: '/blogs/$blogId' });

  // TODO: blogId로 API 호출 및 상세 렌더링
  return (
    <div>
      <h1>기사 상세</h1>
      <div>기사 ID: {blogId}</div>
      {/* 실제 상세 내용 렌더링 */}
    </div>
  );
}
