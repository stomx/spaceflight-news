import { ReportDetailFeature } from '@/features/report-detail';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/reports/$reportId')({
  component: ReportDetailPage,
});

function ReportDetailPage() {
  const { reportId } = useParams({ from: '/reports/$reportId' });

  return <ReportDetailFeature reportId={reportId} />;
}
