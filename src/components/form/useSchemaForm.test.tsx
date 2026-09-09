import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { useSchemaForm } from './useSchemaForm';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  minutes: z.coerce.number().int().min(1, 'Must be at least 1'),
});

describe('useSchemaForm', () => {
  it('reports the first error per field and does not call onValid', () => {
    const { result } = renderHook(() => useSchemaForm(schema, { title: '', minutes: '' }));
    const onValid = vi.fn();
    act(() => result.current.submit(onValid)());
    expect(onValid).not.toHaveBeenCalled();
    expect(result.current.errors.title).toBe('Title is required');
    expect(result.current.errors.minutes).toBeDefined();
  });

  it('clears a field error when the field changes and submits coerced data', () => {
    const { result } = renderHook(() => useSchemaForm(schema, { title: '', minutes: '' }));
    const onValid = vi.fn();
    act(() => result.current.submit(onValid)());
    act(() => result.current.setValue('title', 'Two Sum'));
    expect(result.current.errors.title).toBeUndefined();
    act(() => result.current.setValue('minutes', '25'));
    act(() => result.current.submit(onValid)());
    expect(onValid).toHaveBeenCalledWith({ title: 'Two Sum', minutes: 25 });
    expect(result.current.errors).toEqual({});
  });
});
