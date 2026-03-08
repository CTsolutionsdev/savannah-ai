export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type StudyMode =
  | 'chat'
  | 'flashcards'
  | 'quiz'
  | 'essay'
  | 'casebrief'
  | 'concept';

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EssayOutline {
  thesis: string;
  sections: {
    heading: string;
    points: string[];
  }[];
  conclusion: string;
}

export interface CaseBriefData {
  caseName: string;
  citation: string;
  issue: string;
  rule: string;
  application: string;
  conclusion: string;
  notes: string;
}
