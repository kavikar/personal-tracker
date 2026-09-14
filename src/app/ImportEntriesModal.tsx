import { useState } from 'react';
import { z } from 'zod';
import { CATEGORY_KEYS } from '../categories/keys';
import { parseEntryData, requireCategory } from '../categories/registry';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { repository } from '../db/repository';
import { isValidDateKey } from '../lib/dates';
import type { NewEntry } from '../db/types';

/**
 * Generic bulk import: pastes a JSON array of {date, category, data} and
 * validates each entry against its own category's schema before inserting
 * -- the same validation every other entry point (the quick-entry forms)
 * goes through, just skipping the form UI. Useful for backfilling real
 * history (e.g. from an email search) without hand-typing dozens of
 * entries one at a time.
 */
const importRowSchema = z.object({
  date: z.string().refine(isValidDateKey, { message: 'Use a valid date' }),
  category: z.enum(CATEGORY_KEYS),
  data: z.unknown(),
});

interface ImportEntriesModalProps {
  onClose: () => void;
  onImported: () => void;
}

export function ImportEntriesModal({ onClose, onImported }: ImportEntriesModalProps) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const runImport = async () => {
    setBusy(true);
    setErrors([]);
    setResult(null);
    try {
      const rows = JSON.parse(text);
      if (!Array.isArray(rows)) throw new Error('Expected a JSON array of entries');

      const problems: string[] = [];
      const entries: NewEntry[] = [];

      rows.forEach((row, i) => {
        const rowResult = importRowSchema.safeParse(row);
        if (!rowResult.success) {
          problems.push(`Row ${i + 1}: ${rowResult.error.issues[0]?.message ?? 'invalid row'}`);
          return;
        }
        const def = requireCategory(rowResult.data.category);
        const dataResult = parseEntryData(def, rowResult.data.data);
        if (!dataResult.ok) {
          problems.push(`Row ${i + 1} (${rowResult.data.category}): ${dataResult.errors.join(', ')}`);
          return;
        }
        entries.push({ date: rowResult.data.date, category: rowResult.data.category, data: dataResult.data });
      });

      if (problems.length > 0) {
        setErrors(problems);
        return;
      }

      await repository.addEntries(entries);
      setResult(`Imported ${entries.length} entries.`);
      setText('');
      onImported();
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Could not parse JSON']);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Import entries" onClose={onClose}>
      <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
        Paste a JSON array of <code>{'{ date, category, data }'}</code> entries. Each one is
        validated against its category&apos;s own schema before anything is saved -- all or
        nothing.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="[ { &quot;date&quot;: &quot;2026-09-14&quot;, &quot;category&quot;: &quot;jobSearch&quot;, &quot;data&quot;: { ... } } ]"
        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 shadow-xs focus:ring-2 focus:ring-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      {errors.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-red-600 dark:text-red-400">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
      {result && <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">{result}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={runImport} disabled={busy || text.trim() === ''}>
          {busy ? 'Importing…' : 'Import'}
        </Button>
      </div>
    </Modal>
  );
}
