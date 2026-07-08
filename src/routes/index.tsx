import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, GraduationCap, MapPin, Mail, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ChatUI } from "@/components/ChatUI";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Techspire College — UniGuide AI Assistant" },
      { name: "description", content: "Ask anything about Techspire College. Our AI assistant answers directly from the official brochure — programs, admissions, fees and campus life." },
      { property: "og:title", content: "Techspire College — UniGuide AI" },
      { property: "og:description", content: "AI-powered guide to Techspire College. Instant answers from the official brochure." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STATS = [
  { icon: Users, label: "Students", value: "3,500+" },
  { icon: BookOpen, label: "Programs", value: "24" },
  { icon: Award, label: "Years of Excellence", value: "18" },
  { icon: GraduationCap, label: "Faculty", value: "180+" },
];

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative bg-hero-gradient text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "60px 60px, 90px 90px" }} />
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
            Techspire College is a premier institution offering undergraduate and graduate programs in computing, business, engineering and liberal arts. Our mission is to nurture curious minds and prepare students for a rapidly evolving world.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> Tinkune, Kathmandu, Nepal</li>
            <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> info@techspire.edu.np</li>
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> +977 1 4111 234</li>
          </ul>
        </div>
        <div className="bg-primary-gradient rounded-3xl p-8 text-primary-foreground shadow-elegant">
          <h3 className="text-2xl font-bold mb-3">Admissions Open 2026</h3>
          <p className="text-white/90 mb-6">Applications for Fall intake are now being accepted. Chat with UniGuide AI above for eligibility, deadlines and scholarship info.</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {["BCA", "BBA", "BSc CSIT", "MBA"].map((p) => (
              <div key={p} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center font-medium">{p}</div>
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
