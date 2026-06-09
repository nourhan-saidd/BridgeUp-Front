import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";

const initialNotifications = [
  { id: 1, type: "Application Accepted", message: "Omar Youssef accepted your job offer for Frontend Developer position", time: "1 hour ago", read: false },
  { id: 2, type: "New Match", message: "A new graduate matching your criteria has registered", time: "3 hours ago", read: false },
  { id: 3, type: "Application Rejected", message: "Youssef Ahmed declined your offer for Backend Developer", time: "1 day ago", read: true },
];

const typeColors: Record<string, string> = {
  "Application Accepted": "bg-green-50 text-green-600 hover:bg-green-50",
  "New Match": "bg-[#f3f0ff] text-[#6c63ff] hover:bg-[#f3f0ff]",
  "Application Rejected": "bg-red-50 text-red-500 hover:bg-red-50",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = notifications.filter(n => !n.read).length;

  const markRead = (id: number) => setNotifications(p => p.map(n => n.id === id ? {...n, read: true} : n));
  const markAll = () => setNotifications(p => p.map(n => ({...n, read: true})));

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
          <Button variant="ghost" onClick={markAll} className="text-[#6c63ff] hover:text-[#4d44db] hover:bg-[#f3f0ff] gap-2 text-sm">
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} onClick={() => markRead(n.id)}
            className={`border cursor-pointer transition-all hover:shadow-md ${n.read ? "border-[#e8e4ff] bg-white" : "border-[#b8a9ff] bg-[#f5f3ff]"}`}>
            <CardContent className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={typeColors[n.type] || "bg-gray-100 text-gray-600"}>{n.type}</Badge>
                </div>
                <p className="text-sm text-[#111033] mt-2">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{n.time}</p>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-[#6c63ff] flex-shrink-0 mt-1" />}
            </CardContent>
          </Card>
        ))}
        {notifications.length === 0 && (
          <Card className="border border-[#e8e4ff]">
            <CardContent className="p-10 text-center text-[#7b74e6] text-sm">No notifications yet.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;