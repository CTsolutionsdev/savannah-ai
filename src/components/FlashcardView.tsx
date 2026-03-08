'use client';

import { useState, useCallback } from 'react';
import { Loader2, RotateCcw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Flashcard } from '@/lib/types';
import { showToast } from './Toast';

interface Props {
  context: string;
}

export default function FlashcardView({ context }: Props) {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const generate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 55000);

      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, context }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 429) {
        throw new Error('Too many requests — please wait a moment and try again.');
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
        throw new Error('No flashcards were generated. Try a different topic.');
      }

      setCards(data.flashcards);
      setCurrent(0);
      setFlipped(false);
      setRetryCount(0);
      showToast(`Generated ${data.flashcards.length} flashcards!`, 'success');
    } catch (e) {
      const msg = e instanceof Error
        ? e.name === 'AbortError' ? 'Request timed out. Please try again.' : e.message
        : 'Something went wrong';
      setError(msg);
      setRetryCount((r) => r + 1);
    } finally {
      setLoading(false);
    }
  }, [topic, context]);

  const shuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrent(0);
    setFlipped(false);
    showToast('Cards shuffled!', 'info');
  };

  const nav = (dir: number) => {
    setFlipped(false);
    setCurrent((prev) => Math.max(0, Math.min(cards.length - 1, prev + dir)));
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-lg font-semibold text-center">📇 Flashcard Generator</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Enter a topic and I&apos;ll create study flashcards
          </p>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && generate()}
            placeholder="e.g. Constitutional Law Amendments 1-10"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#73C2E1]"
            disabled={loading}
          />
          <button
            onClick={generate}
            disabled={loading || !topic.trim()}
            className="w-full py-3 bg-[#73C2E1] text-white rounded-xl hover:bg-[#4A9BBF] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating (this takes ~15s)...</>
            ) : retryCount > 0 ? (
              'Retry'
            ) : (
              'Generate Flashcards'
            )}
          </button>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 gap-6">
      <div className="text-sm text-gray-500">
        Card {current + 1} of {cards.length}
      </div>

      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full max-w-lg h-64 perspective-1000"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-[#73C2E1] to-[#4A9BBF] text-white p-8 flex flex-col items-center justify-center shadow-xl">
            <p className="text-xs uppercase tracking-wider mb-4 opacity-70">Question</p>
            <p className="text-lg font-medium text-center leading-relaxed">{cards[current].question}</p>
          </div>
          <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-2xl bg-gradient-to-br from-[#FDBB30] to-[#D4990A] text-gray-900 p-8 flex flex-col items-center justify-center shadow-xl">
            <p className="text-xs uppercase tracking-wider mb-4 opacity-70">Answer</p>
            <p className="text-base text-center leading-relaxed">{cards[current].answer}</p>
          </div>
        </div>
      </button>

      <p className="text-xs text-gray-400">Click card to flip · Arrow keys to navigate</p>

      <div className="flex items-center gap-4">
        <button onClick={() => nav(-1)} disabled={current === 0} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={shuffle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Shuffle">
          <Shuffle className="w-5 h-5" />
        </button>
        <button onClick={() => { setCards([]); setTopic(''); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="New set">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={() => nav(1)} disabled={current === cards.length - 1} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-1">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setFlipped(false); }}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-[#73C2E1]' : 'bg-gray-300 dark:bg-gray-700'}`}
          />
        ))}
      </div>
    </div>
  );
}
