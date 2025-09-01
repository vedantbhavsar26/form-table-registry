'use client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

export type ErrorStateProps = {
  title?: string;
  description?: string;
  error?: unknown;
  onRetryAction?: () => void;
  retryText?: string;
  supportHref?: string;
  className?: string;
  showDetailsToggle?: boolean;
  compact?: boolean;
};

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null;
}

function extractNestedError(obj: Record<string, unknown>): Record<string, unknown> | undefined {
  if ('error' in obj && isObject(obj.error)) return obj.error as Record<string, unknown>;
  if ('data' in obj && isObject(obj.data)) return obj.data as Record<string, unknown>;
  if (
    'response' in obj &&
    isObject(obj.response) &&
    'data' in obj.response &&
    isObject((obj.response as Record<string, unknown>).data)
  ) {
    return (obj.response as Record<string, unknown>).data as Record<string, unknown>;
  }
  return undefined;
}

export function getErrorInfo(error: unknown): {
  message: string;
  code?: string;
  details?: string;
} {
  if (!error) return { message: 'Something went wrong.' };

  if (error instanceof Error) {
    return {
      message: error.message || 'Unexpected error occurred.',
      details: error.stack && error.stack !== error.message ? error.stack : undefined,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  if (isObject(error)) {
    const nested = extractNestedError(error);
    const message =
      (typeof error.message === 'string' && error.message) ||
      (nested && typeof nested.message === 'string' && nested.message) ||
      (nested && typeof nested.error === 'string' && nested.error) ||
      (nested && typeof nested.msg === 'string' && nested.msg);

    const code =
      (typeof error.code === 'string' && error.code) ||
      (nested && typeof nested.code === 'string' && nested.code) ||
      (typeof error.status === 'string' && error.status) ||
      (nested && typeof nested.status === 'string' && nested.status);

    if (message || code) {
      return {
        message: message || 'Something went wrong.',
        code: typeof code === 'string' ? code : 'Unknown error code',
        details: JSON.stringify(error, null, 2),
      };
    }
  }

  return {
    message: 'Something went wrong.',
    details: JSON.stringify(error, null, 2),
  };
}

export default function ErrorState({
  title,
  description,
  error,
  onRetryAction,
  retryText = 'Try again',
  supportHref,
  className,
  showDetailsToggle = true,
  compact,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);

  const info = useMemo(() => getErrorInfo(error), [error]);

  const finalTitle = title ?? "We couldn't complete your request";
  const finalDescription =
    description ??
    (info.message && info.message !== 'Something went wrong.'
      ? info.message
      : 'An unexpected error occurred. Please try again in a moment.');

  return (
    <div className={cn('w-full', className)}>
      <Alert variant='destructive' className={cn(compact ? 'py-2' : 'py-4')}>
        <AlertTriangle aria-hidden className='col-start-1 text-red-500' />
        <AlertTitle className={cn(compact ? 'text-sm' : 'text-base')}>{finalTitle}</AlertTitle>
        <AlertDescription>
          <p className={cn(compact ? 'text-xs' : 'text-sm')}>{finalDescription}</p>

          <div className={cn('mt-3 flex flex-wrap items-center gap-2')}>
            {onRetryAction && (
              <Button size={compact ? 'sm' : 'sm'} variant='secondary' onClick={onRetryAction}>
                <RefreshCw className={cn(compact ? 'h-3 w-3' : 'h-4 w-4')} />
                <span className='ml-1'>{retryText}</span>
              </Button>
            )}
            {supportHref && (
              <a
                href={supportHref}
                target='_blank'
                rel='noreferrer'
                className='text-muted-foreground inline-flex items-center gap-1 text-sm hover:underline'
              >
                <Info className='h-4 w-4' />
                Get help
              </a>
            )}
            {showDetailsToggle && info.details && (
              <Button
                size={compact ? 'sm' : 'sm'}
                variant='ghost'
                onClick={() => setShowDetails((s) => !s)}
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </Button>
            )}
          </div>

          {info.code && (
            <div className='text-muted-foreground mt-2 text-xs'>Error code: {info.code}</div>
          )}

          {showDetails && info.details && (
            <pre className='bg-muted text-muted-foreground mt-2 max-h-64 w-full overflow-auto rounded p-2 text-xs'>
              {info.details}
            </pre>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
