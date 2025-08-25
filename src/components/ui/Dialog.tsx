'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

export function Dialog({ children, open, onOpenChange }: { children: ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = DialogPrimitive.Content;
export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="p-4 border-b">{children}</div>;
}
export const DialogTitle = DialogPrimitive.Title;
