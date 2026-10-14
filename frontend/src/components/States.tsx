import { useLanguage } from '../i18n/LanguageContext';

export function Loading() {
  const { t } = useLanguage();
  return (
    <div className="state-box" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{t('common.loading')}</span>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="state-box empty-state">
      <span aria-hidden="true">📭</span>
      <span>{text}</span>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="state-box error-box" role="alert">
      <span aria-hidden="true">⚠️</span>
      <span>{message}</span>
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="page-heading">
      <h1>{title}</h1>
      {subtitle ? <p className="muted">{subtitle}</p> : null}
    </div>
  );
}