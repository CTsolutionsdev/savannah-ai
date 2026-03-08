'use client';

import { useState, useCallback } from 'react';
import { Loader2, RotateCcw, Check, X, Trophy } from 'lucide-react';
import { QuizQuestion } from '@/lib/types';
import { showToast } from './Toast';

interface Props {
  context: string;
}

export default function QuizView({ context }: Props) {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const generate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 55000);

      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, context }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 429) {
        throw new Error('Too many requests — please wait a moment.');
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions generated. Try a different topic.');
      }

      setQuestions(data.questions);
      setCurrentQ(0);
      setSelected(null);
      setScore(0);
      setAnswered(0);
      setShowResult(false);
      setRetryCount(0);
      showToast(`Quiz ready — ${data.questions.length} questions!`, 'success');
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

  const selectAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswered((a) => a + 1);
    if (idx === questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setQuestions([]);
    setTopic('');
    setShowResult(false);
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-lg font-semibold text-center">❓ Quiz Mode</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Enter a topic and I&apos;ll generate a quiz
          </p>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && generate()}
            placeholder="e.g. Torts — Negligence elements"
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
            ) : retryCount > 0 ? 'Retry' : 'Start Quiz'}
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

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 gap-6">
        <Trophy className={`w-16 h-16 ${pct >= 80 ? 'text-[#FDBB30]' : pct >= 60 ? 'text-gray-400' : 'text-gray-300'}`} />
        <div className="text-center">
          <p className="text-5xl font-bold bg-gradient-to-r from-[#73C2E1] to-[#FDBB30] bg-clip-text text-transparent">
            {pct}%
          </p>
          <p className="text-lg mt-2">
            {score} out of {questions.length} correct
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {pct >= 90 ? '🔥 Outstanding! You crushed it!' : pct >= 80 ? '🎯 Excellent work!' : pct >= 60 ? '👍 Good job! Keep studying!' : '📚 Keep at it — you\'re learning!'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setCurrentQ(0); setSelected(null); setScore(0); setAnswered(0); setShowResult(false); }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-[#73C2E1] text-white rounded-xl hover:bg-[#4A9BBF] transition-colors"
          >
            New Topic
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 gap-6">
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>Question {currentQ + 1} of {questions.length}</span>
        <span className="text-[#73C2E1] font-medium">Score: {score}/{answered}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#73C2E1] transition-all duration-500"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="w-full max-w-lg space-y-4">
        <p className="text-lg font-medium text-center">{q.question}</p>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-transparent';
            if (selected !== null) {
              if (i === q.correctIndex) style = 'bg-green-50 dark:bg-green-900/20 border-green-500';
              else if (i === selected) style = 'bg-red-50 dark:bg-red-900/20 border-red-500';
              else style = 'bg-gray-100 dark:bg-gray-800 border-transparent opacity-50';
            }

            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                disabled={selected !== null}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${style}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                  {selected !== null && i === q.correctIndex && <Check className="w-4 h-4 text-green-600" />}
                  {selected !== null && i === selected && i !== q.correctIndex && <X className="w-4 h-4 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="bg-[#73C2E1]/10 dark:bg-[#73C2E1]/5 rounded-xl p-4 text-sm animate-in fade-in duration-300">
            <p className="font-medium text-[#4A9BBF]">💡 Explanation:</p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{q.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button
            onClick={next}
            className="w-full py-3 bg-[#73C2E1] text-white rounded-xl hover:bg-[#4A9BBF] transition-colors font-medium"
          >
            {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
          </button>
        )}
      </div>
    </div>
  );
}
