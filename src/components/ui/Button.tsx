import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-md font-medium transition-all-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
          {
            'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105':
              variant === 'default',
            'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 hover:border-slate-400 dark:border-slate-700 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-900/50 dark:hover:border-slate-600':
              variant === 'outline',
            'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70': variant === 'ghost',
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8 text-lg': size === 'lg'
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

