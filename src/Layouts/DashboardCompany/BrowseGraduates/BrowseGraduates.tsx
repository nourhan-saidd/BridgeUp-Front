import { useState } from "react";
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Graduate {
  _id: string;
  fullName: string;
  track: string;
  gender: string;
  graduationYear: string;
  profilePicture?: string;
  scores: {
    iq: number;
    english: number;
    technical: number;
  };
}

interface FiltersState {
  track: string;
  englishScore: string;
  technicalScore: string;
  iqScore: string;
  gender: string;
  graduationYear: string;
}

// ─── Axios instance ───────────────────────────────────────────────────────────
// TODO: move baseURL to .env as VITE_API_BASE_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
});

// attach token automatically on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Fetch function ───────────────────────────────────────────────────────────
const fetchGraduates = async (filters: FiltersState, page: number) => {
  // TODO: replace "/company/graduates" with the real endpoint when you get it
  const { data } = await api.get("/company/graduates", {
    params: {
      page,
      limit: 4,
      ...(filters.track && filters.track !== "all" && { track: filters.track }),
      ...(filters.englishScore && { minEnglish: filters.englishScore }),
      ...(filters.technicalScore && { minTechnical: filters.technicalScore }),
      ...(filters.iqScore && { minIq: filters.iqScore }),
      ...(filters.gender && filters.gender !== "All" && { gender: filters.gender }),
      ...(filters.graduationYear && filters.graduationYear !== "all" && { graduationYear: filters.graduationYear }),
    },
  });
  return data; // expected: { status, results, totalPages, data: { graduates: [...] } }
};

// ─── ScoreBar ─────────────────────────────────────────────────────────────────
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

// ─── Helper: get initials ─────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// ─── Main Component ───────────────────────────────────────────────────────────
const BrowseGraduates = () => {
  const [starred, setStarred] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // separate "applied" filters (sent to API) from "draft" filters (in the selects)
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>({
    track: "all", englishScore: "", technicalScore: "",
    iqScore: "", gender: "All", graduationYear: "all",
  });
  const [draftFilters, setDraftFilters] = useState<FiltersState>({ ...appliedFilters });

  // ── TanStack Query ──
  const { data, isLoading, isError } = useQuery({
    queryKey: ["graduates", appliedFilters, currentPage],
    queryFn: () => fetchGraduates(appliedFilters, currentPage),
  });

  const graduates: Graduate[] = data?.data?.graduates ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  const toggleStar = (id: string) =>
    setStarred((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedFilters({ ...draftFilters });
  };

  const handleClear = () => {
    const empty: FiltersState = {
      track: "all", englishScore: "", technicalScore: "",
      iqScore: "", gender: "All", graduationYear: "all",
    };
    setDraftFilters(empty);
    setAppliedFilters(empty);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#111033]">Browse Graduates</h1>

      {/* ── Filters ── */}
      <Card className="border border-[#e8e4ff] shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-6 gap-4">

            {/* TRACK */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">TRACK</p>
              <Select value={draftFilters.track} onValueChange={(v) => setDraftFilters(p => ({ ...p, track: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]"><SelectValue placeholder="All Tracks" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tracks</SelectItem>
                  {["Frontend", "Backend", "UI/UX", "Fullstack"].map(t => (
                    <SelectItem key={t} value={t}>{t} Track</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ENGLISH SCORE */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">ENGLISH SCORE (MIN)</p>
              <Select value={draftFilters.englishScore} onValueChange={(v) => setDraftFilters(p => ({ ...p, englishScore: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]"><SelectValue placeholder="Select Score" /></SelectTrigger>
                <SelectContent>{["70","75","80","85","90"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* TECHNICAL SCORE */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">TECHNICAL SCORE (MIN)</p>
              <Select value={draftFilters.technicalScore} onValueChange={(v) => setDraftFilters(p => ({ ...p, technicalScore: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]"><SelectValue placeholder="Select Score" /></SelectTrigger>
                <SelectContent>{["70","75","80","85","90"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* IQ SCORE */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">IQ SCORE (MIN)</p>
              <Select value={draftFilters.iqScore} onValueChange={(v) => setDraftFilters(p => ({ ...p, iqScore: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]"><SelectValue placeholder="Select Score" /></SelectTrigger>
                <SelectContent>{["70","75","80","85","90"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* GENDER */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">GENDER</p>
              <Select value={draftFilters.gender} onValueChange={(v) => setDraftFilters(p => ({ ...p, gender: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>{["All","Male","Female"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* GRADUATION YEAR */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">GRADUATION YEAR</p>
              <Select value={draftFilters.graduationYear} onValueChange={(v) => setDraftFilters(p => ({ ...p, graduationYear: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]"><SelectValue placeholder="All Years" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {["2024","2023","2022"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="flex justify-end items-center gap-3 mt-4">
            <button onClick={handleClear} className="text-sm text-[#7b74e6] hover:text-[#6c63ff]">
              Clear Filters
            </button>
            <Button onClick={handleSearch} className="bg-[#6c63ff] hover:bg-[#4d44db] text-white gap-2">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border border-[#e8e4ff] animate-pulse">
              <CardContent className="p-5 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#e8e4ff]" />
                <div className="h-3 bg-[#e8e4ff] rounded w-3/4" />
                <div className="h-3 bg-[#e8e4ff] rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {isError && (
        <div className="text-center py-10 text-red-400">
          Failed to load graduates. Please try again.
        </div>
      )}

      {/* ── Cards ── */}
      {!isLoading && !isError && (
        <>
          {graduates.length === 0 ? (
            <div className="text-center py-10 text-[#7b74e6]">No graduates found.</div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {graduates.map((g) => (
                <Card key={g._id} className="border border-[#e8e4ff] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 relative">
                    <button
                      onClick={() => toggleStar(g._id)}
                      className="absolute top-4 right-4 text-[#b8a9ff] hover:text-yellow-400 transition-colors"
                    >
                      <Star className={`w-4 h-4 ${starred.includes(g._id) ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </button>

                    <div className="w-12 h-12 rounded-full bg-[#111033] text-white flex items-center justify-center text-sm font-semibold mb-3">
                      {getInitials(g.fullName)}
                    </div>

                    <h3 className="font-semibold text-[#111033] text-sm">{g.fullName}</h3>
                    <Badge className="bg-[#f3f0ff] text-[#6c63ff] hover:bg-[#f3f0ff] mb-4 mt-1 text-xs">
                      {g.track} Track
                    </Badge>

                    <ScoreBar label="IQ Score" value={g.scores?.iq ?? 0} />
                    <ScoreBar label="English Score" value={g.scores?.english ?? 0} />
                    <ScoreBar label="Technical Score" value={g.scores?.technical ?? 0} />

                    <Button variant="outline" className="w-full mt-4 border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]">
                      Contact
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline" size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-[#b8a9ff] text-[#6c63ff]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <Button key={p} onClick={() => setCurrentPage(p)} size="icon"
                  className={currentPage === p
                    ? "bg-[#6c63ff] text-white hover:bg-[#4d44db]"
                    : "border border-[#b8a9ff] text-[#6c63ff] bg-white hover:bg-[#f3f0ff]"
                  }>
                  {p}
                </Button>
              ))}

              {totalPages > 5 && <span className="text-[#b8a9ff]">...</span>}

              <Button
                variant="outline" size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="border-[#b8a9ff] text-[#6c63ff]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseGraduates;