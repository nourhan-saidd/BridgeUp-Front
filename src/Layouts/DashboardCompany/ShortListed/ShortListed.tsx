import { useState, useEffect } from "react";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:5000/api/v1";

interface Candidate {
  shortlistId: string;
  graduateId: string;
  name: string;
  initials: string;
  track: string;
  addedAgo: string;
  university: string;
}

const getInitials = (name: string): string => {
  if (!name) return "??";
  return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
};

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
};

const ShortListed = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShortlisted();
  }, []);

  const fetchShortlisted = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

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
              graduateId: g._id,
              name: g.fullName || "Unknown",
              initials: getInitials(g.fullName),
              track: g.track ? `${g.track} Track` : "Unknown Track",
              addedAgo: item.createdAt ? timeAgo(item.createdAt) : "Recently",
              university: g.university || "",
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
  };

  const handleRemove = async (graduateId: string) => {
    try {
      const token = localStorage.getItem("token");

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
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Failed to remove: " + message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center text-[#7b74e6]">
        Loading shortlisted candidates...
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

      {/* Header */}
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

                {/* Remove only */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(c.graduateId)}
                  className="border-red-200 text-red-500 hover:bg-red-50"
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ShortListed;