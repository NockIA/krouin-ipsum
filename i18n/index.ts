import { br } from './br';
import { fr } from './fr';
import type { UiLanguage, UiLabels } from './types';

export type { UiLanguage, UiLabels };

export const i18n: Record<UiLanguage, UiLabels> = {
  fr,
  br,
};
