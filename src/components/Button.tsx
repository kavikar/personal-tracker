import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const variants: Record<Variant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-400 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-400',
  secondary:
    'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:disabled:text-slate-600',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-400 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:disabled:text-slate-600',
  danger:
    'text-red-700 hover:bg-red-50 disabled:text-red-300 dark:text-red-400 dark:hover:bg-red-950/40 dark:disabled:text-red-900',
};

const sizes: Record<Size, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1 rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none disabled:cursor-not-allowed dark:focus-visible:ring-slate-600 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}
