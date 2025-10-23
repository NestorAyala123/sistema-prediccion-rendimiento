import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from './translations';

export const useTranslation = () => {
  const { lang } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  };

  return { t };
};
