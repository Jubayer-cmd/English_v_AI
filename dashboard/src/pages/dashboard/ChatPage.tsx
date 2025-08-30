import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  MessageSquare,
  Send,
  Settings,
  Mic,
  Volume2,
  Languages,
  Palette,
  Bot,
  User,
  MoreVertical,
  Download,
  Trash2,
  Copy,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatSettings {
  language: string;
  voice: string;
  voiceSpeed: number;
  autoSpeak: boolean;
  showTimestamps: boolean;
  darkMode: boolean;
  fontSize: number;
  correctionMode: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your AI English conversation partner. Let's practice your English together! What would you like to talk about today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<ChatSettings>({
    language: "english",
    voice: "female-uk",
    voiceSpeed: 1.0,
    autoSpeak: true,
    showTimestamps: false,
    darkMode: true,
    fontSize: 14,
    correctionMode: true,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "That's interesting! Could you tell me more about that? I'd love to help you practice expressing your thoughts in English.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hi! I'm your AI English conversation partner. Let's practice your English together! What would you like to talk about today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  const exportChat = () => {
    const chatText = messages
      .map((msg) => `${msg.sender === "user" ? "You" : "AI"}: ${msg.content}`)
      .join("\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-session-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          settingsOpen ? "mr-80" : ""
        }`}
      >
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between bg-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI Chat Practice</h1>
              <p className="text-sm text-muted-foreground">
                Improve your English through conversation
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Online
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportChat}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearChat}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Conversation
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearChat} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] space-x-3 ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                  style={{ fontSize: `${settings.fontSize}px` }}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {settings.showTimestamps && (
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {message.sender === "ai" && (
                  <div className="flex flex-col space-y-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        // Add text-to-speech functionality
                        if ("speechSynthesis" in window) {
                          const utterance = new SpeechSynthesisUtterance(
                            message.content,
                          );
                          utterance.rate = settings.voiceSpeed;
                          speechSynthesis.speak(utterance);
                        }
                      }}
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-card">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="px-3"
              onClick={() => {
                // Add voice input functionality
                if ("webkitSpeechRecognition" in window) {
                  const recognition = new (
                    window as any
                  ).webkitSpeechRecognition();
                  recognition.continuous = false;
                  recognition.interimResults = false;
                  recognition.lang = "en-US";

                  recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInputValue(transcript);
                  };

                  recognition.start();
                }
              }}
            >
              <Mic className="w-4 h-4" />
            </Button>

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send)"
              className="flex-1"
              style={{ fontSize: `${settings.fontSize}px` }}
            />

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {settings.correctionMode && (
                <Badge variant="outline" className="text-xs">
                  Correction Mode On
                </Badge>
              )}
            </div>
            <span>{inputValue.length}/500</span>
          </div>
        </div>
      </div>

      {/* Settings Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-card border-l border-border transform transition-transform duration-300 ease-in-out z-50 ${
          settingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">Chat Settings</h2>
            <p className="text-sm text-muted-foreground">
              Customize your chat experience
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
          {/* Language Settings */}
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
                  Voice
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

          {/* Chat Behavior */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat Behavior
            </Label>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Auto-speak AI responses</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically read AI messages aloud
                  </p>
                </div>
                <Switch
                  checked={settings.autoSpeak}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoSpeak: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Correction Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    AI will correct grammar and suggest improvements
                  </p>
                </div>
                <Switch
                  checked={settings.correctionMode}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      correctionMode: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Show Timestamps</Label>
                  <p className="text-xs text-muted-foreground">
                    Display message timestamps
                  </p>
                </div>
                <Switch
                  checked={settings.showTimestamps}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      showTimestamps: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </Label>

            <div className="space-y-4">
              <div>
                <Label className="text-sm">
                  Font Size: {settings.fontSize}px
                </Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) =>
                    setSettings((prev) => ({
                      ...prev,
                      fontSize: value,
                    }))
                  }
                  min={12}
                  max={20}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
