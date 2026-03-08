# SavannahAI — Full Production Rebuild

## Problems to Fix
1. **Deprecated packages** — @ai-sdk/anthropic@0.0.56 has SSRF vulnerability, ai@4 is old
2. **Flashcards/Quiz timeout** — generateText takes too long for Vercel free tier (10s limit)
3. **No error boundary** — app crashes on any component error
4. **No loading skeletons** — raw empty states look unpolished
5. **No rate limiting** — anyone can spam the API
6. **No multi-user support** — hardcoded to Savannah
7. **No API key management** — no way to bring your own key

## Architecture Changes

### 1. Upgrade Dependencies
- ai@4 → ai@5 (latest stable with ai/react support)
- @ai-sdk/anthropic → latest stable that works with ai@5
- @ai-sdk/openai → latest stable that works with ai@5
- Remove deprecated packages

### 2. Fix Flashcards + Quiz (Critical)
Convert from generateText to streaming approach:
- Use chat API route for ALL modes (including flashcards/quiz)
- Flashcards: stream the response, then parse JSON client-side when complete
- Quiz: same approach — stream, then parse
- This works within 10s because streaming starts immediately
- Fallback: if JSON parse fails, show raw response in a nice format

### 3. Error Handling
- Global error boundary component
- Per-route error handling with user-friendly messages
- Retry button on failures
- Toast/notification system for non-critical errors

### 4. Multi-User / Business Ready
- Environment variable: NEXT_PUBLIC_STUDENT_NAME (default: Savannah)
- Environment variable: NEXT_PUBLIC_SCHOOL_NAME (default: Southern University Law Center)
- Environment variable: NEXT_PUBLIC_SCHOOL_SHORT (default: SULC)
- Environment variable: NEXT_PUBLIC_ACCENT_COLOR (default: #73C2E1)
- Environment variable: NEXT_PUBLIC_ACCENT_SECONDARY (default: #FDBB30)
- This lets us deploy N instances for N students with just env vars

### 5. PWA Support
- next-pwa or manual service worker
- App manifest with SULC branding
- Installable on phone home screen
- Offline fallback page

### 6. Rate Limiting
- Simple in-memory rate limiter on API routes
- 20 requests per minute per IP
- Graceful error message when limited

### 7. Vercel Config
- vercel.json with function config
- Proper region selection (iad1 for Louisiana)
- Headers for security
