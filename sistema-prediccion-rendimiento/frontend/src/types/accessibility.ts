export interface AccessibilitySettings {
  // Visual settings
  textSize: number;
  fontType: string;
  highContrast: boolean;
  colorBlindMode: boolean;
  visualAlerts: boolean;
  textSpacing: number;
  linkHighlight: boolean;

  // Auditory settings
  textToSpeech: boolean;
  screenReader: boolean;
  audioControls: boolean;
  signLanguage: boolean;

  // Motor settings
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  largeButtons: boolean;
  customShortcuts: boolean;
  voiceControl: boolean;
  blockAutoScroll: boolean;
}