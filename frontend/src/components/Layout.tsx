import { useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export type RouteName =
  | 'dashboard'
  | 'apply'
  | 'applications'
  | 'app-detail'
  | 'grievances'
  | 'new-grievance'
  | 'grv-detail'
  | 'profile'
  | 'admin-dashboard'
  | 'admin-applications'
  | 'admin-grievances';

interface NavItem {
  route: RouteName;
  labelKey: string;
  icon: ReactNode;
}

interface LayoutProps {
  current: RouteName;
  onNavigate: (route: RouteName, param?: string) => void;
  children: ReactNode;
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
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

const ICONS: Record<string, ReactNode> = {
  dashboard: (
    <Icon>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </Icon>
  ),
  grid: (
    <Icon>
      <rect x="3" y="3" width="7" height="7" rx="1.6" />
      <rect x="14" y="3" width="7" height="7" rx="1.6" />
      <rect x="3" y="14" width="7" height="7" rx="1.6" />
      <rect x="14" y="14" width="7" height="7" rx="1.6" />
    </Icon>
  ),
  filePlus: (
    <Icon>
      <path d="M14 3v5h5" />
      <path d="M6 3h8l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M12 12v6M9 15h6" />
    </Icon>
  ),
  file: (
    <Icon>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </Icon>
  ),
  chat: (
    <Icon>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      <path d="M8 9h8M8 13h5" />
    </Icon>
  ),
  megaphone: (
    <Icon>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z" />
      <path d="M15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14" />
    </Icon>
  ),
  user: (
    <Icon>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
  ),
};

/** Shared shell: sidebar navigation, topbar and role-aware chrome. */
export default function Layout({ current, onNavigate, children }: LayoutProps) {
  const { t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: NavItem[] = isAdmin
    ? [
        { route: 'admin-dashboard', labelKey: 'nav.adminDashboard', icon: ICONS.grid },
        { route: 'admin-applications', labelKey: 'nav.adminApplications', icon: ICONS.file },
        { route: 'admin-grievances', labelKey: 'nav.adminGrievances', icon: ICONS.megaphone },
      ]
    : [
        { route: 'dashboard', labelKey: 'nav.dashboard', icon: ICONS.dashboard },
        { route: 'apply', labelKey: 'nav.apply', icon: ICONS.filePlus },
        { route: 'applications', labelKey: 'nav.myApplications', icon: ICONS.file },
        { route: 'grievances', labelKey: 'nav.myGrievances', icon: ICONS.chat },
        { route: 'new-grievance', labelKey: 'nav.newGrievance', icon: ICONS.megaphone },
      ];

  const roleLabel = isAdmin ? t('auth.role.admin') : t('auth.role.candidate');
  const displayName = user?.fullName ?? user?.username ?? '';
  const initial = displayName.trim().charAt(0).toUpperCase() || '?';

  const activeRoute: RouteName =
    current === 'app-detail' ? 'applications' : current === 'grv-detail' ? 'grievances' : current;

  const titleKey =
    navItems.find((item) => item.route === activeRoute)?.labelKey ?? 'nav.profile';

  const go = (route: RouteName) => {
    onNavigate(route);
    setMenuOpen(false);
  };

  return (
    <div className={`shell ${isAdmin ? 'shell-admin' : 'shell-candidate'}`}>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true">🏛️</span>
          <div className="brand-text">
            <strong>{t('app.name')}</strong>
            <span className="sidebar-role">{roleLabel}</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.route}
              type="button"
              className={`side-link ${activeRoute === item.route ? 'active' : ''}`}
              aria-current={activeRoute === item.route ? 'page' : undefined}
              onClick={() => go(item.route)}
            >
              <span className="side-link-icon">{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </button>
          ))}

          <button
            type="button"
            className={`side-link ${activeRoute === 'profile' ? 'active' : ''}`}
            aria-current={activeRoute === 'profile' ? 'page' : undefined}
            onClick={() => go('profile')}
          >
            <span className="side-link-icon">{ICONS.user}</span>
            <span>{t('nav.profile')}</span>
          </button>
        </nav>

        <div className="sidebar-foot">
          <div className="user-card">
            <span className="avatar" aria-hidden="true">{initial}</span>
            <div className="user-meta">
              <strong>{displayName}</strong>
              <span className="muted small">{roleLabel}</span>
            </div>
          </div>
          <button type="button" className="btn btn-outline btn-block" onClick={logout}>
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          className="sidebar-scrim"
          aria-label={t('common.close')}
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className="shell-main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <div className="topbar-title">
            <span className="topbar-eyebrow">{t('app.name')}</span>
            <h1>{t(titleKey)}</h1>
          </div>

          <div className="topbar-actions">
            <LanguageSwitcher />
            <button
              type="button"
              className="avatar avatar-btn"
              title={displayName}
              onClick={() => go('profile')}
            >
              {initial}
            </button>
          </div>
        </header>

        <main className="shell-content">{children}</main>

        <footer className="shell-footer">
          <p className="muted notice">{t('app.demoNotice')}</p>
        </footer>
      </div>
    </div>
  );
}
