import { Button } from '../../components/Button';
import { repository } from '../../db/repository';
import { loadSampleData } from '../../dev/sampleData';
import { todayKey } from '../../lib/dates';

export function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
      <p className="font-medium text-slate-800">Nothing tracked yet.</p>
      <p className="mt-1">
        Click any day to log a job application, a solved problem, an admin task, or a habit. Or load
        six weeks of sample data to see how the dashboard looks.
      </p>
      <Button className="mt-3" onClick={() => loadSampleData(repository, todayKey())}>
        Load sample data
      </Button>
    </div>
  );
}
