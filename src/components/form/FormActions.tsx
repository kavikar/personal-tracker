import { Button } from '../Button';

interface FormActionsProps {
  submitLabel?: string;
  onCancel: () => void;
}

export function FormActions({ submitLabel = 'Save', onCancel }: FormActionsProps) {
  return (
    <div className="mt-2 flex justify-end gap-2">
      <Button variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="primary" type="submit">
        {submitLabel}
      </Button>
    </div>
  );
}
