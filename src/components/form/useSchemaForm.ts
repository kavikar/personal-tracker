import { useState } from 'react';
import type { ZodType } from 'zod';

export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

/**
 * Minimal form state for a Zod schema: raw field values, a setter, and a
 * submit handler that validates and reports the first error per field.
 * Values are kept loosely typed because inputs produce strings; the schema
 * is what coerces them into the final payload.
 */
export function useSchemaForm<T extends object, V extends object = T>(
  schema: ZodType<T>,
  initialValues: V,
) {
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<V>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const setValue = <K extends keyof V>(key: K, value: V[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const submit =
    (onValid: (data: T) => void | Promise<void>) => (event?: { preventDefault(): void }) => {
      event?.preventDefault();
      const result = schema.safeParse(values);
      if (!result.success) {
        const next: FieldErrors<V> = {};
        let general: string | null = null;
        for (const issue of result.error.issues) {
          const field = issue.path[0];
          if (typeof field === 'string' && !(field in next)) {
            next[field as keyof V & string] = issue.message;
          } else if (issue.path.length === 0 && !general) {
            general = issue.message;
          }
        }
        setErrors(next);
        setFormError(general);
        return;
      }
      setErrors({});
      setFormError(null);
      void onValid(result.data);
    };

  return { values, errors, formError, setValue, submit };
}
