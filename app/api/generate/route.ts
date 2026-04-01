import { NextRequest, NextResponse } from 'next/server';
import { generateTextWithStats, generateTextWithExactCharCount, type TransformOptions } from '@/lib/generator';

interface GenerateRequest {
  paragraphs?: number;
  sentencesPerParagraph?: number;
  seed?: string;
  charCount?: number;
  transforms?: TransformOptions;
}

const parseBoundedNumber = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(parsed)));
};

const parseTransforms = (raw: unknown): TransformOptions => {
  if (!raw || typeof raw !== 'object') return {};
  const t = raw as Record<string, unknown>;
  return {
    noSpaces:          t.noSpaces === true,
    uppercase:         t.uppercase === true,
    lowercase:         t.lowercase === true,
    capitalise:        t.capitalise === true,
    numbersOnly:       t.numbersOnly === true,
    removePunctuation: t.removePunctuation === true,
    removeAccents:     t.removeAccents === true,
  };
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    const paragraphs = parseBoundedNumber(body.paragraphs, 3, 1, 20);
    const sentencesPerParagraph = parseBoundedNumber(body.sentencesPerParagraph, 5, 1, 10);
    const seed = typeof body.seed === 'string' ? body.seed.trim() : undefined;
    const charCount = body.charCount != null ? parseBoundedNumber(body.charCount, 0, 1, 10000) : 0;
    const transforms = parseTransforms(body.transforms);

    const result = charCount > 0
      ? generateTextWithExactCharCount(charCount, seed, transforms)
      : generateTextWithStats(paragraphs, sentencesPerParagraph, seed, transforms);

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
  const transforms: TransformOptions = {
    noSpaces:          searchParams.get('noSpaces') === 'true',
    uppercase:         searchParams.get('uppercase') === 'true',
    lowercase:         searchParams.get('lowercase') === 'true',
    capitalise:        searchParams.get('capitalise') === 'true',
    numbersOnly:       searchParams.get('numbersOnly') === 'true',
    removePunctuation: searchParams.get('removePunctuation') === 'true',
    removeAccents:     searchParams.get('removeAccents') === 'true',
  };

  const result = charCount > 0
    ? generateTextWithExactCharCount(charCount, seed, transforms)
    : generateTextWithStats(paragraphs, sentencesPerParagraph, seed, transforms);

  return NextResponse.json({
    success: true,
    data: result,
  });
}
