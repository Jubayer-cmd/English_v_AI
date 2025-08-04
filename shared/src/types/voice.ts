export type VoiceSession = {
  id: string;
  userId: string;
  title: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  status: "recording" | "processing" | "completed" | "failed";
};

export type VoiceMessage = {
  id: string;
  sessionId: string;
  content: string;
  timestamp: number;
  type: "user" | "ai";
  audioUrl?: string;
  duration?: number;
};

export type VoiceSettings = {
  language: string;
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
};

export type VoiceStats = {
  totalSessions: number;
  totalDuration: number;
  averageSessionLength: number;
  mostUsedLanguage: string;
  sessionsThisMonth: number;
};

// Practice modes for the dashboard sidebar
export type PracticeMode = {
  id: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  path: string;
};

// User progress and details
export type UserProgress = {
  currentLevel: number;
  minutesToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalPracticeTime: number;
  dailyScore: number;
  weeklyProgress: {
    date: string;
    minutes: number;
  }[];
};

export type UserDetails = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  totalPracticeTime: number;
  currentStreak: number;
  longestStreak: number;
  joinDate: string;
  preferences: {
    language: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    notifications: boolean;
  };
}; 