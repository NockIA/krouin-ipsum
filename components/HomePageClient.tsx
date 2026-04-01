'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GeneratorForm from '@/components/GeneratorForm';
import TextOutput from '@/components/TextOutput';
import ThemeToggle from '@/components/ThemeToggle';
import HermineLogo from '@/components/HermineLogo';
import { i18n, type UiLanguage } from '@/i18n';
import type { TransformOptions } from '@/lib/generator';

interface Stats {
  paragraphs: number | null;
  sentences: number | null;
  words: number;
  chars: number | null;
}

interface HomePageClientProps {
  initialLanguage: UiLanguage;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const PRESET_CONFIG = {
  hero: { paragraphs: 1, sentencesPerParagraph: 3 },
  card: { paragraphs: 2, sentencesPerParagraph: 3 },
  article: { paragraphs: 4, sentencesPerParagraph: 6 },
  short: { paragraphs: 1, sentencesPerParagraph: 2 },
} as const;

const HomePageClient: React.FC<HomePageClientProps> = ({ initialLanguage }) => {
  const router = useRouter();
  const language = initialLanguage;
  const [text, setText] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paragraphs, setParagraphs] = useState(3);
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(5);
  const [seed, setSeed] = useState('');
  const [preset, setPreset] = useState<keyof typeof PRESET_CONFIG>('card');
  const [charCount, setCharCount] = useState('');
  const [transforms, setTransforms] = useState<TransformOptions>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParagraphs = parseInt(params.get('paragraphs') ?? '3', 10);
    const urlSentences = parseInt(params.get('sentences') ?? '5', 10);
    const urlSeed = params.get('seed') ?? '';
    const urlPreset = params.get('preset');
    const urlCharCount = params.get('charCount') ?? '';

    setParagraphs(clamp(Number.isNaN(urlParagraphs) ? 3 : urlParagraphs, 1, 20));
    setSentencesPerParagraph(clamp(Number.isNaN(urlSentences) ? 5 : urlSentences, 1, 10));
    setSeed(urlSeed);
    setCharCount(urlCharCount);

    if (urlPreset && (Object.keys(PRESET_CONFIG) as Array<keyof typeof PRESET_CONFIG>).includes(urlPreset as keyof typeof PRESET_CONFIG)) {
      setPreset(urlPreset as keyof typeof PRESET_CONFIG);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const params = new URLSearchParams();
    if (paragraphs !== 3) params.set('paragraphs', String(paragraphs));
    if (sentencesPerParagraph !== 5) params.set('sentences', String(sentencesPerParagraph));
    if (seed.trim()) params.set('seed', seed.trim());
    if (preset !== 'card') params.set('preset', preset);
    if (charCount.trim()) params.set('charCount', charCount.trim());

    const query = params.toString();
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, '', nextUrl);
  }, [isReady, paragraphs, sentencesPerParagraph, seed, preset, charCount]);

  const handleLanguageToggle = () => {
    const nextLanguage: UiLanguage = language === 'fr' ? 'br' : 'fr';
    const query = window.location.search;
    router.replace(`/${nextLanguage}${query}`);
  };

  const handleReset = () => {
    setParagraphs(3);
    setSentencesPerParagraph(5);
    setSeed('');
    setPreset('card');
    setCharCount('');
    setTransforms({});
  };

  const handlePresetChange = (value: keyof typeof PRESET_CONFIG) => {
    setPreset(value);
    const config = PRESET_CONFIG[value];
    setParagraphs(config.paragraphs);
    setSentencesPerParagraph(config.sentencesPerParagraph);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paragraphs,
          sentencesPerParagraph,
          seed: seed.trim() || undefined,
          charCount: charCount.trim() ? Number(charCount) : undefined,
          transforms,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setText(result.data.text);
        setStats(result.data.stats);
      } else {
        setError(i18n[language].generateError);
      }
    } catch (requestError) {
      console.error('Erreur lors de la génération:', requestError);
      setError(i18n[language].generateError);
    } finally {
      setIsLoading(false);
    }
  };

  const labels = i18n[language];

  return (
    <div className="page-container hermine-pattern">
      <header className="header">
        <div className="header-brand">
          <HermineLogo className="header-logo" />
          <div className='header-title-div'>
            <h1 className="header-title">Krouin Ipsum</h1>
            <span className="header-subtitle">{labels.subtitle}</span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={handleLanguageToggle}
            aria-label={labels.langToggle}
            title={labels.langToggle}
          >
            {language.toUpperCase()}
          </button>
          <ThemeToggle labels={{ toDark: labels.themeDark, toLight: labels.themeLight }} />
        </div>
      </header>

      <main className="main">
        <div className="hero">
          <div className="hero-badge">
            <span className="hero-badge-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 13.5L5 17l3.5 3.5M15.5 13.5L19 17l-3.5 3.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 9L10.5 20" />
              </svg>
            </span>
            <span>{labels.badge}</span>
          </div>
          <h2 className="hero-title">
            {labels.heroTitle}
            <span className="hero-title-breton">{labels.heroTitleBr}</span>
          </h2>
          <p className="hero-description">{labels.heroDescription}</p>
        </div>

        <div className="card">
          <GeneratorForm
            paragraphs={paragraphs}
            sentencesPerParagraph={sentencesPerParagraph}
            seed={seed}
            preset={preset}
            charCount={charCount}
            transforms={transforms}
            onParagraphsChange={setParagraphs}
            onSentencesChange={setSentencesPerParagraph}
            onSeedChange={setSeed}
            onPresetChange={handlePresetChange}
            onCharCountChange={setCharCount}
            onTransformChange={(key, value) => setTransforms(prev => ({ ...prev, [key]: value }))}
            onReset={handleReset}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            labels={{
              ...labels.form,
              presets: labels.presets,
            }}
          />
        </div>

        {error && (
          <div className="status-banner status-error" role="alert">
            {error}
          </div>
        )}

        <TextOutput
          text={text}
          stats={stats}
          language={language}
          labels={labels.output}
        />

        <footer className="footer">
          <div className="footer-content">
            <p className="footer-text">
              Corpus : Leipzig Corpora Collection — Wikipedia Brezhoneg 2021
            </p>
            <p className="footer-text footer-breton">
              « Brezhoneg bev, brezhoneg frank »
            </p>
            <p className="footer-text">© {new Date().getFullYear()} NockIA</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePageClient;
