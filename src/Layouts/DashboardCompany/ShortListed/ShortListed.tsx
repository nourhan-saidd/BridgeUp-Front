import { useState, useEffect } from "react";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:5000/api/v1";

const ShortListed = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shortlisted candidates on mount
  useEffect(() => {
    fetchShortlisted();
  }, []);

  const fetchShortlisted = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // or however you store the auth token
      
      const response = await fetch(`${API_BASE_URL}/company/shortlisted`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Map API response to component format
      if (data.status === "success" && data.data?.shortlists) {
        const mapped = data.data.shortlists.map((item, index) => ({
          id: item._id || index,
          name: item.fullName || "Unknown",
          initials: getInitials(item.fullName),
          track: item.track ? `${item.track} Track` : "Unknown Track",
          addedAgo: "Recently", // API doesn't return date, adjust if needed
          email: item.email,
          university: item.university,
        }));
        setCandidates(mapped);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      console.error("Error fetching shortlisted:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Remove candidate from shortlist
  const handleRemove = async (candidateId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/company/shortlist/${candidateId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "success") {
        // Remove from local state
        setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
      }
    } catch (err) {
      console.error("Error removing candidate:", err);
      alert("Failed to remove candidate: " + err.message);
    }
  };

  // Send offer (placeholder - implement based on your API)
  const handleSendOffer = (candidate) => {
    // TODO: Implement send offer API call
    console.log("Send offer to:", candidate);
    alert(`Offer sent to ${candidate.name}`);
  };

  // View profile (placeholder - implement based on your routing)
  const handleViewProfile = (candidateId) => {
    // TODO: Navigate to profile page
    console.log("View profile:", candidateId);
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
        {candidates.length === 0 && (
          <Card className="border border-[#e8e4ff]">
            <CardContent className="p-10 text-center text-[#7b74e6] text-sm">
              No shortlisted candidates yet.
            </CardContent>
          </Card>
        )}
        {candidates.map((c) => (
          <Card
            key={c.id}
            className="border border-[#e8e4ff] shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f3f0ff] text-[#6c63ff] flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {c.initials}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#111033] text-sm">{c.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-[#f3f0ff] text-[#6c63ff] hover:bg-[#f3f0ff] text-xs">
                    {c.track}
                  </Badge>
                  <span className="text-xs text-gray-400">Added {c.addedAgo}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProfile(c.id)}
                  className="border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]"
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSendOffer(c)}
                  className="bg-[#6c63ff] hover:bg-[#4d44db] text-white"
                >
                  Send Offer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(c.id)}
                  className="border-red-200 text-red-500 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShortListed;