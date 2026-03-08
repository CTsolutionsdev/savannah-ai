# SavannahAI — Build Brief

## About Savannah
- **Savannah Richard** — Beka's daughter, Chase's future bonus daughter
- Attending **Southern University Law Center (SULC)** in Baton Rouge, LA
- Southern University is an HBCU (Historically Black College and University)
- Founded 1880, NCAA Division I FCS, Southwestern Athletic Conference (SWAC)
- **Mascot:** Jaguars 🐆
- **School Colors:** Columbia Blue (#73C2E1) + Gold (#FDBB30)
- SULC offers JD, JD/MPA dual degree, certificates in Environmental Law and Civil Rights Law
- Law school established 1947

## What
AI-powered study assistant web app for Savannah Richard, a student at Southern University (Baton Rouge). Built as a gift from her stepdad Chase (CTSolutions.dev).

## Tech Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS + custom theme
- Vercel AI SDK (`ai` package)
- @ai-sdk/anthropic for Claude (primary)
- @ai-sdk/openai as fallback option
- Deploy to Vercel

## Features

### 1. Chat Interface (main feature)
- Clean chat UI with message history
- Streaming responses
- System prompt optimized for academic assistance
- Markdown rendering in responses (code blocks, lists, tables, math)

### 2. Study Modes (selectable via tabs or sidebar)
- **General Chat** — open-ended AI assistant
- **Flashcard Generator** — paste topic/notes, generates Q&A flashcards, flip-to-reveal UI
- **Quiz Mode** — generates multiple choice or short answer questions from a topic, tracks score
- **Essay Outliner** — given a prompt/thesis, generates structured outline with key points
- **Case Brief** (law school) — paste a case, generates Issue/Rule/Application/Conclusion (IRAC format)
- **Concept Explainer** — explain any concept at adjustable depth (simple → expert)

### 3. Context Input
- Text area to paste notes, readings, or case text
- AI uses this as context for all responses in that session
- Clear context button

### 4. UI/UX
- Dark mode by default, light mode toggle
- Mobile-first responsive design
- Color scheme: deep purple/indigo primary (Southern University colors: Columbia blue and white — incorporate subtly)
- Clean, minimal, modern — not cluttered
- "SavannahAI" branding with a subtle ✨ sparkle icon
- Footer: "Built with ❤️ by CTSolutions.dev"

### 5. API Configuration
- API key set via ANTHROPIC_API_KEY env var on Vercel
- Easy to swap to OpenAI by changing one env var
- Rate limiting consideration (basic, can enhance later)

## File Structure
```
src/
  app/
    layout.tsx          — root layout, fonts, metadata
    page.tsx            — main app page
    api/
      chat/
        route.ts        — streaming chat endpoint
      flashcards/
        route.ts        — flashcard generation endpoint
      quiz/
        route.ts        — quiz generation endpoint
  components/
    ChatInterface.tsx    — main chat with messages
    ChatMessage.tsx      — individual message bubble
    StudyModes.tsx       — mode selector tabs
    FlashcardView.tsx    — flashcard flip UI
    QuizView.tsx         — quiz with scoring
    EssayOutliner.tsx    — outline generator
    CaseBrief.tsx        — IRAC case brief view
    ConceptExplainer.tsx — depth-adjustable explainer
    ContextInput.tsx     — paste notes/readings
    ThemeToggle.tsx      — dark/light mode
    Header.tsx           — app header with branding
  lib/
    prompts.ts          — system prompts for each mode
    types.ts            — TypeScript types
```

## System Prompts
- General: "You are SavannahAI, a brilliant and supportive academic assistant..."
- Each mode gets a specialized prompt
- All prompts emphasize: accuracy, clear explanations, encouraging tone, academic rigor

## Important
- Use `useChat` hook from `ai` package for streaming
- API routes use `streamText` from `ai` package
- Use `@ai-sdk/anthropic` with `anthropic('claude-sonnet-4-20250514')` as default model
- All components should be client components where needed (`'use client'`)
- Make it production-ready, not a prototype
- Add proper error handling and loading states
- Make the flashcard and quiz modes actually interactive (flip cards, select answers, show score)
