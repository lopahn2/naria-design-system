import type { ComponentProps } from 'react';
import { cn } from './utils';
export function Button({className, variant: _variant, size: _size, ...props}: ComponentProps<'button'> & {variant?:string;size?:string}) {
  return <button type="button" {...props} className={cn('inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50', className)} />;
}
export function Card({className,...props}:ComponentProps<'div'>) {
  return <div {...props} className={cn('rounded-xl border border-border bg-card text-card-foreground',className)}/>;
}
