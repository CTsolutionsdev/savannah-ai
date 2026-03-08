const STORAGE_KEY = 'savannah-ai-data';

interface StorageData {
  hasOnboarded: boolean;
  totalStudyMinutes: number;
  sessionsCount: number;
  lastMode: string;
  savedChats: { id: string; mode: string; title: string; messages: { role: string; content: string }[]; createdAt: string }[];
}

const defaults: StorageData = {
  hasOnboarded: false,
  totalStudyMinutes: 0,
  sessionsCount: 0,
  lastMode: 'chat',
  savedChats: [],
};

export function getStorage(): StorageData {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function setStorage(data: Partial<StorageData>) {
  if (typeof window === 'undefined') return;
  const current = getStorage();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
}

export function addStudyTime(minutes: number) {
  const data = getStorage();
  setStorage({ totalStudyMinutes: data.totalStudyMinutes + minutes });
}

export function incrementSessions() {
  const data = getStorage();
  setStorage({ sessionsCount: data.sessionsCount + 1 });
}
