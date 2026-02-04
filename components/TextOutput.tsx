'use client';

import { useState } from 'react';

interface Stats {
  paragraphs: number;
  sentences: number;
  words: number;
}

interface TextOutputProps {
  text: string;
  stats: Stats | null;
}

const TextOutput: React.FC<TextOutputProps> = ({ text, stats }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!text) {
    return (
      <div className="output-section">
        <div className="output-placeholder">
          <p className="output-placeholder-text">Le texte généré apparaîtra ici</p>
          <p className="output-placeholder-hint">An destenn savet a vo diskouezet amañ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="output-section fade-in">
      <div className="output-container">
        <div className="output-header">
          <span className="output-title">Texte — Testenn</span>
          <button
            onClick={handleCopy}
            className={`btn-copy ${copied ? 'btn-copy-success' : ''}`}
          >
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Eilet !
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copier — Eilañ
              </>
            )}
          </button>
        </div>

        <div className="output-wrapper">
          <textarea
            readOnly
            value={text}
            className="output-textarea"
          />
        </div>

        {stats && (
          <div className="stats">
            <div className="stat-item">
              <span className="stat-value">{stats.paragraphs}</span>
              <span className="stat-label">Paragraphe{stats.paragraphs > 1 ? 's' : ''}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.sentences}</span>
              <span className="stat-label">Phrase{stats.sentences > 1 ? 's' : ''}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.words}</span>
              <span className="stat-label">Mot{stats.words > 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextOutput;