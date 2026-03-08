'use client';

import { useChat } from '@ai-sdk/react';
import { Loader2, Send } from 'lucide-react';
import { renderMarkdown } from '@/lib/markdown';

interface Props {
  context: string;
}

export default function EssayOutliner({ context }: Props) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { mode: 'essay', context },
    id: 'essay',
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-lg font-semibold">📝 Essay Outliner</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
              Enter your essay topic, prompt, or thesis and I&apos;ll generate a structured outline with key arguments and supporting points.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((m) => (
              <div key={m.id} className={`${m.role === 'user' ? 'text-right' : ''}`}>
                {m.role === 'user' ? (
                  <div className="inline-block bg-indigo-600 text-white rounded-2xl px-4 py-3 text-sm">
                    {m.content}
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-4">
                    <div
                      className="prose dark:prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Enter essay topic or thesis..."
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
