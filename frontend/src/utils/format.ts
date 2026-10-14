/** Shows a timestamp as a short, readable local date. */
export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

/** Translates stored slug values (service type / category) or falls back to the raw value. */
export function localizedOption(key: string, raw: string, t: (k: string) => string): string {
  const translated = t(key);
  return translated === key ? raw : translated;
}