import { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { RouteName } from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import Timeline from '../../components/Timeline';
import { ErrorBox, Loading, PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { Application, HistoryItem } from '../../services/api';
import { formatDate, localizedOption } from '../../utils/format';

interface Props {
  trackingId: string;
  onNavigate: (route: RouteName, param?: string) => void;
}

export default function ApplicationDetailPage({ trackingId, onNavigate }: Props) {
  const { t } = useLanguage();
  const [app, setApp] = useState<Application | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getApplication(trackingId)
      .then((found) => {
        if (cancelled) return;
        setApp(found);
        return api.getApplicationHistory(trackingId).then((h) => {
          if (!cancelled) setHistory(h);
        });
      })
      .catch((err) => {
        if (cancelled) return;
        if (isNetworkError(err)) {
          setError(t('common.backendDown'));
        } else if (err instanceof Error && err.message === 'Application not found') {
          setNotFound(true);
        } else {
          setError(t('common.error'));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [trackingId, t]);

  return (
    <div className="page">
      <button type="button" className="btn btn-outline back-btn" onClick={() => onNavigate('applications')}>
        ← {t('common.back')}
      </button>
      <PageTitle title={t('apps.detailTitle')} />

      {notFound ? (
        <div className="alert alert-warn" role="alert">
          {t('apps.notFound')}
        </div>
      ) : error ? (
        <ErrorBox message={error} />
      ) : !app ? (
        <Loading />
      ) : (
        <div className="two-col">
          <section className="card">
            <h2>{t('apps.detailTitle')}</h2>
            <dl className="detail-list">
              <div>
                <dt>{t('common.trackingId')}</dt>
                <dd><strong className="tracking-id">{app.trackingId}</strong></dd>
              </div>
              <div>
                <dt>{t('admin.serviceColumn')}</dt>
                <dd>{localizedOption(`apply.service.${app.serviceType}`, app.serviceType, t)}</dd>
              </div>
              <div>
                <dt>{t('apply.applicantName')}</dt>
                <dd>{app.applicantName}</dd>
              </div>
              <div>
                <dt>{t('common.status')}</dt>
                <dd><StatusBadge status={app.status} /></dd>
              </div>
              <div>
                <dt>{t('apps.submittedOn')}</dt>
                <dd>{formatDate(app.createdAt)}</dd>
              </div>
              <div>
                <dt>{t('common.notes')}</dt>
                <dd>{app.remarks ?? '—'}</dd>
              </div>
            </dl>
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