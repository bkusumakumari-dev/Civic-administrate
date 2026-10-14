import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { STATUS_KEY } from '../../i18n/translations';
import StatusBadge from '../../components/StatusBadge';
import { EmptyState, ErrorBox, Loading, PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { Grievance } from '../../services/api';
import { formatDate, localizedOption } from '../../utils/format';

const STATUS_OPTIONS = ['Submitted', 'In Progress', 'Resolved', 'Rejected'];

function isOverdue(g: Grievance): boolean {
  return (
    !!g.dueAt &&
    g.status !== 'Resolved' &&
    g.status !== 'Rejected' &&
    new Date(g.dueAt).getTime() < Date.now()
  );
}

export default function AdminGrievancesPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState<Grievance[] | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await api.getGrievances());
      setError('');
    } catch (err) {
      setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (g: Grievance) => {
    setEditingId(g.id);
    setNewStatus(g.status);
    setNote(g.resolutionNote ?? '');
    setNotice('');
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingId) return;
    setBusy(true);
    try {
      await api.updateGrievanceStatus(editingId, newStatus, note, user?.username ?? 'admin');
      setNotice(t('admin.updated'));
      setEditingId(null);
      await load();
    } catch (err) {
      setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const pendingFirst = [...(items ?? [])].sort((a, b) => {
    const aOpen = isOverdue(a) ? -1 : isOpen(a) ? 0 : 1;
    const bOpen = isOverdue(b) ? -1 : isOpen(b) ? 0 : 1;
    return aOpen - bOpen;
  });

  return (
    <div className="page">
      <div className="page-heading-row">
        <PageTitle title={t('admin.grievancesTitle')} />
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
        <EmptyState text={t('admin.grvEmpty')} />
      ) : items ? (
        <div className="card table-card">
          <table className="table-full">
            <thead>
              <tr>
                <th>{t('common.trackingId')}</th>
                <th>{t('grv.category')}</th>
                <th>{t('grv.subject')}</th>
                <th>{t('common.status')}</th>
                <th>{t('grv.dueOn')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pendingFirst.map((g) => (
                <tr key={g.id} className={isOverdue(g) ? 'row-overdue' : ''}>
                  <td><strong>{g.trackingId}</strong></td>
                  <td>{localizedOption(`grv.category.${g.category}`, g.category, t)}</td>
                  <td>
                    {g.subject}
                    {isOverdue(g) ? (
                      <span className="overdue-chip">⚠️ {t('grv.overdue')}</span>
                    ) : null}
                  </td>
                  <td><StatusBadge status={g.status} /></td>
                  <td>{formatDate(g.dueAt)}</td>
                  <td>
                    {editingId === g.id ? (
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
                        onClick={() => startEdit(g)}
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
                <label htmlFor="grvStatus">{t('admin.selectStatus')}</label>
                <select id="grvStatus" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {t(STATUS_KEY[s] ?? s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="grvNote">{t('admin.actionNote')}</label>
                <textarea id="grvNote" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
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

function isOpen(g: Grievance): boolean {
  return g.status !== 'Resolved' && g.status !== 'Rejected';
}