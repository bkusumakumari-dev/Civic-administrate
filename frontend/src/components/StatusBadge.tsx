import { STATUS_KEY } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';

const TONE: Record<string, string> = {
  Submitted: 'blue',
  'Under Review': 'amber',
  Approved: 'green',
  Resolved: 'green',
  Rejected: 'red',
  'In Progress': 'teal',
};

/** Status chip with a text label plus a shape marker — color is never the only cue. */
export default function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  const key = STATUS_KEY[status] ?? status;
  const label = t(key);
  const tone = TONE[status] ?? 'neutral';
  return (
    <span className={`status-badge tone-${tone}`} title={label}>
      <span className="status-dot" aria-hidden="true" />
      {label}
    </span>
  );
}