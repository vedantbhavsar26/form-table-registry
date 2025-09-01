import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import React from 'react';

// Define comprehensive prop types for better type safety
export type DialogPanelProps = {
  /** Content to be displayed in the main body of the dialog */
  children?: ReactNode;
  /** Description text displayed below the title */
  cardDescription?: ReactNode;
  /** Title of the dialog */
  cardTitle?: ReactNode;
  /** Content to be displayed in the footer of the dialog */
  footer?: ReactNode;
  /** CSS class name for the trigger element */
  titleClassName?: string;
  /** Text or component to be used as the trigger */
  /** Initial open state of the dialog */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom CSS for the dialog content */
  contentClassName?: string;
  /** Optional props for the dialog content */
  contentProps?: React.ComponentPropsWithoutRef<typeof DialogContent>;
  /** Whether to render the dialog with a close button */
  showCloseButton?: boolean;
  /** Whether the trigger should be rendered as a child */
  asChild?: boolean;
  cardClassName?: string;
};

export function CardPanel({
  children,
  cardDescription,
  cardTitle,
  titleClassName,
  footer,
  contentClassName,
  contentProps,
  cardClassName,
}: DialogPanelProps) {
  return (
    <Card className={cn(cardClassName, 'flex flex-col justify-between')}>
      <CardHeader>
        <CardTitle className={titleClassName}> {cardTitle}</CardTitle>
        <CardDescription> {cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className={cn(contentClassName)} {...contentProps}>
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
