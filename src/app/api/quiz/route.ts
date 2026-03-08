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

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: SYSTEM_PROMPTS.quiz,
      prompt: `Generate a quiz about: ${topic}${contextBlock}`,
    });

    let text = '';
    for await (const chunk of result.textStream) {
      text += chunk;
    }

    const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
    const questions = JSON.parse(cleaned);
    return Response.json({ questions });
  } catch (error) {
    console.error('Quiz generation error:', error);
    const message = error instanceof SyntaxError
      ? 'The AI response was not valid JSON. Please try again.'
      : 'Failed to generate quiz. Please try again.';
    return Response.json({ error: message }, { status: 500 });
  }
}
