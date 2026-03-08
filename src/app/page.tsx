'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import StudyModes from '@/components/StudyModes';
import ContextInput from '@/components/ContextInput';
import ChatInterface from '@/components/ChatInterface';
import FlashcardView from '@/components/FlashcardView';
import QuizView from '@/components/QuizView';
import EssayOutliner from '@/components/EssayOutliner';
import CaseBrief from '@/components/CaseBrief';
import ConceptExplainer from '@/components/ConceptExplainer';
import WelcomeScreen from '@/components/WelcomeScreen';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import ErrorBoundary from '@/components/ErrorBoundary';
import ToastContainer from '@/components/Toast';
import { StudyMode } from '@/lib/types';

export default function Home() {
  const [mode, setMode] = useState<StudyMode>('chat');
  const [context, setContext] = useState('');
  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);

  const renderMode = () => {
    switch (mode) {
      case 'chat': return <ChatInterface mode={mode} context={context} />;
      case 'flashcards': return <FlashcardView context={context} />;
      case 'quiz': return <QuizView context={context} />;
      case 'essay': return <EssayOutliner context={context} />;
      case 'casebrief': return <CaseBrief context={context} />;
      case 'concept': return <ConceptExplainer context={context} />;
      default: return <ChatInterface mode="chat" context={context} />;
    }
  };

  return (
    <>
      <WelcomeScreen onComplete={handleReady} />
      <KeyboardShortcuts onModeChange={setMode} />
      <ToastContainer />
      <div className={`flex flex-col h-screen transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <Header />
        <div className="max-w-5xl mx-auto w-full px-4 py-3 space-y-3">
          <StudyModes active={mode} onSelect={setMode} />
          <ContextInput context={context} onContextChange={setContext} />
        </div>
        <div className="flex-1 overflow-hidden max-w-5xl mx-auto w-full">
          <ErrorBoundary>
            {renderMode()}
          </ErrorBoundary>
        </div>
        <footer className="text-center py-3 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-900">
          Built with ❤️ by <a href="https://ctsolutions.dev" className="hover:text-[#73C2E1] transition-colors">CTSolutions.dev</a> · Go Jaguars 🐆 · <span className="text-gray-500">⌘1-6 to switch modes</span>
        </footer>
      </div>
    </>
  );
}
