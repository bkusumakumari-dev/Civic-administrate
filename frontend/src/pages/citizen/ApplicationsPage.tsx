import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { RouteName } from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { EmptyState, ErrorBox, Loading, PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { Application } from '../../services/api';
import { formatDate, localizedOption } from '../../utils/format';

interface Props {
  onNavigate: (route: RouteName, param?: string) => void;
}

export default function ApplicationsPage({ onNavigate }: Props) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState<Application[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .getApplications(user?.id)
      .then((list) => {
        if (!cancelled) setItems(list);
      })
      .catch((err) => {
        if (!cancelled) setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id, t]);

  return (
    <div className="page">
      <PageTitle title={t('apps.title')} />
      {error ? <ErrorBox message={error} /> : null}

      {items === null && !error ? (
        <Loading />
      ) : items && items.length === 0 ? (
        <EmptyState text={t('apps.empty')} />
      ) : items ? (
        <div className="card table-card">
          <table className="table-full">
            <thead>
              <tr>
                <th>{t('common.trackingId')}</th>
                <th>{t('admin.serviceColumn')}</th>
                <th>{t('apply.applicantName')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((app) => (
                <tr key={app.id}>
                  <td>
                    <button
                      type="button"
                      className="link-btn tracking-link"
                      onClick={() => onNavigate('app-detail', app.trackingId)}
                    >
                      <strong>{app.trackingId}</strong>
                    </button>
                  </td>
                  <td>{localizedOption(`apply.service.${app.serviceType}`, app.serviceType, t)}</td>
                  <td>{app.applicantName}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-small btn-outline"
                      onClick={() => onNavigate('app-detail', app.trackingId)}
                    >
                      {t('common.view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}