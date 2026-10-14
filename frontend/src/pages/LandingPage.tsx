import type { ReactNode } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import type { Role } from '../services/api';

interface Props {
  onSignIn: (role: Role) => void;
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const FEATURES: { key: string; tone: string; icon: ReactNode }[] = [
  {
    key: 'multilingual',
    tone: 'blue',
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
      </Icon>
    ),
  },
  {
    key: 'tracking',
    tone: 'teal',
    icon: (
      <Icon>
        <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8v6M8 11h6" />
      </Icon>
    ),
  },
  {
    key: 'grievances',
    tone: 'purple',
    icon: (
      <Icon>
        <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z" />
        <path d="M15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14" />
      </Icon>
    ),
  },
  {
    key: 'voice',
    tone: 'amber',
    icon: (
      <Icon>
        <path d="M12 3v18M8 8v8M4 10v4M16 7v10M20 10v4" />
      </Icon>
    ),
  },
  {
    key: 'console',
    tone: 'indigo',
    icon: (
      <Icon>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </Icon>
    ),
  },
  {
    key: 'transparent',
    tone: 'green',
    icon: (
      <Icon>
        <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </Icon>
    ),
  },
];

export default function LandingPage({ onSignIn }: Props) {
  const { t } = useLanguage();

  const trustStats = [
    { labelKey: 'landing.stat.services', value: '4+' },
    { labelKey: 'landing.stat.languages', value: '2' },
    { labelKey: 'landing.stat.transparency', value: '100%' },
    { labelKey: 'landing.stat.support', value: '✓' },
  ];

  const steps = ['step1', 'step2', 'step3'];

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">🏛️</span>
            <div className="brand-text">
              <strong>{t('app.name')}</strong>
              <span className="brand-role">{t('landing.hero.eyebrow')}</span>
            </div>
          </div>

          <nav className="landing-links" aria-label="Landing">
            <a href="#features">{t('landing.nav.features')}</a>
            <a href="#how">{t('landing.nav.how')}</a>
            <a href="#portals">{t('landing.nav.portals')}</a>
          </nav>

          <div className="landing-nav-actions">
            <LanguageSwitcher />
            <button type="button" className="btn btn-primary" onClick={() => onSignIn('CANDIDATE')}>
              {t('landing.signin')}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                {t('landing.hero.eyebrow')}
              </span>
              <h1 className="hero-title">
                {t('landing.hero.title')}
                <br />
                <span className="gradient-text">{t('landing.hero.titleAccent')}</span>
              </h1>
              <p className="hero-subtitle">{t('landing.hero.subtitle')}</p>

              <div className="hero-cta">
                <button type="button" className="btn btn-primary btn-lg" onClick={() => onSignIn('CANDIDATE')}>
                  {t('landing.hero.ctaPrimary')}
                </button>
                <button type="button" className="btn btn-outline btn-lg" onClick={() => onSignIn('ADMIN')}>
                  {t('landing.hero.ctaSecondary')}
                </button>
              </div>

              <p className="hero-trust muted">{t('landing.hero.trust')}</p>

              <div className="trust-row">
                {trustStats.map((s) => (
                  <div key={s.labelKey} className="trust-stat">
                    <strong>{s.value}</strong>
                    <span className="muted">{t(s.labelKey)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="mock-card mock-main">
                <div className="mock-head">
                  <span className="mock-dot tone-blue" />
                  <span className="mock-dot tone-teal" />
                  <span className="mock-dot tone-purple" />
                  <span className="mock-title">CivicPulse Nexus</span>
                </div>
                <div className="mock-kpis">
                  <div className="mock-kpi tone-blue"><b>1,248</b><i /></div>
                  <div className="mock-kpi tone-green"><b>892</b><i /></div>
                  <div className="mock-kpi tone-amber"><b>56</b><i /></div>
                </div>
                <div className="mock-chart">
                  <span style={{ height: '38%' }} />
                  <span style={{ height: '62%' }} />
                  <span style={{ height: '48%' }} />
                  <span style={{ height: '82%' }} />
                  <span style={{ height: '70%' }} />
                  <span style={{ height: '94%' }} />
                  <span style={{ height: '58%' }} />
                </div>
              </div>

              <div className="mock-card mock-float">
                <span className="status-badge tone-green">
                  <span className="status-dot" aria-hidden="true" />
                  Approved
                </span>
                <div className="mock-float-line" />
                <div className="mock-float-line short" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="section-head">
            <h2>{t('landing.features.title')}</h2>
            <p className="muted lead">{t('landing.features.subtitle')}</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <article key={f.key} className="feature-card">
                <span className={`feature-icon tone-${f.tone}`}>{f.icon}</span>
                <h3>{t(`landing.feature.${f.key}.title`)}</h3>
                <p className="muted">{t(`landing.feature.${f.key}.desc`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="section section-alt">
          <div className="section-head">
            <h2>{t('landing.how.title')}</h2>
            <p className="muted lead">{t('landing.how.subtitle')}</p>
          </div>
          <div className="steps">
            {steps.map((step, index) => (
              <div key={step} className="step">
                <span className="step-num">{index + 1}</span>
                <h3>{t(`landing.how.${step}.title`)}</h3>
                <p className="muted">{t(`landing.how.${step}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="portals" className="section">
          <div className="section-head">
            <h2>{t('landing.portals.title')}</h2>
            <p className="muted lead">{t('landing.portals.subtitle')}</p>
          </div>
          <div className="portal-grid">
            <article
              className="portal-card portal-citizen"
              onClick={() => onSignIn('CANDIDATE')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSignIn('CANDIDATE');
              }}
            >
              <span className="portal-emoji" aria-hidden="true">👤</span>
              <h3>{t('landing.portal.citizen.title')}</h3>
              <p className="muted">{t('landing.portal.citizen.desc')}</p>
              <span className="portal-cta">
                {t('landing.portal.citizen.cta')} <span aria-hidden="true">→</span>
              </span>
            </article>

            <article
              className="portal-card portal-admin"
              onClick={() => onSignIn('ADMIN')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSignIn('ADMIN');
              }}
            >
              <span className="portal-emoji" aria-hidden="true">🛡️</span>
              <h3>{t('landing.portal.admin.title')}</h3>
              <p className="muted">{t('landing.portal.admin.desc')}</p>
              <span className="portal-cta">
                {t('landing.portal.admin.cta')} <span aria-hidden="true">→</span>
              </span>
            </article>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">🏛️</span>
            <strong>{t('app.name')}</strong>
          </div>
          <p className="muted">{t('landing.footer.about')}</p>
          <p className="muted notice">{t('landing.footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
