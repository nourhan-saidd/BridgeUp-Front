import { useState, useEffect } from "react";
import { CheckCheck } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";

const API_BASE_URL = "http://localhost:5000/api/v1";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const typeColors: Record<string, string> = {
  "general": "bg-[#f3f0ff] text-[#6c63ff] hover:bg-[#f3f0ff]",
  "accepted": "bg-green-50 text-green-600 hover:bg-green-50",
  "rejected": "bg-red-50 text-red-500 hover:bg-red-50",
  "match": "bg-blue-50 text-blue-500 hover:bg-blue-50",
};

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "just now" : `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/company/notifications`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.status === "success" && data.data?.notifications) {
        const mapped: Notification[] = data.data.notifications.map((n: any) => ({
          id: n._id,
          type: n.type || "general",
          title: n.title || "",
          message: n.message || "",
          time: n.createdAt ? timeAgo(n.createdAt) : "Recently",
          read: n.isRead ?? false,
        }));
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/company/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // silently fail — UI already updated
    }
  };

  const markAll = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/company/notifications/read-all`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // silently fail — UI already updated
    }
  };

  const unread = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-[#7b74e6]">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#111033]">Notifications</h1>
          {unread > 0 && (
            <span className="w-6 h-6 rounded-full bg-[#6c63ff] text-white text-xs flex items-center justify-center font-semibold">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <Button
            variant="ghost"
            onClick={markAll}
            className="text-[#6c63ff] hover:text-[#4d44db] hover:bg-[#f3f0ff] gap-2 text-sm"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="border border-[#e8e4ff]">
            <CardContent className="p-10 text-center text-[#7b74e6] text-sm">
              No notifications yet.
            </CardContent>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className={`border cursor-pointer transition-all hover:shadow-md ${
                n.read ? "border-[#e8e4ff] bg-white" : "border-[#b8a9ff] bg-[#f5f3ff]"
              }`}
            >
              <CardContent className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={typeColors[n.type] ?? "bg-gray-100 text-gray-600 hover:bg-gray-100"}>
                      {n.title || n.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#111033] mt-2">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                </div>
                {!n.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6c63ff] flex-shrink-0 mt-1" />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;