import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps & React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      data-slot="skeleton"
      className={cn('bg-accent rounded-md', className)}
      animate={{
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      }}
      {...props}
    />
  );
}

export { Skeleton };
