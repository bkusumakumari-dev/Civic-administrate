import { useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const SUPPORTED =
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Simple "listen to instructions" button that reads the current page
 * instructions aloud (prefers a Telugu voice when available).
 */
export default function VoiceAssistant({ text }: { text: string }) {
  const { t, lang } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const [unavailable, setUnavailable] = useState(!SUPPORTED);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const pickVoice = (): SpeechSynthesisVoice | undefined => {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const wantedLang = lang === 'te' ? 'te' : 'en';
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith(wantedLang)) ??
      voices.find((v) => v.lang.toLowerCase().startsWith('en'))
    );
  };

  const speak = () => {
    if (!SUPPORTED) {
      setUnavailable(true);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = lang === 'te' ? 'te-IN' : 'en-IN';
    }
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    if (SUPPORTED) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  if (unavailable) {
    return <p className="muted voice-unavailable">{t('voice.unavailable')}</p>;
  }

  return (
    <button
      type="button"
      className="btn btn-secondary voice-btn"
      onClick={speaking ? stop : speak}
      aria-pressed={speaking}
    >
      {speaking ? `⏹ ${t('voice.stop')}` : `🔊 ${t('voice.listen')}`}
    </button>
  );
}