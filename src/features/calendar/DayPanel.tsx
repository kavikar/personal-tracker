import { useEffect, useRef, useState } from 'react';
import { categories, getCategory } from '../../categories/registry';
import type { AnyCategoryDefinition, CategoryContext } from '../../categories/types';
import { Button } from '../../components/Button';
import { CategoryDot } from '../../components/CategoryDot';
import type { DateKey, Entry } from '../../db/types';
import { formatLong } from '../../lib/dates';
import { EntryEditor } from '../entries/EntryEditor';
import { EntryRow } from '../entries/EntryRow';
import { HabitCheckIn } from './HabitCheckIn';

interface DayPanelProps {
  date: DateKey;
  entries: readonly Entry[];
  context: CategoryContext;
  onClose: () => void;
}

interface EditorState {
  definition: AnyCategoryDefinition;
  entry?: Entry;
}

export function DayPanel({ date, entries, context, onClose }: DayPanelProps) {
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const listed = entries.filter((entry) => entry.category !== 'habit');

  const openEdit = (entry: Entry) => {
    const definition = getCategory(entry.category);
    if (definition) setEditor({ definition, entry });
  };

  useEffect(() => {
    if (!pickerOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPickerOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [pickerOpen]);

  return (
    <aside
      aria-label={`Entries for ${formatLong(date)}`}
      className="rounded-lg border border-slate-200 bg-slate-100/60 p-4 dark:border-slate-800 dark:bg-slate-900/60"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold">{formatLong(date)}</h2>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close day panel">
          <span aria-hidden="true">✕</span>
        </Button>
      </div>

      <div ref={pickerRef} className="relative mt-3 inline-block">
        <Button
          size="sm"
          onClick={() => setPickerOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={pickerOpen}
        >
          <span aria-hidden="true">+</span> Add entry
        </Button>
        {pickerOpen && (
          <div
            role="menu"
            className="absolute z-10 mt-1 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            {categories.map((definition) => (
              <button
                key={definition.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  setEditor({ definition });
                  setPickerOpen(false);
                }}
                aria-label={`Add ${definition.label}`}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <CategoryDot category={definition.key} />
                {definition.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <HabitCheckIn date={date} habits={context.habits} entries={entries} />
      </div>

      {listed.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Nothing logged yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {listed.map((entry) => (
            <EntryRow key={entry.id} entry={entry} context={context} onEdit={openEdit} />
          ))}
        </ul>
      )}

      {editor && (
        <EntryEditor
          definition={editor.definition}
          date={date}
          entry={editor.entry}
          onClose={() => setEditor(null)}
        />
      )}
    </aside>
  );
}
