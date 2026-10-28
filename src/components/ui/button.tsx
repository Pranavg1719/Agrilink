import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-4 py-2 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-emerald-600 text-white shadow hover:bg-emerald-700',
        destructive: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700',
        outline: 'border border-slate-300 bg-white shadow-sm hover:bg-slate-50 text-slate-800',
        secondary: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200',
        ghost: 'hover:bg-slate-100 hover:text-slate-900',
        link: 'text-emerald-700 underline-offset-4 hover:underline min-h-0 p-0',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-8 text-base font-semibold',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
