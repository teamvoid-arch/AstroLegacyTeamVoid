import en from './i18n.en.json';
import bn from './i18n.bn.json';
import { useStore, type Lang } from '../store';

// UI strings of the seamless story (from the Final version). Bangla falls back to English.
const dict: Record<Lang, Record<string, string>> = { en, bn };

export function st(key: string, lang: Lang = useStore.getState().lang): string {
  const v = dict[lang][key];
  if (v && !v.startsWith('TODO(bn)')) return v;
  return dict.en[key] ?? key;
}

export function useST() {
  const lang = useStore((s) => s.lang);
  return (key: string) => st(key, lang);
}
