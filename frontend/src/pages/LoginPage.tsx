import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { Role } from '../services/api';
import { isNetworkError } from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface Props {
  initialRole?: Role;
  onBack?: () => void;
}

/**
 * Role-based entry point. Admins log in; citizens can log in or create a new
 * account. The whole application then changes to match the logged-in role.
 */
export default function LoginPage({ initialRole = 'CANDIDATE', onBack }: Props) {
  const { t } = useLanguage();
  const { login, register } = useAuth();

  const [role, setRole] = useState<Role>(initialRole);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const chooseRole = (next: Role) => {
    setRole(next);
    setError('');
    if (next === 'ADMIN') {
      setMode('login');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError(t('auth.error.fill'));
      return;
    }
    if (mode === 'register' && (!fullName.trim() || !email.trim() || !phone.trim())) {
      setError(t('auth.error.fill'));
      return;
    }
    setBusy(true);
    try {
      if (mode === 'register') {
        await register({ username, password, fullName, email, phone });
      } else {
        await login(username, password);
      }
    } catch (err) {
      if (isNetworkError(err)) {
        setError(t('common.backendDown'));
      } else if (mode === 'register') {
        setError(t('auth.error.taken'));
      } else {
        setError(t('auth.error.invalid'));
      }
    } finally {
      setBusy(false);
    }
  };

  const isAdminRole = role === 'ADMIN';
  const bullets = isAdminRole
    ? ['console', 'transparent', 'tracking']
    : ['multilingual', 'tracking', 'grievances'];

  return (
    <div className={`auth-page ${isAdminRole ? 'auth-admin' : 'auth-candidate'}`}>
      <aside className="auth-aside">
        <div className="auth-aside-top">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">🏛️</span>
            <div className="brand-text">
              <strong>{t('app.name')}</strong>
              <span className="brand-role">{t('landing.hero.eyebrow')}</span>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="auth-aside-body">
          <span className="auth-aside-emoji" aria-hidden="true">{isAdminRole ? '🛡️' : '👤'}</span>
          <h2>{isAdminRole ? t('landing.portal.admin.title') : t('landing.portal.citizen.title')}</h2>
          <p className="auth-aside-desc">
            {isAdminRole ? t('landing.portal.admin.desc') : t('landing.portal.citizen.desc')}
          </p>
          <ul className="auth-bullets">
            {bullets.map((b) => (
              <li key={b}>
                <span className="tick" aria-hidden="true">✓</span>
                {t(`landing.feature.${b}.title`)}
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-aside-foot notice">{t('app.demoNotice')}</p>
      </aside>

      <section className="auth-panel">
        <div className="auth-panel-inner">
          {onBack ? (
            <button type="button" className="back-home" onClick={onBack}>
              ← {t('app.name')}
            </button>
          ) : null}

          <h1 className="auth-title">
            {isAdminRole ? t('auth.welcomeAdmin') : t('auth.welcomeCandidate')}
          </h1>
          <p className="muted auth-sub">{t('app.tagline')}</p>

          <div className="role-tabs" role="tablist" aria-label="Portal">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'CANDIDATE'}
              className={`role-tab ${role === 'CANDIDATE' ? 'active' : ''}`}
              onClick={() => chooseRole('CANDIDATE')}
            >
              <span className="role-emoji" aria-hidden="true">👤</span>
              {t('auth.role.candidate')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'ADMIN'}
              className={`role-tab ${role === 'ADMIN' ? 'active' : ''}`}
              onClick={() => chooseRole('ADMIN')}
            >
              <span className="role-emoji" aria-hidden="true">🛡️</span>
              {t('auth.role.admin')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form" noValidate>
            {mode === 'register' && (
              <div className="form-row">
                <label htmlFor="fullName">{t('auth.fullName')} <span className="req">*</span></label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-row">
              <label htmlFor="username">{t('auth.username')} <span className="req">*</span></label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-row">
              <label htmlFor="password">{t('auth.password')} <span className="req">*</span></label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
            </div>

            {mode === 'register' && (
              <>
                <div className="form-row">
                  <label htmlFor="email">{t('auth.email')} <span className="req">*</span></label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="phone">{t('auth.phone')} <span className="req">*</span></label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </div>
              </>
            )}

            {error ? (
              <div className="alert alert-error" role="alert">
                {error}
              </div>
            ) : null}

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={busy}>
              {busy ? t('common.loading') : mode === 'register' ? t('auth.registerButton') : t('auth.loginButton')}
            </button>
          </form>

          {role === 'CANDIDATE' && (
            <p className="switch-mode">
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
              >
                {mode === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin')}
              </button>
            </p>
          )}

          <div className="demo-hint">
            <p className="muted">{t('auth.demoHint')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
