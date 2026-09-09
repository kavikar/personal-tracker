import { useState } from 'react';
import { z } from 'zod';
import type { CategoryDefinition, FormProps } from '../categories/types';

/** A minimal category used by component tests instead of the real registry. */
export interface NoteData {
  text: string;
}

export function NoteForm({ initial, onSubmit, onCancel }: FormProps<NoteData>) {
  const [text, setText] = useState(initial?.text ?? '');
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit({ text });
      }}
    >
      <label>
        Text
        <input value={text} onChange={(event) => setText(event.target.value)} />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export const noteCategory: CategoryDefinition<NoteData> = {
  key: 'dsa',
  label: 'Note',
  description: 'Test category',
  color: { dot: 'bg-slate-400', badge: 'bg-slate-100', accent: 'border-slate-400' },
  schema: z.object({ text: z.string().min(1, 'Text is required') }),
  describe: (data) => data.text,
  summarize: () => [],
  Form: NoteForm,
};
