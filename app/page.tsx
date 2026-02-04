'use client';

import { useState } from 'react';
import GeneratorForm from '@/components/GeneratorForm';
import TextOutput from '@/components/TextOutput';
import ThemeToggle from '@/components/ThemeToggle';
import HermineLogo from '@/components/HermineLogo';

interface Stats {
  paragraphs: number;
  sentences: number;
  words: number;
}

const Home: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (paragraphs: number, sentencesPerParagraph: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paragraphs, sentencesPerParagraph }),
      });

      const result = await response.json();

      if (result.success) {
        setText(result.data.text);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container hermine-pattern">
      <header className="header">
        <div className="header-brand">
          <HermineLogo className="header-logo" />
          <div className='header-title-div'>
            <h1 className="header-title">Krouin Ipsum</h1>
            <span className="header-subtitle">Testenn-Loss e Brezhoneg</span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="main">
        <div className="hero">
          <div className="hero-badge">
            <span className="hero-badge-icon">⚓</span>
            <span>Evit an diorroerien</span>
          </div>
          <h2 className="hero-title">
            Générateur Lorem Ipsum Breton
            <span className="hero-title-breton">Ganer testenn-Loss Brezhonek</span>
          </h2>
          <p className="hero-description">
            Générez du faux texte en breton à partir d&apos;un corpus de 10 000 phrases
            issues de Wikipedia Brezhoneg. Parfait pour vos maquettes et projets web.
          </p>
        </div>

        <div className="card">
          <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        <TextOutput text={text} stats={stats} />

        <footer className="footer">
          <div className="footer-content">
            <p className="footer-text">
              Corpus : Leipzig Corpora Collection — Wikipedia Brezhoneg 2021
            </p>
            <p className="footer-text footer-breton">
              « Brezhoneg bev, brezhoneg frank »
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;