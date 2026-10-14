import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { PageTitle } from '../../components/States';
import { api, isNetworkError } from '../../services/api';
import type { Application } from '../../services/api';

const SERVICES = ['residence', 'income', 'birth', 'caste'];

export default function ApplyPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [serviceType, setServiceType] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<Application | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!serviceType) next.serviceType = t('apply.validation.service');
    if (!applicantName.trim()) next.name = t('apply.validation.name');
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) next.email = t('apply.validation.email');
    if (!phone.trim() || !/^[0-9+\s-]{6,15}$/.test(phone)) next.phone = t('apply.validation.phone');
    if (!address.trim()) next.address = t('apply.validation.address');
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
      const createdApp = await api.createApplication({
        serviceType,
        applicantName,
        email,
        phone,
        address,
        remarks,
        ownerId: user?.id,
      });
      setCreated(createdApp);
    } catch (err) {
      setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const resetForm = () => {
    setCreated(null);
    setServiceType('');
    setApplicantName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setRemarks('');
  };

  if (created) {
    return (
      <div className="page">
        <div className="success-card" role="status">
          <span className="success-emoji" aria-hidden="true">✅</span>
          <h2>{t('apply.submitSuccess')}</h2>
          <p>
            {t('apply.savedTracking')} <strong className="tracking-id">{created.trackingId}</strong>
          </p>
          <p className="muted">{t('app.demoNotice')}</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={resetForm}>
              {t('apply.title')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <PageTitle title={t('apply.title')} subtitle={t('apply.intro')} />
      {error ? (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      ) : null}

      <form className="form card" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="serviceType">
            {t('apply.serviceType')} <span className="req">*</span>
          </label>
          <select
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="">—</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {t(`apply.service.${s}`)}
              </option>
            ))}
          </select>
          {errors.serviceType ? <span className="field-error">{errors.serviceType}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="userName">
            {t('apply.applicantName')} <span className="req">*</span>
          </label>
          <input
            id="userName"
            type="text"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
          />
          {errors.name ? <span className="field-error">{errors.name}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="email">
            {t('apply.email')} <span className="req">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="phone">
            {t('apply.phone')} <span className="req">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="address">
            {t('apply.address')} <span className="req">*</span>
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
          />
          {errors.address ? <span className="field-error">{errors.address}</span> : null}
        </div>

        <div className="form-row">
          <label htmlFor="remarks">{t('apply.remarks')}</label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
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