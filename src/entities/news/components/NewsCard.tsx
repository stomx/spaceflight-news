import { Badge } from '@/shared/components/badge';
import { Card } from '@/shared/components/card';
import { LazyImage } from '@/shared/components/lazy-image';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface NewsCardProps {
  imageUrl: string;
  title: string;
  summary: string;
  date: string;
  site: string;
  featured?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const NewsCard = memo(function NewsCard({
  imageUrl,
  title,
  summary,
  date,
  site,
  featured,
  children,
  onClick,
}: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`w-full hover:shadow-md transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="flex md:flex-row flex-col gap-3 md:gap-4">
          <figure className="rounded-md w-full md:w-1/2 h-48 md:h-auto aspect-none md:aspect-video flex-shrink-0">
            <LazyImage src={imageUrl} alt={title} className="rounded-md w-full h-full object-cover" />
          </figure>
          <div className="flex flex-col flex-1 gap-2 py-3 md:py-6 px-4 md:px-0 min-h-0">
            <div className="flex items-start gap-2">
              <h2 className="flex-1 font-bold text-base md:text-lg line-clamp-2 leading-tight min-h-[2.5rem]">
                {title}
              </h2>
              {featured && (
                <Badge variant="destructive" className="shrink-0 text-xs">
                  특집
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm line-clamp-3 md:line-clamp-4 leading-relaxed flex-1 min-h-[4.5rem] md:min-h-[6rem]">
              {summary}
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-xs mt-auto">
              <span className="truncate">{date}</span>
              <span className="shrink-0">·</span>
              <span className="truncate">{site}</span>
            </div>
            {children && <div className="mt-3">{children}</div>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
