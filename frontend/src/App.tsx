import { useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import Layout from './components/Layout';
import type { RouteName } from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/citizen/DashboardPage';
import ApplyPage from './pages/citizen/ApplyPage';
import ApplicationsPage from './pages/citizen/ApplicationsPage';
import ApplicationDetailPage from './pages/citizen/ApplicationDetailPage';
import GrievancesPage from './pages/citizen/GrievancesPage';
import NewGrievancePage from './pages/citizen/NewGrievancePage';
import GrievanceDetailPage from './pages/citizen/GrievanceDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminGrievancesPage from './pages/admin/AdminGrievancesPage';
import type { Role } from './services/api';
import './App.css';

/** Public experience: marketing landing page and the login/registration screen. */
function AuthFlow() {
  const [screen, setScreen] = useState<'landing' | 'login'>('landing');
  const [loginRole, setLoginRole] = useState<Role>('CANDIDATE');

  if (screen === 'login') {
    return <LoginPage initialRole={loginRole} onBack={() => setScreen('landing')} />;
  }

  return (
    <LandingPage
      onSignIn={(role) => {
        setLoginRole(role);
        setScreen('login');
      }}
    />
  );
}

/** Authenticated workspace. Remounted per user, so routing resets on every login. */
function Workspace() {
  const { isAdmin } = useAuth();
  const [route, setRoute] = useState<RouteName>('dashboard');
  const [param, setParam] = useState<string | undefined>(undefined);

  const navigate = (next: RouteName, p?: string) => {
    setRoute(next);
    setParam(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const effectiveRoute: RouteName = isAdmin
    ? route.startsWith('admin-') || route === 'profile'
      ? route
      : 'admin-dashboard'
    : route.startsWith('admin-')
      ? 'dashboard'
      : route;

  const renderPage = () => {
    switch (effectiveRoute) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'apply':
        return <ApplyPage />;
      case 'applications':
        return <ApplicationsPage onNavigate={navigate} />;
      case 'app-detail':
        return <ApplicationDetailPage trackingId={param ?? ''} onNavigate={navigate} />;
      case 'grievances':
        return <GrievancesPage onNavigate={navigate} />;
      case 'new-grievance':
        return <NewGrievancePage />;
      case 'grv-detail':
        return <GrievanceDetailPage trackingId={param ?? ''} onNavigate={navigate} />;
      case 'admin-dashboard':
        return <AdminDashboardPage onNavigate={navigate} />;
      case 'admin-applications':
        return <AdminApplicationsPage />;
      case 'admin-grievances':
        return <AdminGrievancesPage />;
      case 'profile':
      default:
        return <ProfilePage />;
    }
  };

  return (
    <Layout current={effectiveRoute} onNavigate={navigate}>
      {renderPage()}
    </Layout>
  );
}

function Shell() {
  const { user } = useAuth();
  return user ? <Workspace key={user.id} /> : <AuthFlow />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </LanguageProvider>
  );
}
