import { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { RouteName } from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import Timeline from '../../components/Timeline';
import { ErrorBox, Loading, PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { Grievance, HistoryItem } from '../../services/api';
import { formatDate, localizedOption } from '../../utils/format';

interface Props {
  trackingId: string;
  onNavigate: (route: RouteName, param?: string) => void;
}

export default function GrievanceDetailPage({ trackingId, onNavigate }: Props) {
  const { t } = useLanguage();
  const [item, setItem] = useState<Grievance | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getGrievance(trackingId)
      .then((found) => {
        if (cancelled) return;
        setItem(found);
        return api.getGrievanceHistory(trackingId).then((h) => {
          if (!cancelled) setHistory(h);
        });
      })
      .catch((err) => {
        if (cancelled) return;
        if (isNetworkError(err)) {
          setError(t('common.backendDown'));
        } else if (err instanceof Error && err.message === 'Grievance not found') {
          setNotFound(true);
        } else {
          setError(t('common.error'));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [trackingId, t]);

  const isOverdue =
    item && item.dueAt && item.status !== 'Resolved' && item.status !== 'Rejected'
      ? new Date(item.dueAt).getTime() < Date.now()
      : false;

  return (
    <div className="page">
      <button type="button" className="btn btn-outline back-btn" onClick={() => onNavigate('grievances')}>
        ← {t('common.back')}
      </button>
      <PageTitle title={t('grv.detailTitle')} />

      {notFound ? (
        <div className="alert alert-warn" role="alert">
          {t('apps.notFound')}
        </div>
      ) : error ? (
        <ErrorBox message={error} />
      ) : !item ? (
        <Loading />
      ) : (
        <div className="two-col">
          <section className="card">
            <h2>{t('grv.detailTitle')}</h2>
            {isOverdue ? (
              <div className="alert alert-warn">
                ⚠️ {t('grv.overdue')}
              </div>
            ) : null}
            <dl className="detail-list">
              <div>
                <dt>{t('common.trackingId')}</dt>
                <dd><strong className="tracking-id">{item.trackingId}</strong></dd>
              </div>
              <div>
                <dt>{t('grv.category')}</dt>
                <dd>{localizedOption(`grv.category.${item.category}`, item.category, t)}</dd>
              </div>
              <div>
                <dt>{t('grv.subject')}</dt>
                <dd>{item.subject}</dd>
              </div>
              <div>
                <dt>{t('grv.description')}</dt>
                <dd>{item.description}</dd>
              </div>
              <div>
                <dt>{t('grv.relatedApp')}</dt>
                <dd>
                  {item.relatedTrackingId ? (
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => onNavigate('app-detail', item.relatedTrackingId!)}
                    >
                      {item.relatedTrackingId}
                    </button>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt>{t('common.status')}</dt>
                <dd><StatusBadge status={item.status} /></dd>
              </div>
              <div>
                <dt>{t('grv.dueOn')}</dt>
                <dd>
                  {formatDate(item.dueAt)}{' '}
                  {isOverdue ? <span className="overdue-chip">{t('grv.overdue')}</span> : null}
                </dd>
              </div>
              <div>
                <dt>{t('grv.resolution')}</dt>
                <dd>{item.resolutionNote ?? '—'}</dd>
              </div>
            </dl>

            <div className="next-step">
              <h3>{t('common.notes')}</h3>
              <p className="muted">{t(`grv.nextStep.${item.status}`)}</p>
            </div>
          </section>

          <section className="card">
            <h2>{t('apps.timeline')}</h2>
            <Timeline items={history} />
          </section>
        </div>
      )}
    </div>
  );
}