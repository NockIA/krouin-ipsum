'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

interface ThemeToggleProps {
  labels: {
    toLight: string;
    toDark: string;
  };
}

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return stored === 'dark' || (!stored && prefersDark);
};

const useHydrated = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ labels }) => {
  const hydrated = useHydrated();
  const [isDark, setIsDark] = useState(getInitialDarkMode);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [hydrated, isDark]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
  };

  if (!hydrated) {
    return <div className="theme-toggle-placeholder" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={isDark ? labels.toLight : labels.toDark}
      title={isDark ? labels.toLight : labels.toDark}
    >
      {isDark ? (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;