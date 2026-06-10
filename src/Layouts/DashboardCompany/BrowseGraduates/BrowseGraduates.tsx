import { useState } from "react";
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Axios instance (FIXED: Default port updated to 5000 per API doc) ─────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── API Calls ────────────────────────────────────────────────────────────────
const fetchGraduates = async (filters: FiltersState, page: number) => {
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
  return data;
};

// NEW: Fetch all currently shortlisted items to accurately persist star icons
const fetchShortlistedGraduates = async () => {
  const { data } = await api.get("/company/shortlisted");
  return data;
};

// FIXED: Changed from GET with params to PUT with a path parameter /:graduateId
const addToShortlist = async (graduateId: string) => {
  const { data } = await api.put(`/company/shortlist/${graduateId}`);
  return data;
};

const removeFromShortlist = async (graduateId: string) => {
  const { data } = await api.delete(`/company/shortlist/${graduateId}`);
  return data;
};

// ─── ScoreBar Component ───────────────────────────────────────────────────────
const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs text-[#7b74e6] mb-1">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="h-1.5 bg-[#f3f0ff] rounded-full">
      <div
        className="h-1.5 bg-[#6c63ff] rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// ─── Main Component ───────────────────────────────────────────────────────────
const BrowseGraduates = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const [appliedFilters, setAppliedFilters] = useState<FiltersState>({
    track: "all", englishScore: "", technicalScore: "",
    iqScore: "", gender: "All", graduationYear: "all",
  });
  const [draftFilters, setDraftFilters] = useState<FiltersState>({ ...appliedFilters });

  // ── Query: Fetch Graduates ──
  const { data, isLoading, isError } = useQuery({
    queryKey: ["graduates", appliedFilters, currentPage],
    queryFn: () => fetchGraduates(appliedFilters, currentPage),
  });

  // ── Query: Fetch Shortlist State ──
  const { data: shortlistData } = useQuery({
    queryKey: ["shortlistedGraduates"],
    queryFn: fetchShortlistedGraduates,
  });

  const graduates: Graduate[] = data?.data?.graduates ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  // Extract array of IDs that are currently starred on the backend database
  const shortlistedIds: string[] = shortlistData?.data?.shortlists?.map((item: any) => item._id) ?? [];

  // ── Add Mutation (FIXED: Invalidates cache cleanly for instant visual updates) ──
  const addMutation = useMutation({
    mutationFn: addToShortlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlistedGraduates"] });
    },
  });

  // ── Remove Mutation ──
  const removeMutation = useMutation({
    mutationFn: removeFromShortlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlistedGraduates"] });
    },
  });

  const toggleShortlist = (id: string) => {
    if (shortlistedIds.includes(id)) {
      removeMutation.mutate(id);
    } else {
      addMutation.mutate(id);
    }
  };

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

      {/* ── Filters Card ── */}
      <Card className="border border-[#e8e4ff] shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-6 gap-4">
            {/* TRACK */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">TRACK</p>
              <Select value={draftFilters.track} onValueChange={(v) => setDraftFilters(p => ({ ...p, track: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]">
                  <SelectValue placeholder="All Tracks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tracks</SelectItem>
                  {["Frontend", "Backend", "UI/UX", "Fullstack"].map((t) => (
                    <SelectItem key={t} value={t}>{t} Track</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ENGLISH SCORE */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">ENGLISH SCORE (MIN)</p>
              <Select value={draftFilters.englishScore} onValueChange={(v) => setDraftFilters(p => ({ ...p, englishScore: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]">
                  <SelectValue placeholder="Select Score" />
                </SelectTrigger>
                <SelectContent>
                  {["70","75","80","85","90"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* TECHNICAL SCORE */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">TECHNICAL SCORE (MIN)</p>
              <Select value={draftFilters.technicalScore} onValueChange={(v) => setDraftFilters(p => ({ ...p, technicalScore: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]">
                  <SelectValue placeholder="Select Score" />
                </SelectTrigger>
                <SelectContent>
                  {["70","75","80","85","90"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* IQ SCORE */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">IQ SCORE (MIN)</p>
              <Select value={draftFilters.iqScore} onValueChange={(v) => setDraftFilters(p => ({ ...p, iqScore: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]">
                  <SelectValue placeholder="Select Score" />
                </SelectTrigger>
                <SelectContent>
                  {["70","75","80","85","90"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* GENDER */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">GENDER</p>
              <Select value={draftFilters.gender} onValueChange={(v) => setDraftFilters(p => ({ ...p, gender: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {["All","Male","Female"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* GRADUATION YEAR */}
            <div>
              <p className="text-xs font-semibold text-[#7b74e6] tracking-wide mb-2">GRADUATION YEAR</p>
              <Select value={draftFilters.graduationYear} onValueChange={(v) => setDraftFilters(p => ({ ...p, graduationYear: v }))}>
                <SelectTrigger className="border-[#b8a9ff] focus:ring-[#6c63ff]">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {["2024","2023","2022"].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
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

      {/* ── Loading Skeleton State ── */}
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

      {/* ── Error State ── */}
      {isError && (
        <div className="text-center py-10 text-red-400">
          Failed to load graduates. Please check server connections.
        </div>
      )}

      {/* ── Graduate Cards List View ── */}
      {!isLoading && !isError && (
        <>
          {graduates.length === 0 ? (
            <div className="text-center py-10 text-[#7b74e6]">No graduates found matching criteria.</div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {graduates.map((g) => {
                const isStarred = shortlistedIds.includes(g._id);
                const isPending =
                  (addMutation.isPending && addMutation.variables === g._id) ||
                  (removeMutation.isPending && removeMutation.variables === g._id);

                return (
                  <Card key={g._id} className="border border-[#e8e4ff] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 relative">
                      
                      {/* Star shortlist button */}
                      <button
                        onClick={() => toggleShortlist(g._id)}
                        disabled={isPending}
                        className="absolute top-4 right-4 text-[#b8a9ff] hover:text-yellow-400 transition-colors disabled:opacity-40"
                        title={isStarred ? "Remove from shortlist" : "Add to shortlist"}
                      >
                        <Star
                          className={`w-4 h-4 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`}
                        />
                      </button>

                      {/* Profile Image / Initials Avatar */}
                      {g.profilePicture && !g.profilePicture.includes("default") ? (
                        <img
                          src={g.profilePicture}
                          alt={g.fullName}
                          className="w-12 h-12 rounded-full object-cover mb-3"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#111033] text-white flex items-center justify-center text-sm font-semibold mb-3">
                          {getInitials(g.fullName)}
                        </div>
                      )}

                      <h3 className="font-semibold text-[#111033] text-sm truncate">{g.fullName}</h3>
                      <Badge className="bg-[#f3f0ff] text-[#6c63ff] hover:bg-[#f3f0ff] mb-4 mt-1 text-xs">
                        {g.track} Track
                      </Badge>

                      <ScoreBar label="IQ Score" value={g.scores?.iq ?? 0} />
                      <ScoreBar label="English Score" value={g.scores?.english ?? 0} />
                      <ScoreBar label="Technical Score" value={g.scores?.technical ?? 0} />

                      <Button
                        variant="outline"
                        className="w-full mt-4 border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]"
                      >
                        Contact
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* ── Pagination Controls ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline" size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-[#b8a9ff] text-[#6c63ff]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  size="icon"
                  className={
                    currentPage === p
                      ? "bg-[#6c63ff] text-white hover:bg-[#4d44db]"
                      : "border border-[#b8a9ff] text-[#6c63ff] bg-white hover:bg-[#f3f0ff]"
                  }
                >
                  {p}
                </Button>
              ))}

              {totalPages > 5 && <span className="text-[#b8a9ff]">...</span>}

              <Button
                variant="outline" size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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