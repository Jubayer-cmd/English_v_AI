import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Languages,
  Headphones,
  Activity,
} from "lucide-react";


import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface VoiceSettings {
  language: string;
  voice: string;
  voiceSpeed: number;
  micSensitivity: number;
  noiseReduction: boolean;
  autoTranscribe: boolean;
  realTimeFeedback: boolean;
  callQuality: string;
}

export default function VoiceCallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState("");

  const callStartTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [settings, setSettings] = useState<VoiceSettings>({
    language: "english",
    voice: "female-uk",
    voiceSpeed: 1.0,
    micSensitivity: 0.7,
    noiseReduction: true,
    autoTranscribe: true,
    realTimeFeedback: true,
    callQuality: "high",
  });

  // Simulate realistic audio level for visualization
  useEffect(() => {
    if (isCallActive && !isMuted) {
      const interval = setInterval(() => {
        // Create more realistic audio patterns
        const baseLevel = 30 + Math.sin(Date.now() / 1000) * 20;
        const randomSpike = Math.random() > 0.8 ? Math.random() * 40 : 0;
        const speechPattern = Math.sin(Date.now() / 300) * 15;
        setAudioLevel(
          Math.max(0, Math.min(100, baseLevel + randomSpike + speechPattern)),
        );
      }, 50);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isCallActive, isMuted]);

  // Call duration timer
  useEffect(() => {
    if (isCallActive) {
      callStartTimeRef.current = new Date();
      intervalRef.current = setInterval(() => {
        if (callStartTimeRef.current) {
          const now = new Date();
          const duration = Math.floor(
            (now.getTime() - callStartTimeRef.current.getTime()) / 1000,
          );
          setCallDuration(duration);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startCall = () => {
    setIsCallActive(true);
    setCurrentTranscript(
      "✨ Call started. ARIA is ready to practice English with you!",
    );

    // Simulate real-time transcription with more realistic conversation
    setTimeout(() => {
      setCurrentTranscript(
        "🤖 ARIA: Hello there! I'm excited to practice English with you today. What would you like to talk about? We could discuss hobbies, travel, work, or anything that interests you!",
      );
    }, 2000);

    setTimeout(() => {
      setCurrentTranscript(
        "🤖 ARIA: I'm listening... Feel free to start speaking anytime! Remember, I'm here to help you improve your English conversation skills.",
      );
    }, 5000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsMuted(false);
    setCurrentTranscript(
      "📞 Call ended. Great practice session! ARIA enjoyed talking with you. See you next time!",
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      setCurrentTranscript(
        "🔇 Microphone muted - ARIA is waiting for you to unmute",
      );
    } else {
      setCurrentTranscript("🎤 Microphone unmuted - You can speak now!");
    }
  };

  return (
    <div className="relative flex h-[90dvh] bg-background overflow-hidden">
      {/* Ambient Background Accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-primary/15 via-primary/10 to-primary/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)_/_0.08),transparent_60%)]" />
      </div>
      {/* Main Call Interface */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          settingsOpen ? "mr-80" : ""
        }`}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0 relative">
          {/* subtle gradient underline */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--primary)_/_0.7))] bg-clip-text text-transparent">
                AI Voice Practice
              </h1>
              <p className="text-xs text-muted-foreground">
                Real-time English conversation
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {isCallActive && (
              <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs">
                  Live • {formatDuration(callDuration)}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="hover-lift"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Call Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 space-y-3 overflow-hidden min-h-0">
          {/* AI Avatar Section */}
          <div className="relative animate-fade-in">
            {/* Avatar Container */}
            <div className="relative w-56 h-56 mx-auto">
              {/* Outer Glow Ring */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  isCallActive
                    ? "bg-gradient-to-r from-primary/20 to-primary/10 animate-pulse"
                    : "bg-gradient-to-r from-gray-400/10 to-gray-600/10"
                }`}
              />

              {/* Conic Sweep Ring */}
              {isCallActive && !isMuted && (
                <div className="absolute -inset-1 rounded-full p-[2px]">
                  <div className="absolute inset-0 rounded-full blur-md opacity-60 bg-[conic-gradient(from_0deg,hsl(var(--primary)_/_0.9),transparent_60%,hsl(var(--primary)_/_0.9))] animate-spin [animation-duration:6s]" />
                </div>
              )}

              {/* Wave Animation Rings */}
              {isCallActive && !isMuted && (
                <>
                  <div
                    className="absolute inset-4 rounded-full border-2 border-primary/40 animate-ping"
                    style={{ animationDuration: "2s" }}
                  />
                  <div
                    className="absolute inset-6 rounded-full border-2 border-primary/30 animate-ping"
                    style={{
                      animationDuration: "2.5s",
                      animationDelay: "0.5s",
                    }}
                  />
                  <div
                    className="absolute inset-8 rounded-full border-2 border-primary/25 animate-ping"
                    style={{ animationDuration: "3s", animationDelay: "1s" }}
                  />
                </>
              )}

              {/* Main Avatar Image */}
              <div
                className={`absolute inset-6 rounded-full overflow-hidden transition-all duration-300 ${
                  isCallActive ? "scale-110 shadow-2xl" : "scale-100"
                } ${isCallActive ? "animate-pulse" : ""}`}
                style={{
                  animation: isCallActive ? "pulse 2s infinite" : "none",
                  boxShadow: isCallActive
                    ? "0 0 40px hsl(var(--primary) / 0.6)"
                    : "0 0 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Avatar Image */}
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face"
                  alt="AI Assistant ARIA"
                  className="w-full h-full object-cover rounded-full"
                />

                {/* Overlay for speaking effect */}
                {isCallActive && !isMuted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full animate-pulse" />
                )}

                {/* Audio Wave Visualization Overlay */}
                {isCallActive && !isMuted && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-end space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-white/80 rounded-full shadow-lg transition-all duration-100"
                          style={{
                            height: `${
                              8 +
                              (audioLevel / 100) * 15 +
                              Math.sin(Date.now() / 150 + i) * 4
                            }px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isCallActive && !isMuted
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCallActive ? (isMuted ? "Muted" : "Speaking") : "Ready"}
                </div>
              </div>
            </div>

            {/* AI Name and Status */}
            <div className="text-center mt-10">
              <h2
                className={`text-4xl font-bold bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--primary)_/_0.7))] bg-clip-text text-transparent`}
              >
                ARIA
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">
                {isCallActive ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span>Speaking • {formatDuration(callDuration)}</span>
                  </span>
                ) : (
                  "AI English Conversation Partner"
                )}
              </p>
            </div>
          </div>

          {/* Real-time Transcript */}
          {isCallActive && settings.autoTranscribe && (
            <Card className="w-full max-w-xl glass animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Live Transcript</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 min-h-[60px] flex items-center">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentTranscript || (
                      <span className="flex items-center space-x-2">
                        <span>Listening</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                          <div
                            className="w-1 h-1 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-1 h-1 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-4 animate-fade-in stagger-2">
            {!isCallActive ? (
              <Button
                onClick={startCall}
                className="bg-primary hover:bg-primary/90 px-8 py-3 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-effect hover-lift"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Conversation
              </Button>
            ) : (
              <>
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  onClick={toggleMute}
                  className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>

                <Button
                  variant="destructive"
                  onClick={endCall}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-effect hover-lift"
                  title="End Call"
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>

                <Button
                  variant={isSpeakerOn ? "secondary" : "outline"}
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                  title={isSpeakerOn ? "Speaker On" : "Speaker Off"}
                >
                  {isSpeakerOn ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Settings Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-card/80 glass border-l border-border transform transition-transform duration-300 ease-in-out z-50 ${
          settingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">Voice Call Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configure your voice call experience
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSettingsOpen(false)}
          >
            ✕
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-80px)]">
          {/* Language & Voice Settings */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center">
              <Languages className="w-4 h-4 mr-2" />
              Language & Voice
            </Label>

            <div className="space-y-4">
              <div>
                <Label htmlFor="language" className="text-sm">
                  Language
                </Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      language: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="voice" className="text-sm">
                  AI Voice
                </Label>
                <Select
                  value={settings.voice}
                  onValueChange={(value) =>
                    setSettings((prev) => ({ ...prev, voice: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female-uk">Female (UK)</SelectItem>
                    <SelectItem value="male-uk">Male (UK)</SelectItem>
                    <SelectItem value="female-us">Female (US)</SelectItem>
                    <SelectItem value="male-us">Male (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">
                  Voice Speed: {settings.voiceSpeed}x
                </Label>
                <Slider
                  value={[settings.voiceSpeed]}
                  onValueChange={([value]) =>
                    setSettings((prev) => ({
                      ...prev,
                      voiceSpeed: value,
                    }))
                  }
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center">
              <Headphones className="w-4 h-4 mr-2" />
              Audio Settings
            </Label>

            <div className="space-y-4">
              <div>
                <Label className="text-sm">
                  Microphone Sensitivity:{" "}
                  {Math.round(settings.micSensitivity * 100)}%
                </Label>
                <Slider
                  value={[settings.micSensitivity]}
                  onValueChange={([value]) =>
                    setSettings((prev) => ({
                      ...prev,
                      micSensitivity: value,
                    }))
                  }
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="callQuality" className="text-sm">
                  Call Quality
                </Label>
                <Select
                  value={settings.callQuality}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      callQuality: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Faster)</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High (Better Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Noise Reduction</Label>
                  <p className="text-xs text-muted-foreground">
                    Reduce background noise during calls
                  </p>
                </div>
                <Switch
                  checked={settings.noiseReduction}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      noiseReduction: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Features
            </Label>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Auto Transcribe</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically transcribe conversations
                  </p>
                </div>
                <Switch
                  checked={settings.autoTranscribe}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoTranscribe: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Real-time Feedback</Label>
                  <p className="text-xs text-muted-foreground">
                    Get instant pronunciation feedback
                  </p>
                </div>
                <Switch
                  checked={settings.realTimeFeedback}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      realTimeFeedback: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
