'use client';

import { Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import StudyTimer from './StudyTimer';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#73C2E1] to-[#FDBB30] flex items-center justify-center shadow-md shadow-[#73C2E1]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#73C2E1] to-[#4A9BBF] bg-clip-text text-transparent leading-tight">
              SavannahAI
            </h1>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 -mt-0.5 tracking-wider uppercase font-medium">Southern University Law Center</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StudyTimer />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
