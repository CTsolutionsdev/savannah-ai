'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toast: Toast) => void)[] = [];

export function showToast(message: string, type: ToastType = 'info') {
  const toast: Toast = { id: Date.now().toString(), message, type };
  toastListeners.forEach((fn) => fn(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 5000);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== addToast);
    };
  }, [addToast]);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-[#73C2E1]" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-bottom-4 duration-300 max-w-sm"
        >
          {icons[toast.type]}
          <p className="text-sm flex-1">{toast.message}</p>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
