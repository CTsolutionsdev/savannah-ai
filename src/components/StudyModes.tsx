'use client';

import { StudyMode } from '@/lib/types';
import {
  MessageSquare,
  Layers,
  HelpCircle,
  FileText,
  Scale,
  Lightbulb,
} from 'lucide-react';

const modes: { id: StudyMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" />, desc: 'General assistant' },
  { id: 'flashcards', label: 'Flashcards', icon: <Layers className="w-4 h-4" />, desc: 'Study cards' },
  { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" />, desc: 'Test yourself' },
  { id: 'essay', label: 'Essay', icon: <FileText className="w-4 h-4" />, desc: 'Outline builder' },
  { id: 'casebrief', label: 'Case Brief', icon: <Scale className="w-4 h-4" />, desc: 'IRAC analysis' },
  { id: 'concept', label: 'Explain', icon: <Lightbulb className="w-4 h-4" />, desc: 'Deep dive' },
];

interface Props {
  active: StudyMode;
  onSelect: (mode: StudyMode) => void;
}

export default function StudyModes({ active, onSelect }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            active === m.id
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
          <span className="sm:hidden">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
