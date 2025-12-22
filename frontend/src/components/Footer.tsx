import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-4 text-sm text-gray-600 flex justify-between">
        <div>{t('footer.info')}</div>
        <div className="space-x-4">
          <button
            onClick={() => window.alert(t('footer.soporte'))}
            className="text-blue-600 hover:underline"
            aria-label={t('footer.soporte')}
          >
            {t('footer.soporte')}
          </button>
          <button
            onClick={() => window.alert(t('footer.politicas'))}
            className="text-blue-600 hover:underline"
            aria-label={t('footer.politicas')}
          >
            {t('footer.politicas')}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
