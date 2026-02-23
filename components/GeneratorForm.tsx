'use client';

interface GeneratorFormProps {
  paragraphs: number;
  sentencesPerParagraph: number;
  seed: string;
  preset: 'hero' | 'card' | 'article' | 'short';
  onParagraphsChange: (value: number) => void;
  onSentencesChange: (value: number) => void;
  onSeedChange: (value: string) => void;
  onPresetChange: (value: 'hero' | 'card' | 'article' | 'short') => void;
  onGenerate: () => void;
  isLoading: boolean;
  labels: {
    preset: string;
    seed: string;
    seedHint: string;
    seedPlaceholder: string;
    paragraphs: string;
    sentences: string;
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
  onParagraphsChange,
  onSentencesChange,
  onSeedChange,
  onPresetChange,
  onGenerate,
  isLoading,
  labels,
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

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
          <label htmlFor="paragraphs" className="form-label">
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="sentences" className="form-label">
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
          />
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