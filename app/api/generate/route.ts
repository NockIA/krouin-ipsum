import { NextRequest, NextResponse } from 'next/server';
import { generateTextWithStats, generateTextWithExactCharCount } from '@/lib/generator';

interface GenerateRequest {
  paragraphs?: number;
  sentencesPerParagraph?: number;
  seed?: string;
  charCount?: number;
  noSpaces?: boolean;
}

const parseBoundedNumber = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(parsed)));
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    const paragraphs = parseBoundedNumber(body.paragraphs, 3, 1, 20);
    const sentencesPerParagraph = parseBoundedNumber(body.sentencesPerParagraph, 5, 1, 10);
    const seed = typeof body.seed === 'string' ? body.seed.trim() : undefined;
    const charCount = body.charCount != null ? parseBoundedNumber(body.charCount, 0, 1, 10000) : 0;
    const noSpaces = body.noSpaces === true;

    const result = charCount > 0
      ? generateTextWithExactCharCount(charCount, seed, noSpaces)
      : generateTextWithStats(paragraphs, sentencesPerParagraph, seed, noSpaces);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body',
      },
      { status: 400 }
    );
  }
}

// Support GET pour faciliter les tests
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const paragraphs = parseBoundedNumber(searchParams.get('paragraphs'), 3, 1, 20);
  const sentencesPerParagraph = parseBoundedNumber(searchParams.get('sentencesPerParagraph'), 5, 1, 10);
  const seed = searchParams.get('seed')?.trim() || undefined;
  const charCount = searchParams.get('charCount') != null ? parseBoundedNumber(searchParams.get('charCount'), 0, 1, 10000) : 0;
  const noSpaces = searchParams.get('noSpaces') === 'true';

  const result = charCount > 0
    ? generateTextWithExactCharCount(charCount, seed, noSpaces)
    : generateTextWithStats(paragraphs, sentencesPerParagraph, seed, noSpaces);

  return NextResponse.json({
    success: true,
    data: result,
  });
}
