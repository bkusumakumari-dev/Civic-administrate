import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { STATUS_KEY } from '../../i18n/translations';
import StatusBadge from '../../components/StatusBadge';
import { EmptyState, ErrorBox, Loading, PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { Application } from '../../services/api';
import { formatDate, localizedOption } from '../../utils/format';

const STATUS_OPTIONS = ['Submitted', 'Under Review', 'Approved', 'Rejected'];

export default function AdminApplicationsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState<Application[] | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await api.getApplications());
      setError('');
    } catch (err) {
      setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (app: Application) => {
    setEditingId(app.id);
    setNewStatus(app.status);
    setNote(app.remarks ?? '');
    setNotice('');
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingId) return;
    setBusy(true);
    try {
      await api.updateApplicationStatus(editingId, newStatus, note, user?.username ?? 'admin');
      setNotice(t('admin.updated'));
      setEditingId(null);
      await load();
    } catch (err) {
      setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-heading-row">
        <PageTitle title={t('admin.applicationsTitle')} />
        <button type="button" className="btn btn-outline" onClick={() => load()}>
          ↻ {t('admin.refresh')}
        </button>
      </div>

      {error ? <ErrorBox message={error} /> : null}
      {notice ? (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      ) : null}

      {items === null && !error ? (
        <Loading />
      ) : items && items.length === 0 ? (
        <EmptyState text={t('admin.empty')} />
      ) : items ? (
        <div className="card table-card">
          <table className="table-full">
            <thead>
              <tr>
                <th>{t('common.trackingId')}</th>
                <th>{t('admin.applicantColumn')}</th>
                <th>{t('admin.serviceColumn')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((app) => (
                <tr key={app.id}>
                  <td><strong>{app.trackingId}</strong></td>
                  <td>
                    {app.applicantName}
                    {app.ownerId ? <div className="muted small">{app.email}</div> : null}
                  </td>
                  <td>{localizedOption(`apply.service.${app.serviceType}`, app.serviceType, t)}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>
                    {editingId === app.id ? (
                      <button
                        type="button"
                        className="btn btn-small btn-outline"
                        onClick={() => setEditingId(null)}
                      >
                        {t('common.cancel')}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-small btn-primary"
                        onClick={() => startEdit(app)}
                      >
                        {t('admin.updateStatus')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingId ? (
            <form className="inline-edit" onSubmit={handleUpdate}>
              <h3>{t('admin.updateStatus')}</h3>
              <div className="form-row">
                <label htmlFor="appStatus">{t('admin.selectStatus')}</label>
                <select id="appStatus" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {t(STATUS_KEY[s] ?? s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="appNote">{t('admin.actionNote')}</label>
                <textarea
                  id="appNote"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="btn-row">
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? t('common.loading') : `${t('common.update')} ${t('common.status')}`}
                </button>
              </div>
            </form>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}