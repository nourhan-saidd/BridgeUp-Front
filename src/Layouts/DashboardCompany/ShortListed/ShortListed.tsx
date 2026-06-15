import { useState, useEffect, useContext, useCallback } from "react";
import { Award, X, Star, User, Mail, Phone, GraduationCap, BookOpen, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api/v1";

// ── TYPES ──────────────────────────────────────────────────────────────────────
interface Candidate {
  shortlistId: string;
  graduateId: string;
  name: string;
  initials: string;
  track: string;
  addedAgo: string;
  university: string;
}

interface GraduateForOffer {
  _id: string;
  fullName: string;
}

interface GraduateProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  university: string;
  graduationYear: number;
  track: string;
  role: string;
  profilePicture: string;
  state: {
    iqScore: number;
    englishScore: number;
    technicalScore: number;
    assessmentStatus: string;
  };
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
const getInitials = (name: string): string => {
  if (!name) return "??";
  return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
};

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7)  return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
};

// ── PROFILE MODAL ──────────────────────────────────────────────────────────────
const ProfileModal = ({
  graduateId,
  token,
  onClose,
}: {
  graduateId: string;
  token: string;
  onClose: () => void;
}) => {
  const [profile, setProfile] = useState<GraduateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/company/graduates/${graduateId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.status === "success" && data.data) {
          setProfile(data.data);
        } else {
          throw new Error("Failed to load profile");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [graduateId, token]);

  const ScoreCircle = ({ label, value, color }: { label: string; value: number; color: string }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={radius} fill="none" stroke="#ede9ff" strokeWidth="6" />
            <circle
              cx="36" cy="36" r={radius} fill="none"
              stroke={color} strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#111033]">
            {value ?? 0}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#7b74e6] text-center leading-tight">{label}</span>
      </div>
    );
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined;
  }) => (
    <div className="flex items-center gap-3 py-3 border-b border-[#f0edff] last:border-0">
      <div className="w-8 h-8 rounded-lg bg-[#f3f0ff] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[#a89fe8] font-semibold uppercase tracking-widest">{label}</p>
        <p className="text-sm font-medium text-[#111033] truncate">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative overflow-hidden"
        style={{ maxHeight: "92vh" }}
      >
        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ maxHeight: "92vh" }}>

          {/* ── HERO HEADER ── */}
          <div className="relative bg-gradient-to-br from-[#6c63ff] to-[#4d44db] px-6 pt-8 pb-16">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-white/40 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {!loading && profile && (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg">
                  {getInitials(profile.fullName)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">{profile.fullName}</h2>
                  <p className="text-white/70 text-sm mt-0.5 capitalize">{profile.role || "Graduate"}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {profile.track} Track
                    </span>
                    {profile.state?.assessmentStatus && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          profile.state.assessmentStatus === "Completed"
                            ? "bg-green-400/20 text-green-200"
                            : "bg-yellow-400/20 text-yellow-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          profile.state.assessmentStatus === "Completed" ? "bg-green-300" : "bg-yellow-300"
                        }`} />
                        {profile.state.assessmentStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!loading && error && (
              <p className="text-white/80 text-sm text-center py-4">Failed to load profile.</p>
            )}
          </div>

          {/* ── SCORE CARDS (overlapping hero) ── */}
          {!loading && profile?.state && (
            <div className="mx-5 -mt-8 bg-white rounded-2xl shadow-lg border border-[#ede9ff] px-4 py-5 flex justify-around">
              <ScoreCircle label="IQ Score"        value={profile.state.iqScore        ?? 0} color="#6c63ff" />
              <ScoreCircle label="English"         value={profile.state.englishScore   ?? 0} color="#22c55e" />
              <ScoreCircle label="Technical"       value={profile.state.technicalScore ?? 0} color="#f59e0b" />
            </div>
          )}

          {/* ── INFO SECTION ── */}
          {!loading && profile && (
            <div className="px-5 pt-5 pb-6">

              {/* Personal Info */}
              <p className="text-[11px] font-bold text-[#a89fe8] uppercase tracking-widest mb-1 px-1">
                Personal Information
              </p>
              <div className="bg-[#faf9ff] rounded-2xl border border-[#f0edff] px-4 mb-4">
                <InfoRow
                  icon={<Mail className="w-4 h-4 text-[#6c63ff]" />}
                  label="Email"
                  value={profile.email}
                />
                <InfoRow
                  icon={<Phone className="w-4 h-4 text-[#6c63ff]" />}
                  label="Phone"
                  value={profile.phone}
                />
                <InfoRow
                  icon={<User className="w-4 h-4 text-[#6c63ff]" />}
                  label="Age"
                  value={profile.age ? `${profile.age} years old` : undefined}
                />
                <InfoRow
                  icon={
                    <svg className="w-4 h-4 text-[#6c63ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  label="Gender"
                  value={profile.gender}
                />
              </div>

              {/* Academic Info */}
              <p className="text-[11px] font-bold text-[#a89fe8] uppercase tracking-widest mb-1 px-1">
                Academic Information
              </p>
              <div className="bg-[#faf9ff] rounded-2xl border border-[#f0edff] px-4 mb-4">
                <InfoRow
                  icon={<GraduationCap className="w-4 h-4 text-[#6c63ff]" />}
                  label="University"
                  value={profile.university}
                />
                <InfoRow
                  icon={<BookOpen className="w-4 h-4 text-[#6c63ff]" />}
                  label="Graduation Year"
                  value={profile.graduationYear}
                />
                <InfoRow
                  icon={<BarChart2 className="w-4 h-4 text-[#6c63ff]" />}
                  label="Track"
                  value={profile.track ? `${profile.track} Track` : undefined}
                />
              </div>

              {/* Assessment summary row */}
              {profile.state && (
                <>
                  <p className="text-[11px] font-bold text-[#a89fe8] uppercase tracking-widest mb-1 px-1">
                    Assessment Summary
                  </p>
                  <div className="bg-[#faf9ff] rounded-2xl border border-[#f0edff] px-4">
                    <InfoRow
                      icon={
                        <svg className="w-4 h-4 text-[#6c63ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                      label="Assessment Status"
                      value={profile.state.assessmentStatus}
                    />
                    <InfoRow
                      icon={<Star className="w-4 h-4 text-[#6c63ff]" />}
                      label="IQ Score"
                      value={`${profile.state.iqScore ?? 0} / 100`}
                    />
                    <InfoRow
                      icon={<Star className="w-4 h-4 text-[#6c63ff]" />}
                      label="English Score"
                      value={`${profile.state.englishScore ?? 0} / 100`}
                    />
                    <InfoRow
                      icon={<Star className="w-4 h-4 text-[#6c63ff]" />}
                      label="Technical Score"
                      value={`${profile.state.technicalScore ?? 0} / 100`}
                    />
                  </div>
                </>
              )}

              <Button
                onClick={onClose}
                className="mt-5 w-full bg-[#6c63ff] hover:bg-[#4d44db] text-white rounded-xl h-11 font-semibold"
              >
                Close
              </Button>
            </div>
          )}

          {/* error fallback close */}
          {!loading && error && (
            <div className="px-5 py-6">
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
              <Button onClick={onClose} className="w-full bg-[#6c63ff] hover:bg-[#4d44db] text-white rounded-xl">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── CONTACT MODAL ──────────────────────────────────────────────────────────────
const ContactModal = ({
  graduate,
  token,
  onClose,
}: {
  graduate: GraduateForOffer;
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#f3f0ff] flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-[#6c63ff] fill-[#6c63ff]" />
            </div>
            <h3 className="text-lg font-bold text-[#111033] mb-1">Offer Sent!</h3>
            <p className="text-sm text-[#7b74e6]">
              Your offer was sent to {graduate.fullName}.
            </p>
            <Button
              onClick={onClose}
              className="mt-4 bg-[#6c63ff] hover:bg-[#4d44db] text-white"
            >
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
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]"
              >
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

// ── MAIN ───────────────────────────────────────────────────────────────────────
const ShortListed = () => {
  const { token } = useContext(authContext);

  const [candidates, setCandidates]         = useState<Candidate[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [contactTarget, setContactTarget]   = useState<GraduateForOffer | null>(null);
  const [profileTargetId, setProfileTargetId] = useState<string | null>(null);

  const fetchShortlisted = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/company/shortlisted`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.status === "success" && data.data?.shortlists) {
        const mapped: Candidate[] = data.data.shortlists
          .filter((item: any) => item.graduate !== null && item.graduate !== undefined)
          .map((item: any) => {
            const g = item.graduate;
            return {
              shortlistId: item._id,
              graduateId:  g._id,
              name:        g.fullName   || "Unknown",
              initials:    getInitials(g.fullName),
              track:       g.track ? `${g.track} Track` : "Unknown Track",
              addedAgo:    item.createdAt ? timeAgo(item.createdAt) : "Recently",
              university:  g.university || "",
            };
          });
        setCandidates(mapped);
      } else {
        setCandidates([]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchShortlisted();
  }, [fetchShortlisted]);

  const handleRemove = async (graduateId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company/shortlist/${graduateId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.status === "success") {
        setCandidates((prev) => prev.filter((c) => c.graduateId !== graduateId));
        toast.success("Removed from shortlist!");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to remove: " + message);
    }
  };

  const handleContact = (c: Candidate) => {
    setContactTarget({ _id: c.graduateId, fullName: c.name });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-[#111033]">Shortlisted Candidates</h1>

      {/* Header Banner */}
      <Card className="border border-[#e8e4ff] bg-[#f5f3ff] shadow-sm">
        <CardContent className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#6c63ff] flex items-center justify-center">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#111033] text-sm">Shortlisted Candidates</p>
            <p className="text-xs text-[#7b74e6]">
              These graduates are marked as potential candidates for your open positions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {candidates.length === 0 ? (
          <Card className="border border-[#e8e4ff]">
            <CardContent className="p-10 text-center text-[#7b74e6] text-sm">
              No shortlisted candidates yet.
            </CardContent>
          </Card>
        ) : (
          candidates.map((c) => (
            <Card
              key={c.shortlistId}
              className="border border-[#e8e4ff] shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="px-5 py-4 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#f3f0ff] text-[#6c63ff] flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {c.initials}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold text-[#111033] text-sm">{c.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-[#f3f0ff] text-[#6c63ff] hover:bg-[#f3f0ff] text-xs">
                      {c.track}
                    </Badge>
                    <span className="text-xs text-gray-400">Added {c.addedAgo}</span>
                    {c.university && (
                      <span className="text-xs text-gray-400">· {c.university}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setProfileTargetId(c.graduateId)}
                    className="border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]"
                  >
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleContact(c)}
                    className="border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]"
                  >
                    Contact
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(c.graduateId)}
                    className="border-red-200 text-red-500 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Profile Modal */}
      {profileTargetId && (
        <ProfileModal
          graduateId={profileTargetId}
          token={token}
          onClose={() => setProfileTargetId(null)}
        />
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

export default ShortListed;