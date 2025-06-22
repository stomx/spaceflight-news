import { NewsDetail } from '@/entities/news/components/NewsDetail';
import { useReportQuery } from '@/shared/hooks/useNewsQuery';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface ReportDetailFeatureProps {
  reportId: string;
}

export function ReportDetailFeature({ reportId }: ReportDetailFeatureProps) {
  // 디버깅을 위한 로깅
  console.log('ReportDetailFeature - reportId:', reportId);

  const { data: report, isLoading, isError, error } = useReportQuery(reportId);

  // 디버깅을 위한 로깅
  console.log('ReportDetailFeature - data:', report, 'isLoading:', isLoading, 'isError:', isError, 'error:', error);

  const handleBackClick = () => {
    // 에러 상태에서만 사용되는 함수
    window.history.back();
  };

  const handleExternalLinkClick = (url: string) => {
    // 외부 링크 클릭 시 새 탭에서 열기
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 임시 테스트: reportId가 "test"일 때 더미 데이터 표시
  if (reportId === "test") {
    const dummyReport = {
      id: 9999,
      title: "Test Report",
      authors: [],
      url: "https://example.com",
      image_url: "https://via.placeholder.com/400x200",
      news_site: "Test Site",
      summary: "This is a test report to verify the component works correctly.",
      published_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      featured: false,
      launches: [],
      events: [],
      type: 'report' as const
    };

    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          ⚠️ 테스트 모드: 더미 데이터가 표시되고 있습니다.
        </div>
        <NewsDetail news={dummyReport} onExternalLinkClick={handleExternalLinkClick} />
      </div>
    );
  }

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
          <p className="text-muted-foreground">보고서를 불러오는 중...</p>
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
        <h2 className="text-xl font-semibold mb-2">보고서를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error?.message || '요청하신 보고서가 존재하지 않거나 일시적인 오류가 발생했습니다.'}
        </p>
        <details className="mb-4 text-left text-sm">
          <summary className="cursor-pointer">에러 상세 정보</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            reportId: {reportId}
            {'\n'}error: {JSON.stringify(error, null, 2)}
          </pre>
        </details>
        <motion.button
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4" />
          보고서 목록으로 돌아가기
        </motion.button>
      </motion.div>
    );
  }

  if (!report) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-muted-foreground">보고서 정보가 없습니다.</div>
        <motion.button
          onClick={handleBackClick}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4" />
          보고서 목록으로 돌아가기
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <NewsDetail
        news={{
          ...report,
          featured: false, // Reports에는 featured 필드가 없으므로 기본값 제공
          launches: [], // Reports에는 launches 필드가 없으므로 빈 배열 제공
          events: [] // Reports에는 events 필드가 없으므로 빈 배열 제공
        }}
        onExternalLinkClick={handleExternalLinkClick}
      />
    </div>
  );
}
