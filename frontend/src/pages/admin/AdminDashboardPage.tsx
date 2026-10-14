import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { RouteName } from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { ErrorBox, Loading, PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { AdminStats, Application, Grievance } from '../../services/api';
import { formatDate, localizedOption } from '../../utils/format';

interface Props {
  onNavigate: (route: RouteName, param?: string) => void;
}

export default function AdminDashboardPage({ onNavigate }: Props) {
  const { t } = useLanguage();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [grvs, setGrvs] = useState<Grievance[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [s, a, g] = await Promise.all([
        api.getAdminStats(),
        api.getApplications(),
        api.getGrievances(),
      ]);
      setStats(s);
      setApps(a);
      setGrvs(g);
      setError('');
    } catch (err) {
      setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const statTiles = [
    { label: t('admin.totalApplications'), value: stats?.totalApplications, tone: 'blue' },
    { label: t('admin.pendingApplications'), value: stats?.pendingApplications, tone: 'amber' },
    { label: t('admin.approvedApplications'), value: stats?.approvedApplications, tone: 'green' },
    { label: t('admin.rejectedApplications'), value: stats?.rejectedApplications, tone: 'red' },
    { label: t('admin.openGrievances'), value: stats?.openGrievances, tone: 'purple' },
    { label: t('admin.overdueGrievances'), value: stats?.overdueGrievances, tone: 'orange' },
    { label: t('admin.totalCandidates'), value: stats?.totalCandidates, tone: 'teal' },
  ];

  return (
    <div className="page">
      <div className="page-heading-row">
        <PageTitle title={t('admin.title')} />
        <button type="button" className="btn btn-outline" onClick={() => load()}>
          ↻ {t('admin.refresh')}
        </button>
      </div>

      {error ? <ErrorBox message={error} /> : null}
      {!stats && !error ? <Loading /> : null}

      {stats ? (
        <section className="admin-stats">
          {statTiles.map((tile) => (
            <div key={tile.label} className={`stat-tile tone-${tile.tone}`}>
              <span className="stat-label">{tile.label}</span>
              <span className="stat-value">{tile.value ?? '—'}</span>
            </div>
          ))}
        </section>
      ) : null}

      {apps.length > 0 ? (
        <section className="card table-card">
          <div className="card-head">
            <h2>{t('dash.recentApplications')}</h2>
            <button
              type="button"
              className="link-btn"
              onClick={() => onNavigate('admin-applications')}
            >
              {t('common.view')}
            </button>
          </div>
          <table className="table-full">
            <thead>
              <tr>
                <th>{t('common.trackingId')}</th>
                <th>{t('admin.applicantColumn')}</th>
                <th>{t('admin.serviceColumn')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
              </tr>
            </thead>
            <tbody>
              {apps.slice(0, 5).map((app) => (
                <tr key={app.id}>
                  <td><strong>{app.trackingId}</strong></td>
                  <td>{app.applicantName}</td>
                  <td>{localizedOption(`apply.service.${app.serviceType}`, app.serviceType, t)}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>{formatDate(app.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {grvs.length > 0 ? (
        <section className="card table-card">
          <div className="card-head">
            <h2>{t('dash.recentGrievances')}</h2>
            <button
              type="button"
              className="link-btn"
              onClick={() => onNavigate('admin-grievances')}
            >
              {t('common.view')}
            </button>
          </div>
          <table className="table-full">
            <thead>
              <tr>
                <th>{t('common.trackingId')}</th>
                <th>{t('grv.category')}</th>
                <th>{t('grv.subject')}</th>
                <th>{t('common.status')}</th>
                <th>{t('grv.dueOn')}</th>
              </tr>
            </thead>
            <tbody>
              {grvs.slice(0, 5).map((g) => (
                <tr key={g.id}>
                  <td><strong>{g.trackingId}</strong></td>
                  <td>{localizedOption(`grv.category.${g.category}`, g.category, t)}</td>
                  <td>{g.subject}</td>
                  <td><StatusBadge status={g.status} /></td>
                  <td>{formatDate(g.dueAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}