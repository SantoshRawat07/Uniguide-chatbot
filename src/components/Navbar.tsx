import { motion } from "framer-motion";
import { GraduationCap, LayoutDashboard } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "@/assets/logonep.png";

export function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-1">
          <img src={logo} alt="Techspire College" width={50} height={50} className="rounded-md" />
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-lg font-bold text-foreground">Techspire College</div>
            <div className="text-xs text-muted-foreground">UniGuide AI · Official Assistant</div>
          </div>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition ${!isAdmin && isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"}`
            }
          >
            <GraduationCap className="inline w-4 h-4 mr-1" /> Student
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition inline-flex items-center gap-1 ${isActive ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`
            }
          >
            <LayoutDashboard className="w-4 h-4" /> Admin
          </NavLink>
        </nav>
      </div>
    </motion.header>
  );
}
