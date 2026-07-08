import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GraduationCap, LayoutDashboard } from "lucide-react";
import logo from "@/assets/logo.png";

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Techspire College" width={40} height={40} className="rounded-md" />
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-lg font-bold text-foreground">Techspire College</div>
            <div className="text-xs text-muted-foreground">UniGuide AI · Official Assistant</div>
          </div>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
          <Link to="/" className={`px-3 py-2 rounded-md transition ${!isAdmin ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}>
            <GraduationCap className="inline w-4 h-4 mr-1" /> Student
          </Link>
          <Link to="/admin" className={`px-3 py-2 rounded-md transition inline-flex items-center gap-1 ${isAdmin ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}>
            <LayoutDashboard className="w-4 h-4" /> Admin
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
