import { Card } from '@/shared/components/card';
import { Skeleton } from '@/shared/components/skeleton';
import { motion } from 'framer-motion';
import { memo } from 'react';

export const NewsCardSkeleton = memo(function NewsCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
    >
      <Card className="w-full">
      <div className="flex md:flex-row flex-col gap-3 md:gap-4">
        {/* 이미지 스켈레톤 */}
        <div className="rounded-md w-full md:w-1/2 h-48 md:h-auto aspect-none md:aspect-video flex-shrink-0">
          <Skeleton className="w-full h-full rounded-md" />
        </div>

        {/* 컨텐츠 스켈레톤 */}
        <div className="flex flex-col flex-1 gap-2 py-3 md:py-6 px-4 md:px-0 min-h-0">
          {/* 제목 스켈레톤 */}
          <div className="flex items-start gap-2">
            <div className="flex-1 min-h-[2.5rem] space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            {/* 특집 배지 스켈레톤 (가끔 표시) */}
            {Math.random() > 0.7 && (
              <Skeleton className="h-5 w-8 rounded-full" />
            )}
          </div>

          {/* 요약 텍스트 스켈레톤 */}
          <div className="flex-1 min-h-[4.5rem] md:min-h-[6rem] space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <div className="hidden md:block space-y-2">
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>

          {/* 메타 정보 스켈레톤 */}
          <div className="flex items-center gap-2 mt-auto">
            <Skeleton className="h-3 w-16" />
            <span className="text-gray-300">·</span>
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </Card>
    </motion.div>
  );
});

export const NewsListSkeleton = memo(function NewsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="px-4 md:px-0">
      <section className="flex flex-col gap-3 md:gap-4 mx-auto w-full max-w-3xl">
        {Array.from({ length: count }, (_, index) => (
          <NewsCardSkeleton key={index} delay={index} />
        ))}
      </section>
    </div>
  );
});
