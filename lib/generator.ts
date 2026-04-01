import sentences from '@/data/sentences.json';

export interface TransformOptions {
  noSpaces?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalise?: boolean;
  numbersOnly?: boolean;
  removePunctuation?: boolean;
  removeAccents?: boolean;
}

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

export function applyTransformations(text: string, opts: TransformOptions): string {
  let result = text;

  if (opts.removeAccents) {
    result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  if (opts.removePunctuation) {
    result = result.replace(/[^\w\s\n]/g, '');
  }
  if (opts.uppercase) {
    result = result.toUpperCase();
  }
  if (opts.lowercase) {
    result = result.toLowerCase();
  }
  if (opts.capitalise) {
    result = result.replace(/(?:^|[\s\n])\S/g, c => c.toUpperCase());
  }
  if (opts.noSpaces) {
    result = result.replace(/\s+/g, '');
  }
  if (opts.numbersOnly) {
    result = result.replace(/[^0-9]/g, '');
  }

  return result;
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
  transforms: TransformOptions = {}
) {
  const raw = generateText(paragraphCount, sentencesPerParagraph, seed);
  const text = applyTransformations(raw, transforms);
  const totalSentences = paragraphCount * sentencesPerParagraph;
  const hasSpaces = !transforms.noSpaces && !transforms.numbersOnly;

  return {
    text,
    stats: {
      paragraphs: paragraphCount as number | null,
      sentences: totalSentences as number | null,
      words: hasSpaces ? countWords(text) : 1,
      chars: null as null | number,
    },
  };
}

// Génère exactement N caractères
export function generateTextWithExactCharCount(
  charCount: number,
  seed?: string,
  transforms: TransformOptions = {}
) {
  const randomFn = createSeededRandom(seed);
  let accumulated = '';

  while (true) {
    const current = applyTransformations(accumulated, transforms);
    if (current.length >= charCount) break;
    if (accumulated.length > charCount * 200) break; // sécurité (ex: numbersOnly sur texte sans chiffres)
    const remaining = charCount - current.length;
    const batchSize = Math.max(1, Math.ceil(remaining / 60)) + 2;
    const batch = getRandomSentences(Math.min(batchSize, sentences.length), randomFn);
    for (const sentence of batch) {
      if (accumulated.length > 0) accumulated += ' ';
      accumulated += sentence;
    }
  }

  const text = applyTransformations(accumulated, transforms).slice(0, charCount);
  const hasSpaces = !transforms.noSpaces && !transforms.numbersOnly;

  return {
    text,
    stats: {
      paragraphs: null as null | number,
      sentences: null as null | number,
      words: hasSpaces ? countWords(text) : 1,
      chars: text.length,
    },
  };
}
