/**
 * 홈 페이지 컴포넌트 - 최신 우주 뉴스 기사 목록을 표시합니다.
 */
import { ArticleListFeature } from '@/features/article-list';

function HomePage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <ArticleListFeature />
    </div>
  );
}

export default HomePage;
