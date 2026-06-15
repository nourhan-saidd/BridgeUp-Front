import { useState, useContext, useEffect } from "react";
import { Search, Star, X } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import { toast } from "sonner";

// ── TYPES ──────────────────────────────────────────────────────────────────────
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
  scores?: { iq?: number; english?: number; technical?: number };
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

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const TRACKS    = ["All Tracks", "Frontend", "Backend", "Fullstack", "UI/UX"];
const SCORES    = ["Select Score", "60", "70", "80", "90"];
const GENDERS   = ["All", "Male", "Female"];
const YEARS     = ["All Years", "2021", "2022", "2023", "2024", "2025", "2026"];
const PAGE_SIZE = 8;

const EMPTY_FILTERS: Filters = {
  track: "", englishScore: "", technicalScore: "",
  iqScore: "", gender: "", graduationYear: "",
};

// ── HELPERS ────────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  if (!name?.trim()) return "?";
  return name.trim().split(" ").filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join("");
}

function meetsScore(value: number | undefined, min: string): boolean {
  if (!min || min === "Select Score") return true;
  if (value === undefined || value === null) return false;
  return value >= Number(min);
}

function passesFilters(grad: Graduate, f: Filters): boolean {
  if (f.track && f.track !== "All Tracks")
    if (!grad.track?.toLowerCase().includes(f.track.toLowerCase())) return false;
  if (f.gender && f.gender !== "All")
    if (grad.gender?.toLowerCase() !== f.gender.toLowerCase()) return false;
  if (f.graduationYear && f.graduationYear !== "All Years")
    if (String(grad.graduationYear) !== f.graduationYear) return false;
  const eng  = grad.englishScore   ?? grad.scores?.english;
  const tech = grad.technicalScore ?? grad.scores?.technical;
  const iq   = grad.iqScore        ?? grad.scores?.iq;
  if (!meetsScore(eng,  f.englishScore))   return false;
  if (!meetsScore(tech, f.technicalScore)) return false;
  if (!meetsScore(iq,   f.iqScore))        return false;
  return true;
}

// ── SCORE BAR ──────────────────────────────────────────────────────────────────
const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs text-[#7b74e6] mb-1">
      <span>{label}</span><span>{value}</span>
    </div>
    <div className="h-1.5 bg-[#f3f0ff] rounded-full">
      <div className="h-1.5 bg-[#6c63ff] rounded-full transition-all" style={{ width: `${value}%` }} />
    </div>
  </div>
);

// ── CONTACT MODAL ──────────────────────────────────────────────────────────────
const ContactModal = ({
  graduate,
  token,
  onClose,
}: {
  graduate: Graduate;
  token: string;
  onClose: () => void;
}) => {
  const [position, setPosition] = useState("");
  const [message, setMessage]   = useState(
    "We are impressed with your profile and would like to offer you this position."
  );
  const [sent, setSent] = useState(false);

  const offerMutation = useMutation({
    mutationFn: () =>
      axiosinstance
        .post(
          "api/v1/offers",
          { graduate: graduate._id, position, message },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((r) => r.data),
    onSuccess: () => setSent(true),
    onError:   () => toast.error("Failed to send offer. Try again."),
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#f3f0ff] flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-[#6c63ff] fill-[#6c63ff]" />
            </div>
            <h3 className="text-lg font-bold text-[#111033] mb-1">Offer Sent!</h3>
            <p className="text-sm text-[#7b74e6]">Your offer was sent to {graduate.fullName}.</p>
            <Button onClick={onClose} className="mt-4 bg-[#6c63ff] hover:bg-[#4d44db] text-white">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-[#111033] mb-1">Contact Graduate</h3>
            <p className="text-sm text-[#7b74e6] mb-4">
              Send an offer to <span className="font-semibold">{graduate.fullName}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#7b74e6] block mb-1">POSITION</label>
                <input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full border border-[#b8a9ff] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#7b74e6] block mb-1">MESSAGE</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full border border-[#b8a9ff] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="outline" onClick={onClose}
                className="flex-1 border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!position.trim()) return toast.error("Please enter a position.");
                  offerMutation.mutate();
                }}
                disabled={offerMutation.isPending}
                className="flex-1 bg-[#6c63ff] hover:bg-[#4d44db] text-white"
              >
                {offerMutation.isPending ? "Sending..." : "Send Offer"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── GRADUATE CARD ──────────────────────────────────────────────────────────────
const GraduateCard = ({
  grad,
  isShortlisted,
  onToggleShortlist,
  onContact,
}: {
  grad: Graduate;
  isShortlisted: boolean;
  onToggleShortlist: (id: string, isShortlisted: boolean) => void;
  onContact: (g: Graduate) => void;
}) => {
  const iq   = grad.iqScore        ?? grad.scores?.iq   ?? 0;
  const eng  = grad.englishScore   ?? grad.scores?.english   ?? 0;
  const tech = grad.technicalScore ?? grad.scores?.technical ?? 0;

  const hasPicture = grad.profilePicture && grad.profilePicture.trim() !== "";

  return (
    <Card className="border border-[#e8e4ff] shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 relative">
        {/* Star */}
        <button
          onClick={() => onToggleShortlist(grad._id, isShortlisted)}
          className="absolute top-4 right-4 text-[#b8a9ff] hover:text-yellow-400 transition-colors"
          title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
        >
          <Star className={`w-4 h-4 ${isShortlisted ? "fill-yellow-400 text-yellow-400" : ""}`} />
        </button>

        {/* Profile Avatar Outer Wrapper Container */}
        <div className="w-12 h-12 mb-3 relative overflow-hidden rounded-full border border-gray-100 shadow-sm bg-[#f3f0ff]">
          {hasPicture ? (
            <img
              src={
                (() => {
                  if (grad.profilePicture.startsWith("http")) return grad.profilePicture;
                  if (grad.profilePicture.includes("\\uploads\\")) {
                    return `http://localhost:5000/uploads/${grad.profilePicture.split("\\uploads\\")[1]}`;
                  }
                  if (grad.profilePicture.includes("/uploads/")) {
                    return `http://localhost:5000/uploads/${grad.profilePicture.split("/uploads/")[1]}`;
                  }
                  return `http://localhost:5000${grad.profilePicture.startsWith("/") ? "" : "/"}${grad.profilePicture}`;
                })()
              }
              alt={grad.fullName}
              className="w-full h-full object-cover absolute inset-0 z-10"
              onError={(e) => {
                // Instantly hide the broken image item so the clean initials fallback div can show below it
                e.currentTarget.style.display = "none";
                const fallbackElement = document.getElementById(`fallback-browse-${grad._id}`);
                if (fallbackElement) fallbackElement.style.zIndex = "20";
              }}
            />
          ) : null}

          {/* Secure Initials Fallback */}
          <div
            id={`fallback-browse-${grad._id}`}
            className="w-full h-full absolute inset-0 flex items-center justify-center text-[#6c63ff] font-bold text-xs"
          >
            {getInitials(grad.fullName)}
          </div>
        </div>

        <h3 className="font-semibold text-[#111033] text-sm truncate pr-6">{grad.fullName}</h3>
        <Badge className="bg-[#f3f0ff] text-[#6c63ff] hover:bg-[#f3f0ff] mb-3 mt-1 text-xs">
          {grad.track} Track
        </Badge>

        <ScoreBar label="IQ Score"        value={iq} />
        <ScoreBar label="English Score"   value={eng} />
        <ScoreBar label="Technical Score" value={tech} />

        <Button
          variant="outline"
          onClick={() => onContact(grad)}
          className="w-full mt-4 border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]"
        >
          Contact
        </Button>
      </CardContent>
    </Card>
  );
};

// ── MAIN ───────────────────────────────────────────────────────────────────────
const BrowseGraduates = () => {
  const queryClient = useQueryClient();
  const { token }   = useContext(authContext);

  const [filters, setFilters]             = useState<Filters>({ ...EMPTY_FILTERS });
  const [applied, setApplied]             = useState<Filters>({ ...EMPTY_FILTERS });
  const [page, setPage]                   = useState(1);
  const [shortlisted, setShortlisted]     = useState<Set<string>>(new Set());
  const [contactTarget, setContactTarget] = useState<Graduate | null>(null);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ── FETCH GRADUATES ──
  const { data, isLoading, isError } = useQuery({
    queryKey: ["graduates"],
    queryFn:  () =>
      axiosinstance.get("api/v1/company/graduates", authHeaders).then((r) => r.data),
    enabled: !!token,
  });

  // ── FETCH SHORTLISTED ──
  const { data: shortlistData } = useQuery({
    queryKey: ["shortlistedGraduates"],
    queryFn:  () =>
      axiosinstance.get("api/v1/company/shortlisted", authHeaders).then((r) => r.data),
    enabled: !!token,
  });

  // ── SYNC SHORTLISTED IDS ──
  useEffect(() => {
    if (!shortlistData) return;
    const ids: string[] = shortlistData?.data?.shortlists
      ?.filter((item: any) => item.graduate)
      ?.map((item: any) => item.graduate._id) ?? [];
    setShortlisted(new Set(ids));
  }, [shortlistData]);

  const allGraduates: Graduate[] = data?.data?.graduates ?? [];
  const filtered   = allGraduates.filter((g) => passesFilters(g, applied));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── ADD TO SHORTLIST ──
  const { mutate: addToShortlist } = useMutation({
    mutationFn: (graduateId: string) =>
      axiosinstance.post(`api/v1/company/shortlist/${graduateId}`, {}, authHeaders),
    onSuccess: (_data, graduateId) => {
      setShortlisted((prev) => new Set(prev).add(graduateId));
      queryClient.invalidateQueries({ queryKey: ["shortlistedGraduates"] });
      toast.success("Added to shortlist!");
    },
    onError: () => toast.error("Already shortlisted or an error occurred."),
  });

  // ── REMOVE FROM SHORTLIST ──
  const { mutate: removeFromShortlist } = useMutation({
    mutationFn: (graduateId: string) =>
      axiosinstance.delete(`api/v1/company/shortlist/${graduateId}`, authHeaders),
    onSuccess: (_data, graduateId) => {
      setShortlisted((prev) => {
        const next = new Set(prev);
        next.delete(graduateId);
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["shortlistedGraduates"] });
      toast.success("Removed from shortlist!");
    },
    onError: () => toast.error("Failed to remove from shortlist."),
  });

  const handleToggleShortlist = (id: string, isAlreadyShortlisted: boolean) => {
    if (isAlreadyShortlisted) removeFromShortlist(id);
    else addToShortlist(id);
  };

  const handleSearch = () => { setApplied({ ...filters }); setPage(1); };
  const handleClear  = () => { setFilters({ ...EMPTY_FILTERS }); setApplied({ ...EMPTY_FILTERS }); setPage(1); };

  const setFilter = (key: keyof Filters) =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3)              return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const sel = "h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition cursor-pointer";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Browse Graduates</h1>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Track",                 key: "track",          options: TRACKS },
            { label: "English Score (Min)",   key: "englishScore",   options: SCORES },
            { label: "Technical Score (Min)", key: "technicalScore", options: SCORES },
            { label: "IQ Score (Min)",        key: "iqScore",        options: SCORES },
            { label: "Gender",                key: "gender",         options: GENDERS },
            { label: "Graduation Year",       key: "graduationYear", options: YEARS  },
          ].map(({ label, key, options }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {label}
              </label>
              <select
                value={filters[key as keyof Filters]}
                onChange={setFilter(key as keyof Filters)}
                className={sel}
              >
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button onClick={handleClear}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" /> Clear Filters
          </button>
          <button onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#6c63d4] text-white text-sm font-semibold hover:bg-[#5a4fcf] transition-colors">
            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#6c63d4] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center text-red-500 font-medium py-10">
          Failed to load graduates. Please try again.
        </div>
      )}

      {/* Cards */}
      {!isLoading && !isError && (
        <>
          {filtered.length > 0 && (
            <p className="text-sm text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 text-gray-500 text-sm hover:border-[#6c63d4] hover:text-[#6c63d4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &lt;
              </button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="text-gray-400 text-sm px-1">...</span>
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
                className="w-9 h-9 rounded-xl border border-gray-200 text-gray-500 text-sm hover:border-[#6c63d4] hover:text-[#6c63d4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}

      {/* Contact Modal */}
      {contactTarget && (
        <ContactModal
          graduate={contactTarget}
          token={token}
          onClose={() => setContactTarget(null)}
        />
      )}
    </div>
  );
};

export default BrowseGraduates;