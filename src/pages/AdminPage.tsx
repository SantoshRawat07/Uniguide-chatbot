import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "sonner";
import {
  LayoutDashboard,
  Upload,
  Settings as SettingsIcon,
  FileText,
  CheckCircle2,
  CloudUpload,
  Database,
  Activity,
  Users,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Navbar } from "@/components/Navbar";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

type Tab = "dashboard" | "upload" | "settings" | "leads";

type Brochure = {
  name: string;
  chunks: number;
  uploadedAt: string;
};

const NAV: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "My Leads", icon: Users },
  { id: "upload", label: "Upload Brochure", icon: Upload },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

const QUERY_DATA = [
  { day: "Mon", queries: 42 },
  { day: "Tue", queries: 68 },
  { day: "Wed", queries: 91 },
  { day: "Thu", queries: 74 },
  { day: "Fri", queries: 120 },
  { day: "Sat", queries: 56 },
  { day: "Sun", queries: 33 },
];

const TOPIC_DATA = [
  { topic: "Admissions", count: 88 },
  { topic: "Fees", count: 64 },
  { topic: "Programs", count: 120 },
  { topic: "Hostel", count: 27 },
  { topic: "Scholarship", count: 45 },
];

export function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [brochure, setBrochure] = useState<Brochure | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <Toaster position="top-right" richColors />
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <aside className="w-56 shrink-0 border-r border-border bg-card p-4 hidden md:block">
          <div className="text-xs uppercase text-muted-foreground tracking-widest px-2 mb-3">
            Admin Panel
          </div>
          <nav className="space-y-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${tab === item.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "hover:bg-accent text-foreground/80"
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-8">
          <div className="md:hidden mb-4 flex gap-2 overflow-x-auto">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${tab === item.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "dashboard" && <Dashboard brochure={brochure} />}
          {tab === "leads" && <LeadsPanel />}
          {tab === "upload" && <UploadBrochure brochure={brochure} onUploaded={setBrochure} />}
          {tab === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ brochure }: { brochure: Brochure | null }) {
  const stats = [
    { label: "Total Queries", value: "1,284", icon: Activity, tone: "text-primary" },
    {
      label: "Indexed Chunks",
      value: brochure ? String(brochure.chunks) : "—",
      icon: Database,
      tone: "text-emerald-600",
    },
    {
      label: "Current Brochure",
      value: brochure?.name ?? "Not uploaded",
      icon: FileText,
      tone: "text-blue-600",
    },
    {
      label: "Status",
      value: brochure ? "Ready for Chat" : "Awaiting Upload",
      icon: CheckCircle2,
      tone: brochure ? "text-emerald-600" : "text-amber-600",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Overview of UniGuide AI performance and brochure index.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-5 shadow-soft">
            <stat.icon className={`w-5 h-5 mb-2 ${stat.tone}`} />
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="text-lg font-semibold mt-1 truncate">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
          <div className="font-semibold mb-4">Queries this week</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={QUERY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                <Line
                  type="monotone"
                  dataKey="queries"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ fill: "var(--primary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
          <div className="font-semibold mb-4">Top question topics</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOPIC_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="topic" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function UploadBrochure({
  brochure,
  onUploaded,
}: {
  brochure: Brochure | null;
  onUploaded: (brochure: Brochure) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFile = useCallback((selectedFile: File | null) => {
    if (!selectedFile) return;
    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Only PDF files are allowed.");
      return;
    }
    setFile(selectedFile);
    setSuccess(false);
    setProgress(0);
  }, []);

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setSuccess(false);
    const form = new FormData();
    form.append("file", file);

    try {
      const { data } = await axios.post(`${API_BASE}/upload`, form, {
        onUploadProgress: (event) => {
          if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
        },
      });

      const chunks = data?.chunks ?? data?.num_chunks ?? data?.count ?? 0;
      if (chunks > 0) {
        setSuccess(true);
        onUploaded({ name: file.name, chunks, uploadedAt: new Date().toLocaleString() });
        toast.success(data?.message ?? "Brochure uploaded successfully.");
      } else {
        setSuccess(false);
        toast.warning(data?.message ?? "The PDF was uploaded, but no readable text was found to index.");
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail || error.response?.data?.message || `Couldn't reach backend at ${API_BASE}/upload`
        : (error as Error).message;
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-1">Upload Brochure</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Upload the official college brochure (PDF). It will be indexed for the AI assistant.
      </p>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft mb-6">
        <label
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFile(event.dataTransfer.files?.[0] ?? null);
          }}
          className={`block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${dragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/40"
            }`}
        >
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          />
          <CloudUpload className="w-12 h-12 mx-auto text-primary mb-3" />
          <div className="font-semibold">Drag & drop your PDF here</div>
          <div className="text-sm text-muted-foreground mt-1">or click to browse. PDF only.</div>
        </label>

        {file && (
          <div className="mt-6 border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <button
                onClick={upload}
                disabled={uploading}
                className="px-4 py-2 rounded-lg bg-primary-gradient text-primary-foreground text-sm font-medium shadow-elegant disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {(uploading || progress > 0) && (
              <div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-gradient"
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{progress}%</div>
              </div>
            )}
            {success && (
              <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Brochure uploaded successfully.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <div className="font-semibold mb-4">Current Brochure</div>
        {brochure ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Info label="File" value={brochure.name} />
            <Info label="Chunks Indexed" value={String(brochure.chunks)} />
            <Info label="Status" value="Ready for Chat" success />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No brochure uploaded yet.</div>
        )}
      </div>
    </motion.div>
  );
}

function Info({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={`font-semibold mt-1 flex items-center gap-1.5 ${success ? "text-emerald-600" : ""}`}
      >
        {success && <CheckCircle2 className="w-4 h-4" />} <span className="truncate">{value}</span>
      </div>
    </div>
  );
}

function formatSubmittedDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function LeadsPanel() {
  const [leads, setLeads] = useState<Array<Record<string, string>>>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const loadLeads = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/leads`);
      setLeads(data?.leads ?? []);
      setSelectedIds([]);
    } catch {
      setLeads([]);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const toggleSelection = (leadId: string) => {
    setSelectedIds((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]));
  };

  const startEdit = (lead: Record<string, string>) => {
    setEditingId(String(lead.id));
    setDraft({
      full_name: lead.full_name ?? "",
      current_class: lead.current_class ?? "",
      program_interest: lead.program_interest ?? "",
      phone_number: lead.phone_number ?? "",
      gpa: lead.gpa ?? lead.marks_12 ?? "",
      email: lead.email ?? "",
    });
  };

  const saveEdit = async (leadId: string) => {
    try {
      await axios.put(`${API_BASE}/leads/${leadId}`, draft);
      setEditingId(null);
      setDraft({});
      await loadLeads();
      toast.success("Lead updated.");
    } catch {
      toast.error("Could not update lead.");
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      await axios.delete(`${API_BASE}/leads/${leadId}`);
      await loadLeads();
      toast.success("Lead deleted.");
    } catch {
      toast.error("Could not delete lead.");
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      await axios.post(`${API_BASE}/leads/delete-selected`, { lead_ids: selectedIds });
      await loadLeads();
      toast.success("Selected leads deleted.");
    } catch {
      toast.error("Could not delete selected leads.");
    }
  };

  const clearAll = async () => {
    try {
      await axios.delete(`${API_BASE}/leads`);
      await loadLeads();
      toast.success("All leads cleared.");
    } catch {
      toast.error("Could not clear leads.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-1">My Leads</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Student enquiries submitted through the form are listed here.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={deleteSelected} disabled={selectedIds.length === 0} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">
          Delete selected
        </button>
        <button onClick={clearAll} className="rounded-lg border border-border px-3 py-2 text-sm">
          Delete all leads
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Select</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Class</th>
                <th className="px-4 py-3 font-semibold">Program</th>
                <th className="px-4 py-3 font-semibold">GPA</th>
                <th className="px-4 py-3 font-semibold">Phone number</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                    No leads yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead, index) => {
                  const leadId = String(lead.id ?? "");
                  const isEditing = editingId === leadId;
                  return (
                    <tr key={`${lead.email ?? index}-${index}`} className="border-t border-border">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedIds.includes(leadId)} onChange={() => toggleSelection(leadId)} />
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? <input value={draft.full_name ?? ""} onChange={(event) => setDraft((prev) => ({ ...prev, full_name: event.target.value }))} className="w-full rounded border border-border px-2 py-1" /> : (lead.full_name ?? "—")}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? <input value={draft.current_class ?? ""} onChange={(event) => setDraft((prev) => ({ ...prev, current_class: event.target.value }))} className="w-full rounded border border-border px-2 py-1" /> : (lead.current_class ?? "—")}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? <input value={draft.program_interest ?? ""} onChange={(event) => setDraft((prev) => ({ ...prev, program_interest: event.target.value }))} className="w-full rounded border border-border px-2 py-1" /> : (lead.program_interest ?? "—")}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? <input value={draft.gpa ?? ""} onChange={(event) => setDraft((prev) => ({ ...prev, gpa: event.target.value }))} className="w-full rounded border border-border px-2 py-1" /> : (lead.gpa ?? lead.marks_12 ?? "—")}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? <input value={draft.email ?? ""} onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))} className="w-full rounded border border-border px-2 py-1" /> : (lead.email ?? "—")}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? <input value={draft.phone_number ?? ""} onChange={(event) => setDraft((prev) => ({ ...prev, phone_number: event.target.value }))} className="w-full rounded border border-border px-2 py-1" /> : (lead.phone_number ?? "—")}
                      </td>
                      <td className="px-4 py-3">{formatSubmittedDate(lead.submitted_at)}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <button onClick={() => saveEdit(leadId)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Save</button>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(lead)} className="rounded border border-border p-1.5"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => deleteLead(leadId)} className="rounded border border-border p-1.5"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-muted-foreground text-sm mb-6">Configure your UniGuide AI backend.</p>
      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-4 max-w-xl">
        <Field label="Backend URL" value={API_BASE} />
        <Field label="Chat Endpoint" value="POST /chat" />
        <Field label="Upload Endpoint" value="POST /upload" />
        <Field label="College" value="Techspire College · techspire.edu.np" />
      </div>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <input
        readOnly
        value={value}
        className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
