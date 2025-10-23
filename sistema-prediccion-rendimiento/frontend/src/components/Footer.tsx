import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-8">
      <div className="container mx-auto px-4 py-4 text-sm text-gray-600 dark:text-gray-400 flex justify-between">
        <div>{t('footer')}</div>
        <div className="space-x-4">
          <button
            onClick={() => window.alert('Support contact')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
            aria-label="Support"
          >
            Support
          </button>
          <button
            onClick={() => window.alert('Show policies')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
            aria-label="Policies"
          >
            Policies
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
