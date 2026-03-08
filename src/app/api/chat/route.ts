import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { SYSTEM_PROMPTS } from '@/lib/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
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
}
