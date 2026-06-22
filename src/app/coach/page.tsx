"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Loader2, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const RELAPSE_OPENER =
  "Je viens de rechuter. Je me sens vraiment mal par rapport à ça.";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Bonjour ! Je suis Libero, ton coach de bien-être personnel. 🌱\n\nJe suis là pour t'accompagner dans ton parcours, sans jugement, à tout moment. Tu peux me parler d'un craving que tu ressens, d'une situation difficile, de tes progrès, ou simplement de comment tu te sens aujourd'hui.\n\nQu'est-ce qui t'amène ici ?",
};

function CoachChat() {
  const searchParams = useSearchParams();
  const isRelapse = searchParams.get("context") === "relapse";

  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load history
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          if (data.messages?.length > 0) {
            setMessages([WELCOME_MESSAGE, ...data.messages]);
          }
        }
      } catch {
        // ignore
      } finally {
        setHistoryLoaded(true);
      }
    })();
  }, []);

  // Auto-send relapse message
  useEffect(() => {
    if (historyLoaded && isRelapse) {
      sendMessage(RELAPSE_OPENER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyLoaded]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || sending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    // Placeholder for streaming response
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim() }),
      });

      if (!res.ok) throw new Error("API error");
      if (!res.body) throw new Error("No body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "text" && data.text) {
                fullText += data.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: fullText } : m
                  )
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Désolé, une erreur est survenue. Vérifie ta connexion et réessaie.",
              }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };

  const quickPrompts = [
    "Je ressens un craving en ce moment",
    "J'ai du mal à rester motivé",
    "Comment gérer le stress sans consommer ?",
    "Parle-moi du surf de l'envie",
  ];

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-white px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="font-semibold">Libero</div>
          <div className="text-xs text-muted-foreground">Coach IA · TCC & Entretien motivationnel</div>
        </div>
        {isRelapse && (
          <div className="ml-auto flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-1.5 text-sm text-orange-700">
            <AlertTriangle className="h-4 w-4" />
            Session rechute
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                L
              </div>
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
                msg.role === "user"
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm bg-secondary text-secondary-foreground"
              )}
            >
              {msg.content === "" && sending ? (
                <div className="flex gap-1 py-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts (only when no custom messages yet) */}
      {messages.length <= 1 && (
        <div className="px-6 pb-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-6 py-2 text-center">
        <p className="text-xs text-muted-foreground">
          Libero ne remplace pas un professionnel de santé. En cas de détresse,{" "}
          <a href="tel:3114" className="underline">appelez le 3114</a>.
        </p>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-white px-6 py-4">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Écris un message... (Entrée pour envoyer)"
            className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-[120px]"
            rows={1}
            disabled={sending}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending}
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CoachPage() {
  return (
    <Suspense fallback={null}>
      <CoachChat />
    </Suspense>
  );
}
