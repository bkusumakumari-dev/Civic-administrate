import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/translations';
import { PageTitle } from '../components/States';
import { isNetworkError } from '../services/api';

export default function ProfilePage() {
  const { t, setLang } = useLanguage();
  const { user, isAdmin, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [preferred, setPreferred] = useState<Lang>(user?.preferredLanguage === 'te' ? 'te' : 'en');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateProfile({
        fullName: fullName || '',
        email: email || '',
        phone: phone || '',
        preferredLanguage: preferred,
      });
      void updated;
      setLang(preferred);
      setMessage(`${t('profile.updated')} ${t('profile.preferredLang')}`);
    } catch (err) {
      setError(isNetworkError(err) ? t('common.backendDown') : t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page narrow">
      <PageTitle title={t('profile.title')} />
      <div className="card profile-card">
        <div className="profile-avatar" aria-hidden="true">
          <span>👤</span>
        </div>
        <dl className="detail-list">
          <div>
            <dt>{t('profile.accountInfo')}</dt>
            <dd>
              <strong>{user?.username}</strong>
              <span className="muted">— {isAdmin ? t('auth.role.admin') : t('auth.role.candidate')}</span>
            </dd>
          </div>
        </dl>

        {message ? (
          <div className="alert alert-success" role="status">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        ) : null}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="pfFullName">{t('auth.fullName')}</label>
            <input id="pfFullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="pfEmail">{t('auth.email')}</label>
            <input id="pfEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="pfPhone">{t('auth.phone')}</label>
            <input id="pfPhone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="pfLang">{t('profile.language')}</label>
            <select
              id="pfLang"
              value={preferred}
              onChange={(e) => setPreferred(e.target.value as Lang)}
            >
              <option value="en">{t('lang.en')}</option>
              <option value="te">{t('lang.te')}</option>
            </select>
          </div>
          <div className="btn-row">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? t('common.loading') : `${t('common.save')} ${t('profile.update')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}