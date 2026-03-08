import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SavannahAI — Your Study Assistant',
  description: 'AI-powered study assistant for academic excellence. Chat, flashcards, quizzes, essay outlines, case briefs, and concept explanations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
