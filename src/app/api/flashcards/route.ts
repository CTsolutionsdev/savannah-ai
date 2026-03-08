import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { SYSTEM_PROMPTS } from '@/lib/prompts';
import { rateLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

export const maxDuration = 60;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const { ok } = rateLimit(ip);
  if (!ok) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { topic, context = '' } = await req.json();

    const contextBlock = context
      ? `\n\nStudent's notes for context:\n${context}`
      : '';

    // Use streaming to avoid timeout — collect full response then parse
    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: SYSTEM_PROMPTS.flashcards,
      prompt: `Generate flashcards for: ${topic}${contextBlock}`,
    });

    // Collect the full stream
    let text = '';
    for await (const chunk of result.textStream) {
      text += chunk;
    }

    const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
    const flashcards = JSON.parse(cleaned);
    return Response.json({ flashcards });
  } catch (error) {
    console.error('Flashcard generation error:', error);
    const message = error instanceof SyntaxError
      ? 'The AI response was not valid JSON. Please try again.'
      : 'Failed to generate flashcards. Please try again.';
    return Response.json({ error: message }, { status: 500 });
  }
}
