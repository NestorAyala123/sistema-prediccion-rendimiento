import { useLanguage } from '../contexts/LanguageContext';
import { translations } from './translations';

type NestedKeyOf<T> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}.${NestedKeyOf<T[K]>}`
    : K & string;
}[keyof T];

type TranslationKey = NestedKeyOf<typeof translations['es']>;

export const useTranslation = () => {
  const { lang } = useLanguage();

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let result: any = translations[lang] ?? translations.en;
    
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        result = translations.en;
        for (const fallbackKey of keys) {
          result = result?.[fallbackKey];
        }
        break;
      }
    }
    
    return result ?? key;
  };

  return { t };
};
