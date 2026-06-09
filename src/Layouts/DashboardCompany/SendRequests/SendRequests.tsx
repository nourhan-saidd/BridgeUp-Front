import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/components/ui/button";

const requests = [
  { id: 1, name: "Ahmed Hassan", initials: "AH", role: "Junior Frontend Developer", status: "Pending", sentAgo: "2 days ago" },
  { id: 2, name: "Sara Mohamed", initials: "SM", role: "Backend Developer", status: "Pending", sentAgo: "3 days ago" },
  { id: 3, name: "Omar Youssef", initials: "OY", role: "Frontend Developer", status: "Accepted", sentAgo: "1 week ago" },
  { id: 4, name: "Layla Ibrahim", initials: "LI", role: "Full Stack Developer", status: "Accepted", sentAgo: "1 week ago" },
  { id: 5, name: "Youssef Ahmed", initials: "YA", role: "Junior Backend Developer", status: "Rejected", sentAgo: "2 weeks ago" },
  { id: 6, name: "Mona Khaled", initials: "MK", role: "React Developer", status: "Pending", sentAgo: "3 days ago" },
];

const statusStyles: Record<string, { badge: string; action?: JSX.Element }> = {
  Pending: { badge: "bg-yellow-50 text-yellow-600 hover:bg-yellow-50" },
  Accepted: { badge: "bg-green-50 text-green-600 hover:bg-green-50" },
  Rejected: { badge: "bg-red-50 text-red-500 hover:bg-red-50" },
};

const SendRequests = () => (
  <div className="p-6 max-w-5xl mx-auto space-y-4">
    <h1 className="text-2xl font-bold text-[#111033]">Sent Requests</h1>
    <div className="space-y-3">
      {requests.map((r) => (
        <Card key={r.id} className="border border-[#e8e4ff] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f3f0ff] text-[#6c63ff] flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {r.initials}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#111033] text-sm">{r.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{r.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <Badge className={statusStyles[r.status].badge}>{r.status}</Badge>
                <p className="text-xs text-gray-400 mt-1">Sent {r.sentAgo}</p>
              </div>
              {r.status === "Pending" && (
                <Button variant="outline" size="sm" className="border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]">Follow Up</Button>
              )}
              {r.status === "Accepted" && (
                <Button size="sm" className="bg-[#6c63ff] hover:bg-[#4d44db] text-white">Schedule Interview</Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default SendRequests;