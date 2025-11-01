import React from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { useTranslation } from '../i18n/useTranslation';
import { Menu } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const ProfileMenu: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          <span className="sr-only">{t('profile.openUserMenu')}</span>
          {profile.foto ? (
            <img
              className="h-8 w-8 rounded-full"
              src={profile.foto}
              alt={t('profile.photoAlt')}
            />
          ) : (
            <UserCircleIcon className="h-8 w-8 text-gray-300" />
          )}
        </Menu.Button>
      </div>
      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <a
              href="/profile"
              className={`${
                active ? 'bg-gray-100 dark:bg-gray-700' : ''
              } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
            >
              {t('profile.viewProfile')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="/settings"
              className={`${
                active ? 'bg-gray-100 dark:bg-gray-700' : ''
              } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
            >
              {t('profile.settings')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => {/* Lógica de cierre de sesión */}}
              className={`${
                active ? 'bg-gray-100 dark:bg-gray-700' : ''
              } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
            >
              {t('profile.signOut')}
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default ProfileMenu;