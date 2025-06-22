import { NewsDetail } from '@/entities/news/components/NewsDetail';
import { useArticleQuery } from '@/shared/hooks/useNewsQuery';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface ArticleDetailFeatureProps {
  articleId: string;
}

export function ArticleDetailFeature({ articleId }: ArticleDetailFeatureProps) {
  const { data: article, isLoading, isError, error } = useArticleQuery(articleId);

  const handleBackClick = () => {
    // 에러 상태에서만 사용되는 함수
    window.history.back();
  };

  const handleExternalLinkClick = (url: string) => {
    // 외부 링크 클릭 시 새 탭에서 열기
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">기사를 불러오는 중...</p>
        </div>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          😵
        </motion.div>
        <h2 className="text-xl font-semibold mb-2">기사를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error?.message || '요청하신 기사가 존재하지 않거나 일시적인 오류가 발생했습니다.'}
        </p>
        <motion.button
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4" />
          기사 목록으로 돌아가기
        </motion.button>
      </motion.div>
    );
  }

  if (!article) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-muted-foreground">기사 정보가 없습니다.</div>
        <motion.button
          onClick={handleBackClick}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4" />
          기사 목록으로 돌아가기
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 기사 상세 */}
      <NewsDetail news={article} onExternalLinkClick={handleExternalLinkClick} />
    </div>
  );
}
