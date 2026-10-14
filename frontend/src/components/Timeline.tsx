import { useLanguage } from '../i18n/LanguageContext';
import type { HistoryItem } from '../services/api';
import { formatDate } from '../utils/format';
import StatusBadge from './StatusBadge';

/** Vertical timeline showing every recorded status change with its timestamp. */
export default function Timeline({ items }: { items: HistoryItem[] }) {
  const { t } = useLanguage();
  if (items.length === 0) {
    return <p className="muted">{t('apps.historyEmpty')}</p>;
  }
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={item.id} className="timeline-item">
          <div className="timeline-content">
            <div className="timeline-title">
              <StatusBadge status={item.status} />
              <time className="timeline-time">{formatDate(item.changedAt)}</time>
            </div>
            {item.note ? <p className="timeline-note">{item.note}</p> : null}
            {item.changedBy ? (
              <p className="timeline-by muted">
                {t('admin.changedBy')}: {item.changedBy}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}