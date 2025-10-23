import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import type { FC } from 'react';
import { 
  EllipsisVerticalIcon, 
  ArrowPathIcon,
  SpeakerWaveIcon,
  EyeIcon,
  CursorArrowRippleIcon
} from '@heroicons/react/24/outline';
import { useAccessibility } from '../hooks/useAccessibility';
import { useTranslation } from '../i18n/useTranslation';

interface AccessibilityMenuInlineProps {}

const AccessibilityMenuInline: FC<AccessibilityMenuInlineProps> = () => {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const { t } = useTranslation();

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button
              id="accessibility-button"
              aria-label={t('accessibility.menuTitle')}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="accessibility-menu"
              title={t('accessibility.menuDesc')}
              className="p-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <EllipsisVerticalIcon className="h-6 w-6 text-gray-800 dark:text-gray-100" aria-hidden="true" />
              <span className="sr-only">{t('accessibility.menuTitle')}</span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            afterLeave={() => document.getElementById('accessibility-button')?.focus()}
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 focus:outline-none"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h2 id="accessibility-title" className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('accessibility.menuTitle')}
                  </h2>
                  <button
                    onClick={() => resetSettings()}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    aria-label={t('accessibility.actions.reset')}
                    title={t('accessibility.actions.reset')}
                  >
                    <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

              <div 
                className="p-4 space-y-6" 
                role="group" 
                aria-labelledby="accessibility-title"
                id="accessibility-menu"
              >
                {/* Auditiva */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <SpeakerWaveIcon className="h-5 w-5 mr-2" />
                    {t('accessibility.categories.auditory')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('accessibility.features.textToSpeech')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!settings.textToSpeech}
                          onChange={(e) => updateSetting('textToSpeech', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('accessibility.features.audioControl')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!settings.audioControls}
                          onChange={(e) => updateSetting('audioControls', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('accessibility.features.signLanguage')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!settings.signLanguage}
                          onChange={(e) => updateSetting('signLanguage', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Visual */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <EyeIcon className="h-5 w-5 mr-2" />
                    {t('accessibility.categories.visual')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          {t('accessibility.features.textSize')}
                        </label>
                        <span className="text-sm text-gray-500">{settings.textSize ?? 1}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min={1}
                          max={5}
                          step={1}
                          value={settings.textSize ?? 1}
                          onChange={(e) => updateSetting('textSize', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-valuemin={1}
                          aria-valuemax={5}
                          aria-valuenow={settings.textSize ?? 1}
                          aria-valuetext={`${t('accessibility.features.textSize')}: ${settings.textSize ?? 1}`}
                        />
                        <div className="absolute -top-6 left-0 w-full flex justify-between text-xs text-gray-500">
                          <span>A</span>
                          <span className="text-base">A</span>
                          <span className="text-lg">A</span>
                          <span className="text-xl">A</span>
                          <span className="text-2xl">A</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {t('accessibility.features.fontType')}
                      </label>
                      <select
                        value={settings.fontType ?? 'Arial'}
                        onChange={(e) => updateSetting('fontType', e.target.value)}
                        className="w-full h-[44px] px-4 text-base bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:border-blue-500 transition-colors cursor-pointer"
                        aria-label={t('accessibility.features.fontType')}
                      >
                        <option value="Verdana">Verdana</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('accessibility.features.visualAlerts')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!settings.visualAlerts}
                          onChange={(e) => updateSetting('visualAlerts', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          {t('accessibility.features.textSpacing')}
                        </label>
                        <span className="text-sm text-gray-500">{settings.textSpacing ?? 1}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={settings.textSpacing ?? 1}
                        onChange={(e) => updateSetting('textSpacing', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        aria-valuemin={1}
                        aria-valuemax={5}
                        aria-valuenow={settings.textSpacing ?? 1}
                        aria-valuetext={`${t('accessibility.features.textSpacing')}: ${settings.textSpacing ?? 1}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Motriz */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CursorArrowRippleIcon className="h-5 w-5 mr-2" />
                    {t('accessibility.categories.motor')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('accessibility.features.keyboardNav')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!settings.keyboardNavigation}
                          onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('accessibility.features.largeButtons')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!settings.largeButtons}
                          onChange={(e) => updateSetting('largeButtons', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('accessibility.features.voiceControl')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!settings.voiceControl}
                          onChange={(e) => updateSetting('voiceControl', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('accessibility.features.blockAutoScroll')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!settings.blockAutoScroll}
                          onChange={(e) => updateSetting('blockAutoScroll', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={() => resetSettings()}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  {t('accessibility.actions.reset')}
                </button>
                <Menu.Button as="button" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {t('accessibility.actions.close')}
                </Menu.Button>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default AccessibilityMenuInline;

