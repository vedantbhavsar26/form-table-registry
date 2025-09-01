"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";

// Define comprehensive prop types for better type safety
export type DialogPanelProps = {
  /** Content to be displayed in the main body of the dialog */
  children?: ReactNode | ((close: () => void) => ReactNode);
  /** Description text displayed below the title */
  dialogDescription?: ReactNode;
  /** Title of the dialog */
  dialogTitle?: ReactNode;
  /** Content to be displayed in the footer of the dialog */
  footer?: ReactNode;
  /** CSS class name for the trigger element */
  triggerClassName?: string;
  /** Text or component to be used as the trigger */
  triggerText: string | ReactNode;
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
};

export function DialogPanel({
  children,
  dialogDescription,
  dialogTitle,
  footer,
  triggerClassName,
  triggerText,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  contentClassName,
  contentProps,
  showCloseButton = false,
  asChild,
}: DialogPanelProps) {
  // State management for uncontrolled usage
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  // Determine if component is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  // Handle open state changes
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };
  const child = useMemo(() => typeof children === "function" ? children(() => dialogCloseRef.current?.click()) : children, [children]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={cn("cursor-pointer", triggerClassName)}
        asChild={asChild ?? typeof triggerText !== "string"}
      >
        {triggerText}
      </DialogTrigger>
      <DialogContent
        className={cn("!max-w-4xl !max-h-[95vh] overflow-y-scroll", contentClassName)}
        {...contentProps}
      >
        <DialogClose hidden={true} ref={dialogCloseRef} />
        {showCloseButton && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <span className="h-4 w-4">×</span>
            <span className="sr-only">Close</span>
          </DialogClose>
        )}

        {(dialogTitle || dialogDescription) && (
          <DialogHeader>
            {dialogTitle && (
              <DialogTitle>
                {dialogTitle}
              </DialogTitle>
            )}
            {dialogDescription && (
              <DialogDescription>
                {dialogDescription}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {child}

        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
