import { useState, useRef, useEffect } from "react";
import { Send, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}


const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm TripGraph, your AI travel guide. Tell me about your travel plans, and I'll help you visualize your perfect journey!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tripState, setTripState] = useState<Record<string, any>>({ trip: {}, chat: [] });
  const [isDone, setIsDone] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [graphHtmlContent, setGraphHtmlContent] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [accumulatedText, setAccumulatedText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session_id and restore state from localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem('tripgraph_session');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = crypto.randomUUID();
      localStorage.setItem('tripgraph_session', newSessionId);
      setSessionId(newSessionId);
    }

    // Restore state from localStorage
    const savedState = localStorage.getItem('tripgraph_state');
    if (savedState) {
      try {
        setTripState(JSON.parse(savedState));
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }

    // Restore accumulated text from localStorage
    const savedAccumulatedText = localStorage.getItem('tripgraph_accumulated_text');
    if (savedAccumulatedText) {
      console.log('📝 Restored accumulated text:', savedAccumulatedText);
      setAccumulatedText(savedAccumulatedText);
    } else {
      console.log('📝 No accumulated text in localStorage');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Build state with user message in chat history
      const currentState = tripState || { trip: {}, chat: [] };
      const updatedState = {
        ...currentState,
        chat: [...(currentState.chat || []), { role: "user", text: messageText }]
      };

      // Accumulate all user text
      const newAccumulatedText = accumulatedText 
        ? `${accumulatedText} ${messageText}` 
        : messageText;
      
      console.log('📨 Previous accumulated:', accumulatedText);
      console.log('📨 New message:', messageText);
      console.log('📨 Sending accumulated text:', newAccumulatedText);
      
      setAccumulatedText(newAccumulatedText);
      localStorage.setItem('tripgraph_accumulated_text', newAccumulatedText);

      const response = await fetch("https://aliassaad1.app.n8n.cloud/webhook/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify({
          user_text: newAccumulatedText,
          state: updatedState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "I'm processing your travel plans and creating your journey graph...",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      
      // Update state with response from n8n
      let newState = data.state || updatedState || { trip: {}, chat: [] };
      
      // Optionally append assistant message if n8n didn't include it
      if (!newState.chat || !newState.chat.find((msg: any) => msg.role === "assistant" && msg.text === data.reply)) {
        newState = {
          ...newState,
          chat: [...(newState.chat || []), { role: "assistant", text: data.reply }]
        };
      }
      
      setTripState(newState);
      
      // Save to localStorage
      localStorage.setItem('tripgraph_state', JSON.stringify(newState));
      
      // Check if done and handle HTML content
      if (data.done) {
        setIsDone(true);
        if (data.html) {
          setHtmlContent(data.html);
        }
        if (data.graph_html) {
          setGraphHtmlContent(data.graph_html);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isDone && (htmlContent || graphHtmlContent)) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-background to-primary/5">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">TripGraph</h1>
              <p className="text-sm text-muted-foreground">Your Travel Plan</p>
            </div>
          </div>
        </header>

        {/* HTML Content */}
        <div className="flex-1 overflow-hidden">
          <iframe
            srcDoc={htmlContent || graphHtmlContent}
            className="w-full h-full border-0"
            title="Trip Graph"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-primary/5">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">TripGraph</h1>
            <p className="text-sm text-muted-foreground">Your AI Travel Guide</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-card text-card-foreground border border-border"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-card text-card-foreground border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about your travel plans..."
            disabled={isLoading || isDone}
            className="flex-1 bg-background border-border focus-visible:ring-primary"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim() || isDone}
            size="icon"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
