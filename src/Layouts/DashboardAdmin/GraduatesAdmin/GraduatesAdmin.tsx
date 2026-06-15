import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/Components/ui/dialog";

import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import { Star } from "lucide-react";

export default function GraduatesAdmin() {
  const { token } = useContext(authContext);

  const [track, setTrack] = useState("");
  const [gender, setGender] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [minEnglish, setMinEnglish] = useState("");
  const [minIQ, setMinIQ] = useState("");
  const [minTechnical, setMinTechnical] = useState("");

  // CONTACT STATES
  const [openContact, setOpenContact] = useState(false);
  const [selectedGraduateId, setSelectedGraduateId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // ================= GET GRADUATES =================
  const getGraduates = async () => {
    const params: Record<string, string> = {};

    if (track) params.track = track;
    if (gender) params.gender = gender;
    if (graduationYear) params.graduationYear = graduationYear;
    if (minEnglish) params.minEnglish = minEnglish;
    if (minIQ) params.minIQ = minIQ;
    if (minTechnical) params.minTechnical = minTechnical;

    const { data } = await axiosinstance.get(
      "api/v1/admins/all-graduates",
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "graduates",
      track,
      gender,
      graduationYear,
      minEnglish,
      minIQ,
      minTechnical,
    ],
    queryFn: getGraduates,
  });

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    try {
      await axiosinstance.post(
        `/api/v1/admins/graduates/${selectedGraduateId}/contact`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Message sent successfully ✉️");

      setMessage("");
      setSelectedGraduateId(null);
      setOpenContact(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to send message"
      );
    }
  };

  const clearFilters = () => {
    setTrack("");
    setGender("");
    setGraduationYear("");
    setMinEnglish("");
    setMinIQ("");
    setMinTechnical("");
  };

  if (isLoading)
    return <div className="flex justify-center py-20">Loading...</div>;

  if (error)
    return (
      <div className="flex justify-center py-20 text-red-500">
        Something went wrong
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f0ff] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Browse Graduates
        </h1>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl shadow-sm border p-6 mb-8">
          <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4">
            <select value={track} onChange={(e) => setTrack(e.target.value)} className="border p-3 rounded-xl">
              <option value="">All Tracks</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
            </select>

            <select value={gender} onChange={(e) => setGender(e.target.value)} className="border p-3 rounded-xl">
              <option value="">All Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} className="border p-3 rounded-xl">
              <option value="">All Years</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button onClick={clearFilters} className="text-[#5b4b8a] font-semibold">
              Clear
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
          {data?.data?.map((graduate: any) => (
            <div key={graduate._id} className="bg-white rounded-3xl border p-5">
              <div className="flex justify-between mb-4">
                <div className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center rounded-full font-bold">
                  {graduate.fullName
                    ?.split(" ")
                    ?.slice(0, 2)
                    ?.map((n: string) => n[0])
                    ?.join("")}
                </div>

                <Star className="text-gray-400" />
              </div>

              <h3 className="font-bold text-lg">{graduate.fullName}</h3>
              <p className="text-[#5b4b8a] mb-4">{graduate.track}</p>

              <div className="space-y-3">
                <ScoreBar label="IQ" value={graduate.scores?.iq || 0} />
                <ScoreBar label="English" value={graduate.scores?.english || 0} />
                <ScoreBar label="Technical" value={graduate.scores?.technical || 0} />
              </div>

              <button
                onClick={() => {
                  setSelectedGraduateId(graduate._id);
                  setOpenContact(true);
                }}
                className="w-full mt-6 bg-violet-100 text-[#5b4b8a] py-3 rounded-2xl font-semibold"
              >
                Contact
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CONTACT MODAL ================= */}
      <Dialog open={openContact} onOpenChange={setOpenContact}>
        <DialogContent className="max-w-md">
          <DialogTitle>Send Message</DialogTitle>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-3 rounded-xl min-h-[120px]"
            placeholder="Write your message..."
          />

          <button
            onClick={sendMessage}
            className="w-full bg-[#5b4b8a] text-white py-3 rounded-xl"
          >
            Send
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ================= SCORE BAR =================
function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full mt-1">
        <div className="h-2 bg-[#5b4b8a] rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}