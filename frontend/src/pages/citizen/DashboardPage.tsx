import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { RouteName } from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import VoiceAssistant from '../../components/VoiceAssistant';
import { ErrorBox, Loading, PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { Application, Grievance } from '../../services/api';
import { formatDate, localizedOption } from '../../utils/format';

interface Props {
  onNavigate: (route: RouteName, param?: string) => void;
}

export default function DashboardPage({ onNavigate }: Props) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[] | null>(null);
  const [grvs, setGrvs] = useState<Grievance[] | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [appList, grvList] = await Promise.all([
          api.getApplications(user?.id),
          api.getGrievances(user?.id),
        ]);
        if (!cancelled) {
          setApps(appList);
          setGrvs(grvList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, t]);

  const openGrievances =
    grvs?.filter((g) => g.status !== 'Resolved' && g.status !== 'Rejected').length ?? 0;

  return (
    <div className="page">
      <PageTitle title={`${t('dash.greeting')}, ${user?.fullName ?? user?.username} 👋`} />
      <p className="muted lead">{t('dash.citizenWelcome')}</p>
      <VoiceAssistant text={t('voice.intro')} />

      {error ? <ErrorBox message={error} /> : null}

      <section className="quick-actions" aria-label={t('dash.quickActions')}>
        <h2>{t('dash.quickActions')}</h2>
        <div className="action-grid">
          <button type="button" className="quick-card quick-blue" onClick={() => onNavigate('apply')}>
            <span className="quick-emoji" aria-hidden="true">📄</span>
            <strong>{t('nav.apply')}</strong>
            <span className="muted">{t('apply.service.residence')}</span>
          </button>
          <button type="button" className="quick-card quick-teal" onClick={() => onNavigate('applications')}>
            <span className="quick-emoji" aria-hidden="true">🔎</span>
            <strong>{t('nav.myApplications')}</strong>
            <span className="muted">{t('dash.totalApps')}</span>
          </button>
          <button type="button" className="quick-card quick-purple" onClick={() => onNavigate('new-grievance')}>
            <span className="quick-emoji" aria-hidden="true">📣</span>
            <strong>{t('nav.newGrievance')}</strong>
            <span className="muted">{t('dash.openGrievances')}</span>
          </button>
        </div>
      </section>

      <section className="overview-stats">
        <h2>{t('dash.overview')}</h2>
        <div className="stat-grid">
          <div className="stat-card stat-blue">
            <span className="stat-label">{t('dash.totalApps')}</span>
            <span className="stat-value">{apps?.length ?? '—'}</span>
          </div>
          <div className="stat-card stat-orange">
            <span className="stat-label">{t('dash.openGrievances')}</span>
            <span className="stat-value">{grvs ? openGrievances : '—'}</span>
          </div>
        </div>
      </section>

      {apps || grvs ? (
        <div className="two-col">
          <section className="card">
            <div className="card-head">
              <h2>{t('dash.recentApplications')}</h2>
              <button type="button" className="link-btn" onClick={() => onNavigate('applications')}>
                {t('common.view')}
              </button>
            </div>
            {apps?.length ? (
              <ul className="mini-list">
                {apps.slice(0, 3).map((app) => (
                  <li key={app.id}>
                    <button
                      type="button"
                      className="mini-row"
                      onClick={() => onNavigate('app-detail', app.trackingId)}
                    >
                      <span className="mini-main">
                        <strong>{localizedOption(`apply.service.${app.serviceType}`, app.serviceType, t)}</strong>
                        <span className="muted">{app.trackingId}</span>
                      </span>
                      <StatusBadge status={app.status} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : apps ? (
              <p className="muted">{t('apps.empty')}</p>
            ) : null}

            <h2 className="sub-heading">{t('dash.recentGrievances')}</h2>
            {grvs?.length ? (
              <ul className="mini-list">
                {grvs.slice(0, 3).map((g: Grievance) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      className="mini-row"
                      onClick={() => onNavigate('grv-detail', g.trackingId)}
                    >
                      <span className="mini-main">
                        <strong>{g.subject}</strong>
                        <span className="muted">{g.trackingId}</span>
                      </span>
                      <StatusBadge status={g.status} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : grvs ? (
              <p className="muted">{t('grv.empty')}</p>
            ) : null}
          </section>

          <section className="card">
            <h2>{t('common.notes')}</h2>
            <table className="table-compact">
              <thead>
                <tr>
                  <th>{t('common.trackingId')}</th>
                  <th>{t('common.status')}</th>
                  <th>{t('common.date')}</th>
                </tr>
              </thead>
              <tbody>
                {(apps ?? []).slice(0, 5).map((app) => (
                  <tr key={app.id}>
                    <td>{app.trackingId}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>{formatDate(app.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      ) : !error ? (
        <Loading />
      ) : null}
    </div>
  );
}