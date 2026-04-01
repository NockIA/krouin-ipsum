export type UiLanguage = 'fr' | 'br';

export interface UiLabels {
  subtitle: string;
  badge: string;
  heroTitle: string;
  heroTitleBr: string;
  heroDescription: string;
  langToggle: string;
  generateError: string;
  themeDark: string;
  themeLight: string;
  form: {
    preset: string;
    seed: string;
    seedHint: string;
    seedPlaceholder: string;
    paragraphs: string;
    sentences: string;
    charCount: string;
    charCountHint: string;
    charCountPlaceholder: string;
    transformsTitle: string;
    noSpaces: string;
    uppercase: string;
    lowercase: string;
    capitalise: string;
    numbersOnly: string;
    removePunctuation: string;
    removeAccents: string;
    generate: string;
    generating: string;
  };
  presets: {
    hero: string;
    card: string;
    article: string;
    short: string;
  };
  output: {
    title: string;
    copy: string;
    copied: string;
    copyError: string;
    emptyTitle: string;
    emptyHint: string;
    statsParagraph: string;
    statsSentence: string;
    statsWord: string;
    statsChar: string;
    export: string;
    exportFormat: string;
    exportFile: string;
  };
}
