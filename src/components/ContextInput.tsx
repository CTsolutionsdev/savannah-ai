'use client';

import { useState } from 'react';
import { FileText, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  context: string;
  onContextChange: (ctx: string) => void;
}

export default function ContextInput({ context, onContextChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FileText className="w-4 h-4" />
          <span>{context ? 'Context loaded' : 'Paste notes or readings'}</span>
          {context && (
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
              {context.length} chars
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {context && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContextChange('');
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {expanded && (
        <textarea
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          placeholder="Paste your notes, case text, readings, or any material you want the AI to reference..."
          className="w-full h-40 px-4 py-3 bg-white dark:bg-gray-950 text-sm resize-none focus:outline-none placeholder-gray-400"
        />
      )}
    </div>
  );
}
