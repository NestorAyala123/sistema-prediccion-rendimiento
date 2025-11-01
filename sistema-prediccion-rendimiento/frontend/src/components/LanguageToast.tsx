import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../i18n/useTranslation';

const LanguageToast: React.FC = () => {
  const { lang, lastChangedAt } = useLanguage();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastChangedAt) return;
    setVisible(true);
    const id = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(id);
  }, [lastChangedAt]);

  if (!visible) return null;

  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50">
      <div className="bg-black bg-opacity-80 text-white px-4 py-2 rounded shadow">
        {t('nav.language')}: {lang === 'es' ? 'Español' : 'English'}
      </div>
    </div>
  );
};

export default LanguageToast;
