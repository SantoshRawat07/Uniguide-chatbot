import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, FileText, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  sources?: (number | string)[];
};

const API_URL = "http://localhost:8000/chat";

const SUGGESTIONS = [
  "What programs does Techspire College offer?",
  "How do I apply for admission?",
  "What are the tuition fees?",
  "Tell me about campus facilities.",
];

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "**Namaste! 🙏 Welcome to Techspire College.**\n\nI'm UniGuide AI — I answer directly from our official brochure. Ask me about programs, admissions, fees, campus life, or scholarships.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || typing) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: question };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const { data } = await axios.post(API_URL, { question }, { timeout: 60000 });
      const answer = data?.answer ?? data?.response ?? "No answer returned.";
      const sources = data?.sources ?? data?.pages ?? [];
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", content: answer, sources }]);
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.code === "ERR_NETWORK"
          ? "⚠️ Couldn't reach the AI backend at `http://localhost:8000/chat`. Please make sure the server is running."
          : `⚠️ ${(err as Error).message}`;
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", content: msg }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-card rounded-2xl shadow-elegant border border-border overflow-hidden flex flex-col h-[70vh] min-h-[520px]">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center shadow-soft">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-semibold text-foreground">UniGuide AI</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online · Answers from official brochure
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 bg-gradient-to-b from-background to-muted/30">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-foreground text-background" : "bg-primary-gradient text-primary-foreground"}`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-soft ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm"}`}>
                <div className={`prose prose-sm max-w-none ${m.role === "user" ? "prose-invert" : ""}`}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.sources.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground border border-primary/20">
                        <FileText className="w-3 h-3" /> Page {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-accent hover:border-primary/40 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-border p-3 sm:p-4 bg-card flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about programs, fees, admissions..."
          className="flex-1 bg-muted/60 focus:bg-background transition border border-transparent focus:border-primary/40 rounded-full px-5 py-3 text-sm outline-none"
        />
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="submit"
          disabled={!input.trim() || typing}
          className="w-11 h-11 rounded-full bg-primary-gradient text-primary-foreground flex items-center justify-center shadow-elegant disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
}
