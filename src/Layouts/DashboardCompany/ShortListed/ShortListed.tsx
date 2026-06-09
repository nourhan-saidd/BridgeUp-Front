import { useState } from "react";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/components/ui/button";

const initialCandidates = [
  { id: 1, name: "Ahmed Hassan", initials: "AH", track: "Frontend Track", addedAgo: "2 days ago" },
  { id: 2, name: "Sara Mohamed", initials: "SM", track: "Backend Track", addedAgo: "4 days ago" },
  { id: 3, name: "Khaled Ali", initials: "KA", track: "Frontend Track", addedAgo: "1 week ago" },
  { id: 4, name: "Nour Mahmoud", initials: "NM", track: "Backend Track", addedAgo: "1 week ago" },
];

const ShortListed = () => {
  const [candidates, setCandidates] = useState(initialCandidates);

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
            <p className="text-xs text-[#7b74e6]">These graduates are marked as potential candidates for your open positions</p>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {candidates.length === 0 && (
          <Card className="border border-[#e8e4ff]">
            <CardContent className="p-10 text-center text-[#7b74e6] text-sm">No shortlisted candidates yet.</CardContent>
          </Card>
        )}
        {candidates.map((c) => (
          <Card key={c.id} className="border border-[#e8e4ff] shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f3f0ff] text-[#6c63ff] flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {c.initials}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#111033] text-sm">{c.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-[#f3f0ff] text-[#6c63ff] hover:bg-[#f3f0ff] text-xs">{c.track}</Badge>
                  <span className="text-xs text-gray-400">Added {c.addedAgo}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-[#b8a9ff] text-[#6c63ff] hover:bg-[#f3f0ff]">View Profile</Button>
                <Button size="sm" className="bg-[#6c63ff] hover:bg-[#4d44db] text-white">Send Offer</Button>
                <Button size="sm" variant="outline" onClick={() => setCandidates(p => p.filter(x => x.id !== c.id))}
                  className="border-red-200 text-red-500 hover:bg-red-50">Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShortListed;