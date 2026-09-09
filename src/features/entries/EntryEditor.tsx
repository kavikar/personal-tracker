import { useState } from 'react';
import type { AnyCategoryDefinition } from '../../categories/types';
import { Modal } from '../../components/Modal';
import type { DateKey, Entry } from '../../db/types';
import { formatLong } from '../../lib/dates';
import { saveEntry, ValidationError } from './saveEntry';

interface EntryEditorProps {
  definition: AnyCategoryDefinition;
  date: DateKey;
  /** When present the editor updates this entry instead of creating one. */
  entry?: Entry;
  onClose: () => void;
}

/** Hosts a category's form inside a modal and persists the result. */
export function EntryEditor({ definition, date, entry, onClose }: EntryEditorProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const Form = definition.Form;

  const handleSubmit = async (data: unknown) => {
    try {
      await saveEntry(definition, date, data, entry?.id);
      onClose();
    } catch (error) {
      if (error instanceof ValidationError) setErrors(error.errors);
      else setErrors([error instanceof Error ? error.message : 'Could not save the entry']);
    }
  };

  return (
    <Modal
      title={`${entry ? 'Edit' : 'Add'} ${definition.label} · ${formatLong(date)}`}
      onClose={onClose}
    >
      {errors.length > 0 && (
        <ul
          role="alert"
          className="mb-3 list-disc rounded-md bg-red-50 py-2 pr-3 pl-6 text-sm text-red-700"
        >
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
      <Form date={date} initial={entry?.data} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
