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
      system: SYSTEM_PROMPTS.flashcards,
      prompt: `Generate flashcards for: ${topic}${contextBlock}`,
    });

    const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
    const flashcards = JSON.parse(cleaned);
    return Response.json({ flashcards });
  } catch (error) {
    console.error('Flashcard generation error:', error);
    return Response.json(
      { error: 'Failed to generate flashcards. Please try again.' },
      { status: 500 }
    );
  }
}
