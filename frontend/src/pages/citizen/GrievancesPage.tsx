import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { RouteName } from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { EmptyState, ErrorBox, Loading, PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { Grievance } from '../../services/api';
import { formatDate, localizedOption } from '../../utils/format';

interface Props {
  onNavigate: (route: RouteName, param?: string) => void;
}

export default function GrievancesPage({ onNavigate }: Props) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState<Grievance[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .getGrievances(user?.id)
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
      <div className="page-heading-row">
        <PageTitle title={t('grv.title')} />
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('new-grievance')}>
          + {t('grv.new')}
        </button>
      </div>

      {error ? <ErrorBox message={error} /> : null}

      {items === null && !error ? (
        <Loading />
      ) : items && items.length === 0 ? (
        <EmptyState text={t('grv.empty')} />
      ) : items ? (
        <div className="card table-card">
          <table className="table-full">
            <thead>
              <tr>
                <th>{t('common.trackingId')}</th>
                <th>{t('grv.category')}</th>
                <th>{t('grv.subject')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((g) => (
                <tr key={g.id}>
                  <td><strong>{g.trackingId}</strong></td>
                  <td>{localizedOption(`grv.category.${g.category}`, g.category, t)}</td>
                  <td>{g.subject}</td>
                  <td><StatusBadge status={g.status} /></td>
                  <td>{formatDate(g.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-small btn-outline"
                      onClick={() => onNavigate('grv-detail', g.trackingId)}
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