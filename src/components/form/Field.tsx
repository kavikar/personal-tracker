import { useId, type ReactNode } from 'react';

export interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  /** Render the control; receives the id to attach and the id of the message to describe it by. */
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
}

/** Label, control, optional hint, and error message wired together for assistive tech. */
export function Field({ label, error, hint, children, className = '' }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children({ id, describedBy: message ? messageId : undefined, invalid: Boolean(error) })}
      {message && (
        <p
          id={messageId}
          className={`text-xs ${error ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
