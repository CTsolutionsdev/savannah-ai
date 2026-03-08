// All configurable via environment variables for multi-tenant deployment
export const config = {
  studentName: process.env.NEXT_PUBLIC_STUDENT_NAME || 'Savannah',
  schoolName: process.env.NEXT_PUBLIC_SCHOOL_NAME || 'Southern University Law Center',
  schoolShort: process.env.NEXT_PUBLIC_SCHOOL_SHORT || 'SULC',
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '#73C2E1',
  accentSecondary: process.env.NEXT_PUBLIC_ACCENT_SECONDARY || '#FDBB30',
  accentDark: process.env.NEXT_PUBLIC_ACCENT_DARK || '#4A9BBF',
  mascot: process.env.NEXT_PUBLIC_MASCOT || '🐆',
  mascotName: process.env.NEXT_PUBLIC_MASCOT_NAME || 'Jaguars',
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'SavannahAI',
} as const;
