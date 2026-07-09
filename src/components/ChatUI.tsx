import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  sources?: (number | string)[];
};

type LeadDraft = {
  full_name: string;
  current_class: string;
  program_interest: string;
  gpa: string;
  phone_number: string;
  email: string;
};

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
const CHAT_URL = `${API_BASE}/chat`;

const SUGGESTIONS = [
  "What programs does Techspire College offer?",
  "How do I apply for admission?",
  "Help me apply for MBA or BSc.IT",
  "Tell me about campus facilities.",
];

const FALLBACK_MESSAGE = `I’m sorry, but I don’t have that information in the uploaded brochure.

You can ask or contact the college administration to know more about it. Please reach out to the admissions office at:
- Phone: +977-1-1234567
- Email: admissions@techspire.edu.np`;

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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [leadDraft, setLeadDraft] = useState<LeadDraft>({
    full_name: "",
    current_class: "",
    program_interest: "",
    gpa: "",
    phone_number: "",
    email: "",
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadFeedback, setLeadFeedback] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const maybeOpenLeadForm = (text: string) => {
    const normalized = text.toLowerCase();
    const shouldPrompt = /admission|apply|eligib|program|mba|bsc|enquiry|student/i.test(normalized);
    if (!shouldPrompt || leadFormOpen) return;

    const inferredProgram = /mba/i.test(normalized)
      ? "MBA"
      : /bsc|csit/i.test(normalized)
        ? "BSc.IT"
        : "";

    if (inferredProgram) {
      setLeadDraft((prev) => ({ ...prev, program_interest: inferredProgram }));
    }

    setLeadFormOpen(true);
    setLeadFeedback(null);
  };

  const submitLead = async (event: React.FormEvent) => {
    event.preventDefault();
    setLeadSubmitting(true);
    setLeadFeedback(null);

    const currentStudy = leadDraft.current_class.trim().toLowerCase();
    const wantsMBA = leadDraft.program_interest.trim().toLowerCase() === "mba";
    if (wantsMBA && (currentStudy.includes("12") || currentStudy.includes("class 12") || currentStudy.includes("+2"))) {
      setLeadFeedback("Bachelor qualification is required to study MBA.");
      setLeadSubmitting(false);
      return;
    }

    try {
      await axios.post(`${API_BASE}/leads`, leadDraft);
      setLeadFeedback("Thanks! Your details were saved as a student lead, we will get back to you soon.");
      setLeadDraft({
        full_name: "",
        current_class: "",
        program_interest: "",
        gpa: "",
        phone_number: "",
        email: "",
      });
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail || error.response?.data?.message || "We could not save your details right now."
        : (error as Error).message;
      setLeadFeedback(message);
    } finally {
      setLeadSubmitting(false);
    }
  };

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || typing) return;
    maybeOpenLeadForm(question);
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: question };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const { data } = await axios.post(
        CHAT_URL,
        { question, session_id: sessionId ?? undefined },
        { timeout: 60000 },
      );
      const answer = data?.answer ?? data?.response ?? "No answer returned.";
      const normalizedAnswer = (answer ?? "").toString().trim();
      const fallbackAnswer = normalizedAnswer.length > 0 ? normalizedAnswer : FALLBACK_MESSAGE;
      const finalAnswer = normalizedAnswer.toLowerCase().includes("i don't know") || normalizedAnswer.toLowerCase().includes("don't have") || normalizedAnswer.toLowerCase().includes("not found")
        ? FALLBACK_MESSAGE
        : fallbackAnswer;
      const sources = data?.sources ?? data?.pages ?? [];
      if (data?.session_id) {
        setSessionId(String(data.session_id));
      }
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", content: finalAnswer, sources }]);
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.code === "ERR_NETWORK"
          ? `⚠️ Please make sure the server is running.`
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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online · Answers
            from official brochure
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 bg-gradient-to-b from-background to-muted/30"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-foreground text-background" : "bg-primary-gradient text-primary-foreground"}`}
              >
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-soft ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm"}`}
              >
                <div
                  className={`prose prose-sm max-w-none ${m.role === "user" ? "prose-invert" : ""}`}
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3"
          >
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

        {leadFormOpen && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-soft">
            <div className="font-semibold text-foreground">Admission lead form</div>
            <p className="text-sm text-muted-foreground mt-1">
              BSc.IT requires completion of 12th with a 2.30 GPA. MBA requires a bachelor&apos;s degree in any subject.
            </p>
            <form onSubmit={submitLead} className="mt-4 grid gap-3">
              <input
                required
                value={leadDraft.full_name}
                onChange={(event) => setLeadDraft((prev) => ({ ...prev, full_name: event.target.value }))}
                placeholder="Full name"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                required
                value={leadDraft.current_class}
                onChange={(event) => setLeadDraft((prev) => ({ ...prev, current_class: event.target.value }))}
                placeholder="Current class or study"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <select
                required
                value={leadDraft.program_interest}
                onChange={(event) =>
                  setLeadDraft((prev) => ({
                    ...prev,
                    program_interest: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Program</option>
                <option value="MBA">MBA</option>
                <option value="BSc.IT">BSc.IT</option>
              </select>
              <input
                required
                value={leadDraft.gpa}
                onChange={(event) => setLeadDraft((prev) => ({ ...prev, gpa: event.target.value }))}
                placeholder="GPA"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                required
                value={leadDraft.phone_number}
                onChange={(event) => setLeadDraft((prev) => ({ ...prev, phone_number: event.target.value }))}
                placeholder="Phone number"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                required
                type="email"
                value={leadDraft.email}
                onChange={(event) => setLeadDraft((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={leadSubmitting}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {leadSubmitting ? "Sending..." : "Send enquiry"}
              </button>
              {leadFeedback && <p className="text-sm text-emerald-600">{leadFeedback}</p>}
            </form>
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
