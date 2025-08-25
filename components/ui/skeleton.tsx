import { cn } from '@/lib/utils';
import React from 'react';
import type { SkeletonProps } from 'react-loading-skeleton';
import SkeletonBase from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <SkeletonBase
      baseColor='oklch(0.3741 0 0)'
      highlightColor='oklch(0.2541 0 0)'
      inline={false}
      enableAnimation={true}
      containerClassName={cn('rounded-2xl', className)}
      {...props}
    />
  );
}
