import { NextRequest, NextResponse } from 'next/server';
import { generateTextWithStats } from '@/lib/generator';

interface GenerateRequest {
  paragraphs?: number;
  sentencesPerParagraph?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    // Valeurs par défaut et validation
    let paragraphs = body.paragraphs ?? 3;
    let sentencesPerParagraph = body.sentencesPerParagraph ?? 5;

    // Limites
    paragraphs = Math.max(1, Math.min(20, paragraphs));
    sentencesPerParagraph = Math.max(1, Math.min(10, sentencesPerParagraph));

    const result = generateTextWithStats(paragraphs, sentencesPerParagraph);

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

  let paragraphs = parseInt(searchParams.get('paragraphs') ?? '3', 10);
  let sentencesPerParagraph = parseInt(searchParams.get('sentencesPerParagraph') ?? '5', 10);

  // Limites
  paragraphs = Math.max(1, Math.min(20, paragraphs));
  sentencesPerParagraph = Math.max(1, Math.min(10, sentencesPerParagraph));

  const result = generateTextWithStats(paragraphs, sentencesPerParagraph);

  return NextResponse.json({
    success: true,
    data: result,
  });
}
