import React, { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'es' | 'en';

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  // timestamp of last change (ms since epoch) to trigger UI notifications
  lastChangedAt: number | null;
}>({
  lang: 'en',
  setLang: () => {},
  lastChangedAt: null,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('lang');
      return (saved as Lang) || 'en';
    } catch (e) {
      return 'en';
    }
  });
  const [lastChangedAt, setLastChangedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
      setLastChangedAt(Date.now());
    } catch (e) {
      // ignore
    }
  }, [lang]);

  // Sync between tabs: when localStorage 'lang' changes elsewhere, update state
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lang' && e.newValue) {
        const newLang = (e.newValue as Lang) || 'en';
        setLangState(newLang);
        setLastChangedAt(Date.now());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setLang = (l: Lang) => setLangState(l);

  return (
    <LanguageContext.Provider value={{ lang, setLang, lastChangedAt }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
