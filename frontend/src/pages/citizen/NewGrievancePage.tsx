import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { Grievance } from '../../services/api';

const CATEGORIES = ['water', 'light', 'road', 'sanitation', 'drainage', 'tax'];

export default function NewGrievancePage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [relatedTrackingId, setRelatedTrackingId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<Grievance | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!category) next.category = t('grv.validation.category');
    if (!subject.trim()) next.subject = t('grv.validation.subject');
    if (!description.trim()) next.description = t('grv.validation.description');
    return next;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setError('');
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    setBusy(true);
    try {
      const createdGrievance = await api.createGrievance({
        category,
        subject,
        description,
        relatedTrackingId: relatedTrackingId.trim() || undefined,
        ownerId: user?.id,
      });
      setCreated(createdGrievance);
    } catch (err) {
      setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const resetForm = () => {
    setCreated(null);
    setCategory('');
    setSubject('');
    setDescription('');
    setRelatedTrackingId('');
  };

  const onCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value);

  if (created) {
    return (
      <div className="page">
        <div className="success-card" role="status">
          <span className="success-emoji" aria-hidden="true">✅</span>
          <h2>{t('grv.submitSuccess')}</h2>
          <p>
            {t('grv.savedTracking')} <strong className="tracking-id">{created.trackingId}</strong>
          </p>
          <p className="muted">{t(`grv.nextStep.Submitted`)}</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={resetForm}>
              {t('grv.new')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <PageTitle title={t('grv.new')} subtitle={t('grv.description')} />
      {error ? (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      ) : null}

      <form className="form card" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="grvCategory">
            {t('grv.category')} <span className="req">*</span>
          </label>
          <select id="grvCategory" value={category} onChange={onCategoryChange}>
            <option value="">—</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`grv.category.${c}`)}
              </option>
            ))}
          </select>
          {errors.category ? <span className="field-error">{errors.category}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="grvSubject">
            {t('grv.subject')} <span className="req">*</span>
          </label>
          <input
            id="grvSubject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {errors.subject ? <span className="field-error">{errors.subject}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="grvDescription">
            {t('grv.description')} <span className="req">*</span>
          </label>
          <textarea
            id="grvDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          {errors.description ? <span className="field-error">{errors.description}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="relatedApp">{t('grv.relatedApp')}</label>
          <input
            id="relatedApp"
            type="text"
            placeholder="APP-2026-000000"
            value={relatedTrackingId}
            onChange={(e) => setRelatedTrackingId(e.target.value)}
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? t('common.loading') : t('common.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}