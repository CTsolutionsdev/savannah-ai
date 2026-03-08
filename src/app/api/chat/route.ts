import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { SYSTEM_PROMPTS } from '@/lib/prompts';
import { rateLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

export const maxDuration = 60;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  // Rate limiting
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const { ok } = rateLimit(ip);
  if (!ok) {
    return new Response('Too many requests. Please wait a moment.', { status: 429 });
  }

  try {
    const { messages, mode = 'chat', context = '' } = await req.json();

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat;
    const contextBlock = context
      ? `\n\n--- Student's Notes/Context ---\n${context}\n--- End Context ---`
      : '';

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt + contextBlock,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
