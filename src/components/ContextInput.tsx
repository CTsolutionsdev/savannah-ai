'use client';

import { useState, useRef, useCallback } from 'react';
import { FileText, X, ChevronDown, ChevronUp, Upload, File } from 'lucide-react';

interface Props {
  context: string;
  onContextChange: (ctx: string) => void;
}

export default function ContextInput({ context, onContextChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const text = await file.text();
      onContextChange(context ? context + '\n\n---\n\n' + text : text);
    } else if (file.type === 'application/pdf') {
      // PDF text extraction would need a library — for now, show a message
      onContextChange(context + '\n\n[PDF uploaded: ' + file.name + ' — paste the text content for best results]');
    } else {
      const text = await file.text();
      onContextChange(context ? context + '\n\n---\n\n' + text : text);
    }
    setExpanded(true);
  }, [context, onContextChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-colors ${
        dragOver
          ? 'border-[#73C2E1] bg-[#73C2E1]/5'
          : 'border-gray-200 dark:border-gray-800'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FileText className="w-4 h-4" />
          <span>{context ? 'Context loaded' : 'Add notes, readings, or files'}</span>
          {context && (
            <span className="text-xs bg-[#73C2E1]/10 text-[#4A9BBF] dark:text-[#73C2E1] px-2 py-0.5 rounded-full font-medium">
              {context.length.toLocaleString()} chars
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {context && (
            <button
              onClick={(e) => { e.stopPropagation(); onContextChange(''); }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {expanded && (
        <div className="relative">
          <textarea
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="Paste your notes, case text, readings, or any material you want the AI to reference..."
            className="w-full h-40 px-4 py-3 bg-white dark:bg-gray-950 text-sm resize-none focus:outline-none placeholder-gray-400"
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.doc,.docx" className="hidden" onChange={handleFileInput} />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Upload file
            </button>
          </div>
          {dragOver && (
            <div className="absolute inset-0 bg-[#73C2E1]/10 flex items-center justify-center rounded-b-xl">
              <div className="flex items-center gap-2 text-[#4A9BBF] font-medium">
                <File className="w-5 h-5" /> Drop file here
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
