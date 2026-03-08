'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = '' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <><Check className="w-3 h-3 text-green-500" /> Copied</>
      ) : (
        <><Copy className="w-3 h-3" /> Copy</>
      )}
    </button>
  );
}
