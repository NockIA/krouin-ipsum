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
  seed?: string
) {
  const text = generateText(paragraphCount, sentencesPerParagraph, seed);
  const totalSentences = paragraphCount * sentencesPerParagraph;
  const words = countWords(text);

  return {
    text,
    stats: {
      paragraphs: paragraphCount,
      sentences: totalSentences,
      words,
    },
  };
}
