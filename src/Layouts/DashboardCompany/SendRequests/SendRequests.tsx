import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/Context/BaseUrl/AxiosInstance";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import type { AxiosResponse } from "axios";

interface Graduate {
  _id: string;
  fullName: string;
  email: string;
  university: string;
  track: string;
  profilePicture: string | null;
}

interface SentOffer {
  _id: string;
  company: string;
  graduate: Graduate;
  position: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
}

interface OffersResponse {
  status: string;
  results: number;
  data: SentOffer[];
}

interface StatsResponse {
  status: string;
  data: {
    total: number;
    pending: number;
    accepted: number;
    declined: number;
  };
}

const getInitials = (name: string) => {
  if (!name?.trim()) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

const statusConfig: Record<string, { badge: string; label: string }> = {
  pending:  { badge: "bg-yellow-50 text-yellow-600 hover:bg-yellow-50", label: "Pending" },
  accepted: { badge: "bg-green-50 text-green-600 hover:bg-green-50",   label: "Accepted" },
  declined: { badge: "bg-red-50 text-red-500 hover:bg-red-50",         label: "Rejected" },
};

// Helper function to solve backend storage path anomalies
const resolveImagePath = (path: string | null | undefined): string => {
  if (!path || path.trim() === "") return "";
  if (path.startsWith("http")) return path;
  if (path.includes("\\uploads\\")) {
    return `http://localhost:5000/uploads/${path.split("\\uploads\\")[1]}`;
  }
  if (path.includes("/uploads/")) {
    return `http://localhost:5000/uploads/${path.split("/uploads/")[1]}`;
  }
  return `http://localhost:5000${path.startsWith("/") ? "" : "/"}${path}`;
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex-1 rounded-xl border border-[#e8e4ff] bg-white px-5 py-4 shadow-sm">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const SendRequests = () => {
  const token = localStorage.getItem("token");

  const {
    data: offersData,
    isLoading: offersLoading,
    isError: offersError,
  } = useQuery<OffersResponse>({
    queryKey: ["sent-offers"],
    queryFn: () =>
      axiosInstance
        .get<OffersResponse>("/api/v1/offers/my-sent-offers", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((r: AxiosResponse<OffersResponse>) => r.data),
  });

  const { data: statsData } = useQuery<StatsResponse>({
    queryKey: ["offers-stats"],
    queryFn: () =>
      axiosInstance
        .get<StatsResponse>("/api/v1/offers/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((r: AxiosResponse<StatsResponse>) => r.data),
  });

  const offers = offersData?.data ?? [];
  const stats  = statsData?.data;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#111033]">Sent Requests</h1>

      {stats && (
        <div className="flex gap-4">
          <StatCard label="Total"    value={stats.total}    color="text-[#6c63ff]" />
          <StatCard label="Pending"  value={stats.pending}  color="text-yellow-500" />
          <StatCard label="Accepted" value={stats.accepted} color="text-green-500" />
          <StatCard label="Declined" value={stats.declined} color="text-red-400" />
        </div>
      )}

      {offersLoading && <p className="text-center text-gray-400 py-10">Loading...</p>}
      {offersError && <p className="text-center text-red-400 py-10">Failed to load requests. Please try again.</p>}
      {!offersLoading && !offersError && offers.length === 0 && (
        <p className="text-center text-gray-400 py-10">No sent requests yet.</p>
      )}

      <div className="space-y-3">
        {offers.map((offer) => {
          const cfg = statusConfig[offer.status] ?? statusConfig.pending;
          const imageUrl = resolveImagePath(offer.graduate.profilePicture);

          return (
            <Card key={offer._id} className="border border-[#e8e4ff] shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="px-5 py-4 flex items-center gap-4">
                
                {/* Fixed Image Area with standard fallback safety */}
                <div className="w-10 h-10 flex-shrink-0 relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={offer.graduate.fullName}
                      className="w-full h-full rounded-full object-cover border border-gray-100"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const f = document.getElementById(`f-offer-${offer._id}`);
                        if (f) f.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    id={`f-offer-${offer._id}`}
                    className="w-full h-full rounded-full bg-[#f3f0ff] text-[#6c63ff] flex items-center justify-center text-xs font-bold border border-[#e8e4ff]"
                    style={{ display: imageUrl ? "none" : "flex" }}
                  >
                    {getInitials(offer.graduate.fullName)}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-[#111033] text-sm">{offer.graduate.fullName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{offer.position}</p>
                </div>

                <div className="text-right">
                  <Badge className={cfg.badge}>{cfg.label}</Badge>
                  <p className="text-xs text-gray-400 mt-1">Sent {timeAgo(offer.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SendRequests;