'use client';

import { User, Sparkles } from 'lucide-react';
import { renderMarkdown } from '@/lib/markdown';
import CopyButton from './CopyButton';

interface Props {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-[#73C2E1] text-white'
            : 'bg-gradient-to-br from-[#73C2E1] to-[#FDBB30] text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>
      <div className="group relative max-w-[80%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-[#73C2E1] text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm">{content}</p>
          ) : (
            <div
              className="prose dark:prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2 prose-a:text-[#73C2E1]"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
        </div>
        {!isUser && content && (
          <div className="absolute -bottom-1 right-0 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={content} />
          </div>
        )}
      </div>
    </div>
  );
}
