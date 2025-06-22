import { ReportListFeature } from '@/features/report-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/reports/')({
  component: () => <ReportListFeature />,
});
