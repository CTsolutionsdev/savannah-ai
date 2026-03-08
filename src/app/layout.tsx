import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'SavannahAI — Study Assistant | SULC',
  description: 'AI-powered study assistant for Southern University Law Center. Chat, flashcards, quizzes, essay outlines, IRAC case briefs, and concept explanations.',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/icon-192.png' },
  openGraph: {
    title: 'SavannahAI — Your AI Study Assistant',
    description: 'Chat, flashcards, quizzes, case briefs, and more. Built for Southern University Law Center.',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SavannahAI',
  },
};

export const viewport: Viewport = {
  themeColor: '#73C2E1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
