'use client';

import { useEffect } from 'react';
import { StudyMode } from '@/lib/types';

const modeKeys: Record<string, StudyMode> = {
  '1': 'chat',
  '2': 'flashcards',
  '3': 'quiz',
  '4': 'essay',
  '5': 'casebrief',
  '6': 'concept',
};

interface Props {
  onModeChange: (mode: StudyMode) => void;
}

export default function KeyboardShortcuts({ onModeChange }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd/Ctrl + number to switch modes
      if ((e.metaKey || e.ctrlKey) && modeKeys[e.key]) {
        e.preventDefault();
        onModeChange(modeKeys[e.key]);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onModeChange]);

  return null;
}
