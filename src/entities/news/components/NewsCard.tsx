import { Badge } from '@/shared/components/badge';
import { Card } from '@/shared/components/card';
import { LazyImage } from '@/shared/components/lazy-image';
import { memo } from 'react';

interface NewsCardProps {
  imageUrl: string;
  title: string;
  summary: string;
  date: string;
  site: string;
  featured?: boolean;
  children?: React.ReactNode;
}

export const NewsCard = memo(function NewsCard({
  imageUrl,
  title,
  summary,
  date,
  site,
  featured,
}: NewsCardProps) {
  return (
    <Card className="w-full">
      <div className="flex md:flex-row flex-col gap-4">
        <figure className="rounded-md w-1/2 aspect-video">
          <LazyImage src={imageUrl} alt={title} className="rounded-md w-full h-full object-cover" />
        </figure>
        <div className="flex flex-col flex-1 gap-2 py-0 md:py-6 px-4 md:px-0">
          <div className="flex items-center gap-2">
            <h2 className="flex-1 font-bold text-lg line-clamp-2">{title}</h2>
            {featured && <Badge variant="destructive">특집</Badge>}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-4">{summary}</p>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span>{date}</span>
            <span>·</span>
            <span>{site}</span>
          </div>
        </div>
      </div>
    </Card>
  );
});
