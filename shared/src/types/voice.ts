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