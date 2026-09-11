import { useState } from 'react';
import { Button } from '../components/Button';
import { useAllEntries } from '../db/hooks';
import { repository } from '../db/repository';
import { loadSampleData } from '../dev/sampleData';
import { todayKey } from '../lib/dates';

/** Footer actions for the local database: seed a demo, or wipe everything. */
export function DataControls() {
  const entries = useAllEntries();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const isEmpty = entries !== undefined && entries.length === 0;

  const seed = async () => {
    setBusy(true);
    try {
      await loadSampleData(repository, todayKey());
    } finally {
      setBusy(false);
    }
  };

  const clear = async () => {
    setBusy(true);
    try {
      await repository.clearAll();
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-slate-500">
        <p>
          Data is stored in this browser only (IndexedDB). Nothing leaves your device.{' '}
          <span className="text-slate-400">· v{__APP_VERSION__}</span>
        </p>
        <div className="flex items-center gap-2">
          {isEmpty && (
            <Button size="sm" onClick={seed} disabled={busy}>
              Load sample data
            </Button>
          )}
          {!isEmpty && !confirming && (
            <Button size="sm" variant="danger" onClick={() => setConfirming(true)} disabled={busy}>
              Clear all data
            </Button>
          )}
          {confirming && (
            <>
              <span className="text-red-700">Delete every entry and habit?</span>
              <Button
                size="sm"
                variant="danger"
                onClick={clear}
                disabled={busy}
                aria-label="Confirm clear all data"
              >
                Yes, clear
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                Keep
              </Button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
