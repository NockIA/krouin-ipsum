'use client';

import type { TransformOptions } from '@/lib/generator';

interface GeneratorFormProps {
  paragraphs: number;
  sentencesPerParagraph: number;
  seed: string;
  preset: 'hero' | 'card' | 'article' | 'short';
  charCount: string;
  transforms: TransformOptions;
  onParagraphsChange: (value: number) => void;
  onSentencesChange: (value: number) => void;
  onSeedChange: (value: string) => void;
  onPresetChange: (value: 'hero' | 'card' | 'article' | 'short') => void;
  onCharCountChange: (value: string) => void;
  onTransformChange: (key: keyof TransformOptions, value: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  labels: {
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
    presets: {
      hero: string;
      card: string;
      article: string;
      short: string;
    };
  };
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  paragraphs,
  sentencesPerParagraph,
  seed,
  preset,
  charCount,
  transforms,
  onParagraphsChange,
  onSentencesChange,
  onSeedChange,
  onPresetChange,
  onCharCountChange,
  onTransformChange,
  onGenerate,
  isLoading,
  labels,
}) => {
  const charCountActive = charCount !== '' && Number(charCount) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  const TRANSFORM_KEYS: Array<{ key: keyof TransformOptions; label: string }> = [
    { key: 'noSpaces',          label: labels.noSpaces },
    { key: 'uppercase',         label: labels.uppercase },
    { key: 'lowercase',         label: labels.lowercase },
    { key: 'capitalise',        label: labels.capitalise },
    { key: 'numbersOnly',       label: labels.numbersOnly },
    { key: 'removePunctuation', label: labels.removePunctuation },
    { key: 'removeAccents',     label: labels.removeAccents },
  ];

  return (
    <form onSubmit={handleSubmit} className="generator-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="preset" className="form-label">
            {labels.preset}
          </label>
          <select
            id="preset"
            value={preset}
            onChange={(e) => onPresetChange(e.target.value as 'hero' | 'card' | 'article' | 'short')}
            className="form-input"
          >
            <option value="hero">{labels.presets.hero}</option>
            <option value="card">{labels.presets.card}</option>
            <option value="article">{labels.presets.article}</option>
            <option value="short">{labels.presets.short}</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="seed" className="form-label">
            {labels.seed}
            <span className="form-label-hint"> — {labels.seedHint}</span>
          </label>
          <input
            type="text"
            id="seed"
            value={seed}
            onChange={(e) => onSeedChange(e.target.value)}
            className="form-input"
            placeholder={labels.seedPlaceholder}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="paragraphs" className="form-label" style={{ opacity: charCountActive ? 0.4 : 1 }}>
            {labels.paragraphs}
            <span className="form-label-hint"> (1-20)</span>
          </label>
          <input
            type="number"
            id="paragraphs"
            min={1}
            max={20}
            value={paragraphs}
            onChange={(e) => onParagraphsChange(Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))}
            className="form-input"
            disabled={charCountActive}
            style={{ opacity: charCountActive ? 0.4 : 1 }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="sentences" className="form-label" style={{ opacity: charCountActive ? 0.4 : 1 }}>
            {labels.sentences}
            <span className="form-label-hint"> (1-10)</span>
          </label>
          <input
            type="number"
            id="sentences"
            min={1}
            max={10}
            value={sentencesPerParagraph}
            onChange={(e) => onSentencesChange(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
            className="form-input"
            disabled={charCountActive}
            style={{ opacity: charCountActive ? 0.4 : 1 }}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="charCount" className="form-label">
            {labels.charCount}
            <span className="form-label-hint"> — {labels.charCountHint}</span>
          </label>
          <input
            type="number"
            id="charCount"
            min={1}
            max={10000}
            value={charCount}
            onChange={(e) => onCharCountChange(e.target.value)}
            className="form-input"
            placeholder={labels.charCountPlaceholder}
          />
        </div>
      </div>

      <div className="transforms-panel">
        <span className="transforms-title">{labels.transformsTitle}</span>
        <div className="transforms-grid">
          {TRANSFORM_KEYS.map(({ key, label }) => (
            <label key={key} htmlFor={`transform-${key}`} className="form-label form-label-checkbox">
              <input
                type="checkbox"
                id={`transform-${key}`}
                checked={!!transforms[key]}
                onChange={(e) => onTransformChange(key, e.target.checked)}
                className="form-checkbox"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? (
          <>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {labels.generating}
          </>
        ) : (
          <>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {labels.generate}
          </>
        )}
      </button>
    </form>
  );
}

export default GeneratorForm;
