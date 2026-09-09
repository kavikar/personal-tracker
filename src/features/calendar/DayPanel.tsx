import { useState } from 'react';
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

  const listed = entries.filter((entry) => entry.category !== 'habit');

  const openEdit = (entry: Entry) => {
    const definition = getCategory(entry.category);
    if (definition) setEditor({ definition, entry });
  };

  return (
    <aside
      aria-label={`Entries for ${formatLong(date)}`}
      className="rounded-lg border border-slate-200 bg-slate-100/60 p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold">{formatLong(date)}</h2>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close day panel">
          <span aria-hidden="true">✕</span>
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((definition) => (
          <Button
            key={definition.key}
            size="sm"
            onClick={() => setEditor({ definition })}
            aria-label={`Add ${definition.label}`}
          >
            <CategoryDot category={definition.key} />
            {definition.label}
          </Button>
        ))}
      </div>

      <div className="mt-4">
        <HabitCheckIn date={date} habits={context.habits} entries={entries} />
      </div>

      {listed.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nothing logged yet.</p>
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
