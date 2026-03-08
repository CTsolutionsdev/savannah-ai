'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { renderMarkdown } from '@/lib/markdown';

interface Props {
  context: string;
}

export default function ConceptExplainer({ context }: Props) {
  const [depth, setDepth] = useState(3);
  const depthLabels = ['ELI5', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { mode: 'concept', context },
    id: 'concept',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    // Inject depth into body via a custom submit — handled server-side via body
    handleSubmit(e, { body: { mode: 'concept', context, depthLabel: depthLabels[depth - 1] } });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-lg font-semibold">💡 Concept Explainer</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
              Enter any concept and adjust the depth. I&apos;ll explain it from simple to expert level.
            </p>
            <div className="mt-6 w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Simple</span><span>Expert</span></div>
              <input type="range" min={1} max={5} value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full accent-indigo-600" />
              <p className="text-center text-sm mt-2 text-indigo-600 dark:text-indigo-400 font-medium">{depthLabels[depth - 1]}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((m) => (
              <div key={m.id} className={`${m.role === 'user' ? 'text-right' : ''}`}>
                {m.role === 'user' ? (
                  <div className="inline-block bg-indigo-600 text-white rounded-2xl px-4 py-3 text-sm">{m.content}</div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-4">
                    <div className="prose dark:prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="px-4 py-2 flex items-center justify-center gap-4 border-t border-gray-100 dark:border-gray-900">
          <span className="text-xs text-gray-500">Depth:</span>
          <input type="range" min={1} max={5} value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-32 accent-indigo-600" />
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium w-20">{depthLabels[depth - 1]}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input value={input} onChange={handleInputChange} placeholder="What concept should I explain?" className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading} />
          <button type="submit" disabled={isLoading || !input.trim()} className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
