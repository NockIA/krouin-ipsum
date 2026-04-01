'use client';

import { useState } from 'react';

interface Stats {
  paragraphs: number | null;
  sentences: number | null;
  words: number;
  chars: number | null;
}

interface TextOutputProps {
  text: string;
  stats: Stats | null;
  language: 'fr' | 'br';
  labels: {
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

const TextOutput: React.FC<TextOutputProps> = ({ text, stats, language, labels }) => {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [exportFormat, setExportFormat] = useState<'txt' | 'md' | 'json' | 'html'>('txt');

  const paragraphs = text
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const safeJson = () => JSON.stringify({
    success: true,
    data: {
      text,
      stats,
    },
  }, null, 2);

  const safeHtml = () => {
    const escaped = paragraphs.map((paragraph) =>
      paragraph
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
    );

    return `<main>${escaped.map((paragraph) => `<p>${paragraph}</p>`).join('')}</main>`;
  };

  const safeMarkdown = () => paragraphs.join('\n\n');

  const buildExportContent = () => {
    if (exportFormat === 'md') return safeMarkdown();
    if (exportFormat === 'json') return safeJson();
    if (exportFormat === 'html') return safeHtml();
    return text;
  };

  const handleDownload = () => {
    const content = buildExportContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `goelo-gen.${exportFormat}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 2000);
    }
  };

  if (!text) {
    return (
      <div className="output-section">
        <div className="output-placeholder">
          <p className="output-placeholder-text">{labels.emptyTitle}</p>
          <p className="output-placeholder-hint">{labels.emptyHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="output-section fade-in">
      <div className="output-container">
        <div className="output-header">
          <span className="output-title">{labels.title}</span>
          <div className="output-actions">
            <label className="output-format-label" htmlFor="export-format">
              {labels.exportFormat}
            </label>
            <select
              id="export-format"
              className="form-input output-format-select"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'txt' | 'md' | 'json' | 'html')}
            >
              <option value="txt">TXT</option>
              <option value="md">Markdown</option>
              <option value="json">JSON</option>
              <option value="html">HTML</option>
            </select>

            <button onClick={handleDownload} className="btn-copy" type="button">
              {labels.exportFile}
            </button>

            <button
              onClick={handleCopy}
              className={`btn-copy ${copied ? 'btn-copy-success' : ''} ${copyFailed ? 'btn-copy-error' : ''}`}
              type="button"
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {labels.copied}
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  {copyFailed ? labels.copyError : labels.copy}
                </>
              )}
            </button>
          </div>
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
            {stats.chars != null ? (
              <div className="stat-item">
                <span className="stat-value">{stats.chars}</span>
                <span className="stat-label">{labels.statsChar}{stats.chars > 1 && language === 'fr' ? 's' : ''}</span>
              </div>
            ) : (
              <>
                <div className="stat-item">
                  <span className="stat-value">{stats.paragraphs}</span>
                  <span className="stat-label">{labels.statsParagraph}{stats.paragraphs != null && stats.paragraphs > 1 && language === 'fr' ? 's' : ''}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.sentences}</span>
                  <span className="stat-label">{labels.statsSentence}{stats.sentences != null && stats.sentences > 1 && language === 'fr' ? 's' : ''}</span>
                </div>
              </>
            )}
            <div className="stat-item">
              <span className="stat-value">{stats.words}</span>
              <span className="stat-label">{labels.statsWord}{stats.words > 1 && language === 'fr' ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextOutput;