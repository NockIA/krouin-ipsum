import sentences from '@/data/sentences.json';

function seedToInt(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed?: string): () => number {
  if (!seed) {
    return () => Math.random();
  }

  let state = seedToInt(seed);
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Retourne N phrases aléatoires du corpus
export function getRandomSentences(count: number, randomFn: () => number): string[] {
  const result: string[] = [];
  const availableSentences = [...sentences];

  for (let i = 0; i < count && availableSentences.length > 0; i++) {
    const randomIndex = Math.floor(randomFn() * availableSentences.length);
    result.push(availableSentences[randomIndex]);
    availableSentences.splice(randomIndex, 1);
  }

  return result;
}

// Compose un paragraphe avec N phrases
export function generateParagraph(sentenceCount: number, randomFn: () => number): string {
  const selectedSentences = getRandomSentences(sentenceCount, randomFn);
  return selectedSentences.join(' ');
}

// Génère le texte final avec N paragraphes de M phrases chacun
export function generateText(
  paragraphCount: number,
  sentencesPerParagraph: number,
  seed?: string
): string {
  const paragraphs: string[] = [];
  const randomFn = createSeededRandom(seed);

  for (let i = 0; i < paragraphCount; i++) {
    paragraphs.push(generateParagraph(sentencesPerParagraph, randomFn));
  }

  return paragraphs.join('\n\n');
}

// Compte le nombre de mots dans un texte
export function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Génère le texte avec statistiques
export function generateTextWithStats(
  paragraphCount: number,
  sentencesPerParagraph: number,
  seed?: string,
  noSpaces = false
) {
  let text = generateText(paragraphCount, sentencesPerParagraph, seed);
  if (noSpaces) text = text.replace(/\s+/g, '');
  const totalSentences = paragraphCount * sentencesPerParagraph;
  const words = noSpaces ? null : countWords(text);

  return {
    text,
    stats: {
      paragraphs: paragraphCount as number | null,
      sentences: totalSentences as number | null,
      words,
      chars: null as null | number,
    },
  };
}

// Génère exactement N caractères
export function generateTextWithExactCharCount(charCount: number, seed?: string, noSpaces = false) {
  const randomFn = createSeededRandom(seed);
  let accumulated = '';

  while (true) {
    const current = noSpaces ? accumulated.replace(/\s+/g, '') : accumulated;
    if (current.length >= charCount) break;
    const remaining = charCount - current.length;
    const batchSize = Math.max(1, Math.ceil(remaining / (noSpaces ? 65 : 80)));
    const batch = getRandomSentences(Math.min(batchSize + 2, sentences.length), randomFn);
    for (const sentence of batch) {
      if (accumulated.length > 0) accumulated += ' ';
      accumulated += sentence;
    }
  }

  const text = (noSpaces ? accumulated.replace(/\s+/g, '') : accumulated).slice(0, charCount);

  return {
    text,
    stats: {
      paragraphs: null as null | number,
      sentences: null as null | number,
      words: noSpaces ? null : countWords(text),
      chars: text.length,
    },
  };
}
