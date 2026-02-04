import sentences from '@/data/sentences.json';

// Retourne N phrases aléatoires du corpus
export function getRandomSentences(count: number): string[] {
  const result: string[] = [];
  const availableSentences = [...sentences];

  for (let i = 0; i < count && availableSentences.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableSentences.length);
    result.push(availableSentences[randomIndex]);
    availableSentences.splice(randomIndex, 1);
  }

  return result;
}

// Compose un paragraphe avec N phrases
export function generateParagraph(sentenceCount: number): string {
  const selectedSentences = getRandomSentences(sentenceCount);
  return selectedSentences.join(' ');
}

// Génère le texte final avec N paragraphes de M phrases chacun
export function generateText(
  paragraphCount: number,
  sentencesPerParagraph: number
): string {
  const paragraphs: string[] = [];

  for (let i = 0; i < paragraphCount; i++) {
    paragraphs.push(generateParagraph(sentencesPerParagraph));
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
  sentencesPerParagraph: number
) {
  const text = generateText(paragraphCount, sentencesPerParagraph);
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
