import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, GraduationCap, MapPin, Mail, Phone, Send } from "lucide-react";
import axios from "axios";
import { Navbar } from "@/components/Navbar";
import { ChatUI } from "@/components/ChatUI";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

const STATS = [
  { icon: Users, label: "Students", value: "3,500+" },
  { icon: BookOpen, label: "Programs", value: "24" },
  { icon: Award, label: "Years of Excellence", value: "18" },
  { icon: GraduationCap, label: "Faculty", value: "180+" },
];

type LeadDraft = {
  full_name: string;
  current_class: string;
  program_interest: string;
  gpa: string;
  phone_number: string;
  email: string;
};

const EMPTY_LEAD: LeadDraft = {
  full_name: "",
  current_class: "",
  program_interest: "",
  gpa: "",
  phone_number: "",
  email: "",
};

export function HomePage() {
  const [leadDraft, setLeadDraft] = useState<LeadDraft>(EMPTY_LEAD);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLeadSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const currentStudy = leadDraft.current_class.trim().toLowerCase();
    const wantsMBA = leadDraft.program_interest.trim().toLowerCase() === "mba";
    if (wantsMBA && (currentStudy.includes("12") || currentStudy.includes("class 12") || currentStudy.includes("+2"))) {
      setFeedback("Bachelor qualification is required to study MBA.");
      setSubmitting(false);
      return;
    }

    try {
      await axios.post(`${API_BASE}/leads`, leadDraft);
      setFeedback("Thanks! Your details were saved as a student lead, we will get back to you soon.");
      setLeadDraft(EMPTY_LEAD);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail || error.response?.data?.message || "We could not save your details right now."
        : (error as Error).message;
      setFeedback(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative bg-hero-gradient text-primary-foreground overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px, 90px 90px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-6">
              <Sparkle /> Powered by UniGuide AI
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold leading-[1.05] mb-5">
              Ask Anything About <span className="text-white/90 italic">Our College</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl">
              Our AI assistant answers questions directly from the official college brochure.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 -mt-16 sm:-mt-20 relative z-10 pb-16">
        <ChatUI />
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-8 shadow-soft">
            <h2 className="text-2xl font-bold mb-1 text-foreground">Admission lead form</h2>
            <p className="text-sm text-muted-foreground mb-6">
              BSc.IT requires completion of 12th with a 2.30 GPA. MBA requires a bachelor&apos;s degree in any subject.
            </p>
            <form onSubmit={handleLeadSubmit} className="grid gap-3">
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
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                <Send className="w-4 h-4" /> {submitting ? "Sending..." : "Send enquiry"}
              </button>
              {feedback && <p className="text-sm text-emerald-600">{feedback}</p>}
            </form>
          </div>

          <div className="bg-primary-gradient rounded-3xl p-8 text-primary-foreground shadow-elegant">
            <h3 className="text-2xl font-bold mb-3">Admissions support</h3>
            <p className="text-white/90 mb-6">
              Fill in the form to register your interest for MBA or BSc.IT and our team will follow up.
            </p>
            <ul className="space-y-3 text-sm">
              <li>• Guidance for admission requirements</li>
              <li>• Program selection help</li>
              <li>• Scholarship and eligibility support</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 border-y border-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-soft"
            >
              <s.icon className="w-6 h-6 text-primary mb-3" />
              <div className="text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Learn. Innovate. Lead.</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Techspire College is a premier institution offering undergraduate and graduate programs
            in computing, business, engineering and liberal arts.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary" /> Tinkune, Kathmandu, Nepal
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary" /> info@techspire.edu.np
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary" /> +977 1 4111 234
            </li>
          </ul>
        </div>
        <div className="bg-primary-gradient rounded-3xl p-8 text-primary-foreground shadow-elegant">
          <h3 className="text-2xl font-bold mb-3">Admissions Open 2026</h3>
          <p className="text-white/90 mb-6">
            Applications for Fall intake are now being accepted. Chat with UniGuide AI above for
            eligibility, deadlines and scholarship info.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {["BCA", "BBA", "BSc CSIT", "MBA"].map((program) => (
              <div
                key={program}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center font-medium"
              >
                {program}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-sidebar text-sidebar-foreground py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          <div>© {new Date().getFullYear()} Techspire College. All rights reserved.</div>
          <div className="opacity-70">Built with UniGuide AI · techspire.edu.np</div>
        </div>
      </footer>
    </div>
  );
}

function Sparkle() {
  return <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />;
}