import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { Star, Search, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface Graduate {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  university: string;
  graduationYear: number;
  track: string;
  profilePicture: string;
  iqScore?: number;
  englishScore?: number;
  technicalScore?: number;
  cv?: string | null;
  gitHubProfile?: string | null;
  linkedInProfile?: string | null;
  portfolioLink?: string | null;
}

interface Filters {
  track: string;
  englishScore: string;
  technicalScore: string;
  iqScore: string;
  gender: string;
  graduationYear: string;
}

interface ContactForm {
  jobTitle: string;
  message: string;
}

// ── CONSTANTS ───────────────────────────────────────────────────────────────
const TRACKS = ["All Tracks", "Frontend", "Backend", "Fullstack", "UI/UX"];
const SCORES = ["Select Score", "60", "70", "80", "90"];
const GENDERS = ["All", "Male", "Female"];
const YEARS = ["All Years", "2021", "2022", "2023", "2024", "2025", "2026"];
const PAGE_SIZE = 8;

const EMPTY_FILTERS: Filters = {
  track: "",
  englishScore: "",
  technicalScore: "",
  iqScore: "",
  gender: "",
  graduationYear: "",
};

// ── HELPERS ─────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  if (!name?.trim()) return "?";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function meetsScoreFilter(value: number | undefined, min: string): boolean {
  if (!min || min === "Select Score") return true;
  if (value === undefined || value === null) return false;
  return value >= Number(min);
}

function passesFilters(grad: Graduate, f: Filters): boolean {
  if (f.track && f.track !== "All Tracks") {
    if (!grad.track?.toLowerCase().includes(f.track.toLowerCase())) return false;
  }
  if (f.gender && f.gender !== "All") {
    if (grad.gender?.toLowerCase() !== f.gender.toLowerCase()) return false;
  }
  if (f.graduationYear && f.graduationYear !== "All Years") {
    if (String(grad.graduationYear) !== f.graduationYear) return false;
  }
  if (!meetsScoreFilter(grad.englishScore, f.englishScore)) return false;
  if (!meetsScoreFilter(grad.technicalScore, f.technicalScore)) return false;
  if (!meetsScoreFilter(grad.iqScore, f.iqScore)) return false;
  return true;
}

// ── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function ScoreBar({ value }: { value?: number }) {
  const pct = value != null ? Math.min(Math.max(value, 0), 100) : 0;
  return (
    <div className="w-full h-1.5 rounded-full bg-gray-100 mt-1">
      <div
        className="h-1.5 rounded-full bg-[#6c63d4] transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function AvatarCircle({ name }: { name: string }) {
  return (
    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm shrink-0 select-none">
      {getInitials(name)}
    </div>
  );
}

// ── CONTACT MODAL ────────────────────────────────────────────────────────────
interface ContactModalProps {
  graduate: Graduate;
  onClose: () => void;
}

function ContactModal({ graduate, onClose }: ContactModalProps) {
  const [form, setForm] = useState<ContactForm>({ jobTitle: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!form.jobTitle.trim() || !form.message.trim()) {
      toast.error("Please fill in both fields.");
      return;
    } // Fixed syntax here: changed </div> back to }
    setSending(true);
    try {
      await axiosinstance.post(`api/v1/company/contact/${graduate._id}`, {
        jobTitle: form.jobTitle.trim(),
        message: form.message.trim(),
      });
      toast.success("Job offer sent successfully!");
      onClose();
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Send Job Offer</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              To{" "}
              <span className="text-[#6c63d4] font-medium">
                {graduate.fullName?.trim() || graduate.email}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Job Title
          </label>
          <input
            type="text"
            placeholder="e.g. Junior Frontend Developer"
            value={form.jobTitle}
            onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Message
          </label>
          <textarea
            rows={4}
            placeholder="Write a short message to the graduate..."
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex-1 py-2.5 rounded-xl bg-[#6c63d4] text-white text-sm font-semibold hover:bg-[#5a4fcf] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {sending ? "Sending..." : "Send Offer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── GRADUATE CARD ────────────────────────────────────────────────────────────
interface GraduateCardProps {
  grad: Graduate;
  isShortlisted: boolean;
  onToggleShortlist: (id: string, isShortlisted: boolean) => void;
  onContact: (grad: Graduate) => void;
}

function GraduateCard({ grad, isShortlisted, onToggleShortlist, onContact }: GraduateCardProps) {
  const name = grad.fullName?.trim() || "—";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <AvatarCircle name={name} />
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{name}</p>
            <p className="text-xs text-[#6c63d4] font-medium mt-0.5">
              {grad.track ? `${grad.track} Track` : "—"}
            </p>
          </div>
        </div>

        {/* Dynamic Star Button (Toggle add/remove) */}
        <button
          onClick={() => onToggleShortlist(grad._id, isShortlisted)}
          className={`p-1.5 rounded-full transition-colors ${
            isShortlisted
              ? "text-[#6c63d4]"
              : "text-gray-300 hover:text-[#6c63d4]"
          }`}
          title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
          aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
        >
          <Star
            className="w-5 h-5"
            fill={isShortlisted ? "#6c63d4" : "none"}
          />
        </button>
      </div>

      <div className="space-y-2.5">
        {(
          [
            ["IQ Score", grad.iqScore],
            ["English Score", grad.englishScore],
            ["Technical Score", grad.technicalScore],
          ] as [string, number | undefined][]
        ).map(([label, val]) => (
          <div key={label}>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-gray-800">{val ?? "—"}</span>
            </div>
            <ScoreBar value={val} />
          </div>
        ))}
      </div>

      <button
        onClick={() => onContact(grad)}
        className="mt-auto w-full py-2.5 rounded-xl border border-[#6c63d4] text-[#6c63d4] text-sm font-semibold hover:bg-[#6c63d4] hover:text-white transition-colors"
      >
        Contact
      </button>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
const BrowseGraduates = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS });
  const [applied, setApplied] = useState<Filters>({ ...EMPTY_FILTERS });
  const [page, setPage] = useState(1);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [contactTarget, setContactTarget] = useState<Graduate | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["graduates"],
    queryFn: async () => {
      const res = await axiosinstance.get("api/v1/company/graduates");
      return res.data;
    },
  });

  const allGraduates: Graduate[] = data?.data?.graduates || [];

  const filtered = allGraduates.filter((g) => passesFilters(g, applied));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── ADD TO SHORTLIST MUTATION ──
  const { mutate: addToShortlist } = useMutation({
    mutationFn: (graduateId: string) =>
      axiosinstance.post(`api/v1/company/shortlist/${graduateId}`),
    onSuccess: (_data, graduateId) => {
      setShortlisted((prev) => {
        const next = new Set(prev);
        next.add(graduateId);
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["shortlisted"] });
      toast.success("Added to shortlist!");
    },
    onError: () => toast.error("Already shortlisted or an error occurred."),
  });

  // ── REMOVE FROM SHORTLIST MUTATION ──
  const { mutate: removeFromShortlist } = useMutation({
    mutationFn: (graduateId: string) =>
      axiosinstance.delete(`api/v1/company/shortlist/${graduateId}`),
    onSuccess: (_data, graduateId) => {
      setShortlisted((prev) => {
        const next = new Set(prev);
        next.delete(graduateId);
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["shortlisted"] });
      toast.success("Removed from shortlist!");
    },
    onError: () => toast.error("Failed to remove from shortlist."),
  });

  // ── CONTROLLER HANDLER FOR DYNAMIC TOGGLE ──
  const handleToggleShortlist = (graduateId: string, isShortlisted: boolean) => {
    if (isShortlisted) {
      removeFromShortlist(graduateId);
    } else {
      addToShortlist(graduateId);
    }
  };

  const handleSearch = () => {
    setApplied({ ...filters });
    setPage(1);
  };

  const handleClear = () => {
    setFilters({ ...EMPTY_FILTERS });
    setApplied({ ...EMPTY_FILTERS });
    setPage(1);
  };

  const setFilter = (key: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const sel =
    "h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition cursor-pointer";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Browse Graduates</h1>

      {/* Bar Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Track
            </label>
            <select value={filters.track} onChange={setFilter("track")} className={sel}>
              {TRACKS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              English Score (Min)
            </label>
            <select value={filters.englishScore} onChange={setFilter("englishScore")} className={sel}>
              {SCORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Technical Score (Min)
            </label>
            <select
              value={filters.technicalScore}
              onChange={setFilter("technicalScore")}
              className={sel}
            >
              {SCORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              IQ Score (Min)
            </label>
            <select value={filters.iqScore} onChange={setFilter("iqScore")} className={sel}>
              {SCORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Gender
            </label>
            <select value={filters.gender} onChange={setFilter("gender")} className={sel}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Graduation Year
            </label>
            <select
              value={filters.graduationYear}
              onChange={setFilter("graduationYear")}
              className={sel}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#6c63d4] text-white text-sm font-semibold hover:bg-[#5a4fcf] transition-colors"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#6c63d4] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 font-medium py-10">
          Failed to load graduates. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <>
          {filtered.length > 0 && (
            <p className="text-sm text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
              graduate{filtered.length !== 1 ? "s" : ""}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-16 text-sm">
              No graduates found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {paginated.map((grad) => (
                <GraduateCard
                  key={grad._id}
                  grad={grad}
                  isShortlisted={shortlisted.has(grad._id)}
                  onToggleShortlist={handleToggleShortlist}
                  onContact={setContactTarget}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:border-[#6c63d4] hover:text-[#6c63d4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &lt;
              </button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="text-gray-400 text-sm px-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                      page === p
                        ? "bg-[#6c63d4] text-white"
                        : "border border-gray-200 text-gray-600 hover:border-[#6c63d4] hover:text-[#6c63d4]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:border-[#6c63d4] hover:text-[#6c63d4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}

      {contactTarget && (
        <ContactModal
          graduate={contactTarget}
          onClose={() => setContactTarget(null)}
        />
      )}
    </div>
  );
};

export default BrowseGraduates;