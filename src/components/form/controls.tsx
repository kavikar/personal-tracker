import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

const base =
  'w-full rounded-md border bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-xs focus:ring-2 focus:ring-slate-400 focus:outline-none disabled:bg-slate-100';

function borderFor(invalid?: boolean) {
  return invalid ? 'border-red-400' : 'border-slate-300';
}

interface ControlState {
  invalid?: boolean;
  describedBy?: string;
}

export function TextInput({
  invalid,
  describedBy,
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & ControlState) {
  return (
    <input
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={`${base} ${borderFor(invalid)} ${className}`}
      {...rest}
    />
  );
}

export function Select({
  invalid,
  describedBy,
  className = '',
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & ControlState) {
  return (
    <select
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={`${base} ${borderFor(invalid)} ${className}`}
      {...rest}
    />
  );
}

export function Textarea({
  invalid,
  describedBy,
  className = '',
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & ControlState) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={`${base} ${borderFor(invalid)} min-h-20 ${className}`}
      {...rest}
    />
  );
}

export function Checkbox({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={`size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400 ${className}`}
      {...rest}
    />
  );
}
