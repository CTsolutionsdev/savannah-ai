'use client';

import { useState, useEffect, useCallback } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { addStudyTime } from '@/lib/storage';

export default function StudyTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const toggle = useCallback(() => {
    if (running) {
      // Pausing — save time
      addStudyTime(Math.floor(seconds / 60));
    }
    setRunning(!running);
  }, [running, seconds]);

  const reset = () => {
    if (seconds > 0) addStudyTime(Math.floor(seconds / 60));
    setSeconds(0);
    setRunning(false);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  if (!showTimer) {
    return (
      <button
        onClick={() => setShowTimer(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
        title="Study Timer"
      >
        <Timer className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
      <span className={`text-sm font-mono tabular-nums ${running ? 'text-[#73C2E1]' : 'text-gray-500'}`}>
        {formatTime(seconds)}
      </span>
      <button onClick={toggle} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
        {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
      <button onClick={reset} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
