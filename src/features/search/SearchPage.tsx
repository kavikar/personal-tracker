import { useState } from 'react';
import { describeEntry } from '../../categories/describe';
import { categories, getCategory } from '../../categories/registry';
import { useCategoryContext } from '../../categories/useCategoryContext';
import type { AnyCategoryDefinition } from '../../categories/types';
import { Button } from '../../components/Button';
import { CategoryDot } from '../../components/CategoryDot';
import { Field, TextInput } from '../../components/form';
import { useAllEntries } from '../../db/hooks';
import type { Entry } from '../../db/types';
import { EntryEditor } from '../entries/EntryEditor';
import { EntryRow } from '../entries/EntryRow';
import { filterEntries, isEmptyFilters } from './filterEntries';
import { useSearchFilters } from './useSearchFilters';

const MAX_RESULTS = 200;

export function SearchPage() {
  const [filters, update, clear] = useSearchFilters();
  const context = useCategoryContext();
  const all = useAllEntries();
  const [editing, setEditing] = useState<{
    definition: AnyCategoryDefinition;
    entry: Entry;
  } | null>(null);

  const results = all ? filterEntries(all, filters, (entry) => describeEntry(entry, context)) : [];
  const shown = results.slice(0, MAX_RESULTS);

  const toggleCategory = (key: AnyCategoryDefinition['key']) =>
    update({
      categories: filters.categories.includes(key)
        ? filters.categories.filter((k) => k !== key)
        : [...filters.categories, key],
    });

  const openEdit = (entry: Entry) => {
    const definition = getCategory(entry.category);
    if (definition) setEditing({ definition, entry });
  };

  return (
    <section aria-label="Search" className="space-y-4">
      <h1 className="text-2xl font-semibold">Search</h1>

      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-xs"
      >
        <Field label="Text">
          {(ids) => (
            <TextInput
              {...ids}
              type="search"
              placeholder="Company, problem, task, habit…"
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
            />
          )}
        </Field>
        <fieldset>
          <legend className="text-sm font-medium text-slate-700">Categories</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {categories.map((definition) => {
              const active = filters.categories.includes(definition.key);
              return (
                <button
                  key={definition.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleCategory(definition.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
                    active
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CategoryDot category={definition.key} />
                  {definition.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="From">
            {(ids) => (
              <TextInput
                {...ids}
                type="date"
                value={filters.from ?? ''}
                onChange={(e) => update({ from: e.target.value })}
              />
            )}
          </Field>
          <Field label="To">
            {(ids) => (
              <TextInput
                {...ids}
                type="date"
                value={filters.to ?? ''}
                onChange={(e) => update({ to: e.target.value })}
              />
            )}
          </Field>
          <Button onClick={clear} disabled={isEmptyFilters(filters)}>
            Clear
          </Button>
        </div>
      </form>

      <p role="status" className="text-sm text-slate-600">
        {all === undefined
          ? 'Loading…'
          : `${results.length} ${results.length === 1 ? 'entry' : 'entries'}${
              results.length > MAX_RESULTS ? `, showing the first ${MAX_RESULTS}` : ''
            }`}
      </p>

      {shown.length > 0 && (
        <ul className="space-y-2">
          {shown.map((entry) => (
            <EntryRow key={entry.id} entry={entry} context={context} onEdit={openEdit} showDate />
          ))}
        </ul>
      )}

      {editing && (
        <EntryEditor
          definition={editing.definition}
          date={editing.entry.date}
          entry={editing.entry}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}
