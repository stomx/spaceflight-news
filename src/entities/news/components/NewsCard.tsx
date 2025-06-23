import { Button } from '@/shared/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/card';
import { LazyImage } from '@/shared/components/lazy-image';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/components/badge';

export interface NewsCardProps {
  imageUrl: string;
  title: string;
  summary: string;
  date: string;
  site: string;
  url?: string;
  featured?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

export function NewsCard({
  imageUrl,
  title,
  summary,
  date,
  site,
  url,
  featured = false,
  onClick,
  children,
}: NewsCardProps) {
  const cardContent = (
    <Card
      className={`h-full flex flex-col transition-all duration-300 ease-in-out ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-primary/50' : ''
      } ${featured ? 'border-2 border-primary/80 shadow-lg' : ''}`}
      onClick={onClick}
      data-testid="news-card-component"
    >
      <CardHeader className="p-0 relative">
        <LazyImage
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
          loading="lazy"
        />
        {featured && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            특집
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-bold mb-2 line-clamp-2">{title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">{summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="text-xs text-muted-foreground">
          <span>{site}</span> | <span>{date}</span>
        </div>
        {children ?? (
          <Button asChild variant="outline" size="sm">
            <a href={url} target="_blank" rel="noopener noreferrer">
              더 보기
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
        },
      }}
      className="h-full"
    >
      {cardContent}
    </motion.div>
  );
}
