'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { StudyMode } from '@/lib/types';

interface Props {
  mode: StudyMode;
  context: string;
}

export default function ChatInterface({ mode, context }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { mode, context },
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [mode, setMessages]);

  const placeholders: Record<StudyMode, string> = {
    chat: 'Ask me anything...',
    flashcards: 'Enter a topic for flashcards...',
    quiz: 'Enter a topic for a quiz...',
    essay: 'Enter your essay topic or thesis...',
    casebrief: 'Paste a case or enter a case name...',
    concept: 'What concept should I explain?',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
            <p className="text-4xl mb-3">🐆</p>
            <p className="text-lg font-medium">Ready to study, Savannah ✨</p>
            <p className="text-sm mt-1">Ask a question or pick a study mode above</p>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} role={m.role as 'user' | 'assistant'} content={m.content} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#73C2E1] to-[#FDBB30] flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={placeholders[mode]}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#73C2E1] placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-[#73C2E1] text-white rounded-xl hover:bg-[#4A9BBF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
