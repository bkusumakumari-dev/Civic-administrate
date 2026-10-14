import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/translations';

const OPTIONS: { value: Lang; labelKey: string }[] = [
  { value: 'en', labelKey: 'lang.en' },
  { value: 'te', labelKey: 'lang.te' },
  { value: 'hi', labelKey: 'lang.hi' },
  { value: 'ta', labelKey: 'lang.ta' },
  { value: 'ml', labelKey: 'lang.ml' },
];

/** Clearly visible English / Telugu switch, persisted in localStorage. */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div className="language-switcher" role="group" aria-label={t('lang.label')}>
      <span className="language-label">{t('lang.label')}:</span>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`lang-btn ${lang === option.value ? 'active' : ''}`}
          aria-pressed={lang === option.value}
          onClick={() => setLang(option.value)}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  );
}