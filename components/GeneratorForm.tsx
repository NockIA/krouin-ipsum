'use client';

import { useState } from 'react';

interface GeneratorFormProps {
  onGenerate: (paragraphs: number, sentencesPerParagraph: number) => void;
  isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [paragraphs, setParagraphs] = useState(3);
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(paragraphs, sentencesPerParagraph);
  };

  return (
    <form onSubmit={handleSubmit} className="generator-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="paragraphs" className="form-label">
            Paragraphes
            <span className="form-label-hint"> (1-20)</span>
          </label>
          <input
            type="number"
            id="paragraphs"
            min={1}
            max={20}
            value={paragraphs}
            onChange={(e) => setParagraphs(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sentences" className="form-label">
            Phrases
            <span className="form-label-hint"> (1-10)</span>
          </label>
          <input
            type="number"
            id="sentences"
            min={1}
            max={10}
            value={sentencesPerParagraph}
            onChange={(e) => setSentencesPerParagraph(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
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
            O sevel...
          </>
        ) : (
          <>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Générer — Sevel
          </>
        )}
      </button>
    </form>
  );
}

export default GeneratorForm; 