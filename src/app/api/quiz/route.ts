import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { SYSTEM_PROMPTS } from '@/lib/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { topic, context = '' } = await req.json();

  const contextBlock = context
    ? `\n\nStudent's notes for context:\n${context}`
    : '';

  try {
    const { text } = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: SYSTEM_PROMPTS.quiz,
      prompt: `Generate a quiz about: ${topic}${contextBlock}`,
    });

    const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
    const questions = JSON.parse(cleaned);
    return Response.json({ questions });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return Response.json(
      { error: 'Failed to generate quiz. Please try again.' },
      { status: 500 }
    );
  }
}
