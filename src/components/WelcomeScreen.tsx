'use client';

import { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Layers, HelpCircle, FileText, Scale, Lightbulb, ArrowRight } from 'lucide-react';
import { getStorage, setStorage } from '@/lib/storage';

interface Props {
  onComplete: () => void;
}

const features = [
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Chat', desc: 'Ask anything — any subject, any time' },
  { icon: <Layers className="w-5 h-5" />, label: 'Flashcards', desc: 'Generate interactive study cards' },
  { icon: <HelpCircle className="w-5 h-5" />, label: 'Quiz', desc: 'Test yourself with AI-generated quizzes' },
  { icon: <FileText className="w-5 h-5" />, label: 'Essay', desc: 'Build structured essay outlines' },
  { icon: <Scale className="w-5 h-5" />, label: 'Case Brief', desc: 'IRAC analysis for law school' },
  { icon: <Lightbulb className="w-5 h-5" />, label: 'Explain', desc: 'Deep-dive concepts at any depth' },
];

export default function WelcomeScreen({ onComplete }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const data = getStorage();
    if (!data.hasOnboarded) {
      setShow(true);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleStart = () => {
    setStorage({ hasOnboarded: true });
    setShow(false);
    onComplete();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8 animate-in fade-in duration-700">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#73C2E1] to-[#FDBB30] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Hey Savannah ✨
          </h1>
          <p className="text-gray-400 text-lg">
            Welcome to your personal AI study assistant.<br/>
            Built just for you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          {features.map((f) => (
            <div key={f.label} className="bg-gray-900 rounded-xl p-3 flex items-start gap-3">
              <div className="text-[#73C2E1] mt-0.5">{f.icon}</div>
              <div>
                <p className="text-sm font-medium text-white">{f.label}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#73C2E1] to-[#4A9BBF] text-white rounded-xl font-medium hover:opacity-90 transition-opacity text-lg"
        >
          Let&apos;s Study <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-gray-600">
          Southern University Law Center 🐆
        </p>
      </div>
    </div>
  );
}
