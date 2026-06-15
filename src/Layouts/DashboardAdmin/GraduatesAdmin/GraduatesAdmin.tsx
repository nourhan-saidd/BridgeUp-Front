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

  const [openContact, setOpenContact] = useState(false);
  const [selectedGraduateId, setSelectedGraduateId] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("");

  // ================= ADD ONLY (PROFILE STATES) =================
  const [openProfile, setOpenProfile] = useState(false);
  const [graduateDetails, setGraduateDetails] = useState<any>(null);


const [openContactAll, setOpenContactAll] = useState(false);
const [messageAll, setMessageAll] = useState("");
const [sendingAll, setSendingAll] = useState(false);




const sendToAllGraduates = async () => {
  try {
    setSendingAll(true);

    await axiosinstance.post(
      `/api/v1/admins/graduates/contact-all`,
      {
        message: messageAll,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Message sent to all graduates ✉️");

    setMessageAll("");
    setOpenContactAll(false);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to send message");
  } finally {
    setSendingAll(false);
  }
};



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

  // ================= CLEAR FILTERS =================
  const clearFilters = () => {
    setTrack("");
    setGender("");
    setGraduationYear("");
    setMinEnglish("");
    setMinIQ("");
    setMinTechnical("");
  };



  // ================= CONTACT =================
  const sendMessage = async () => {
    try {
      await axiosinstance.post(
        `/api/v1/admins/graduates/${selectedGraduateId}/contact`,
        {
          message,
        },
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

  // ================= ➕ GET PROFILE =================
  const getGraduateProfile = async (id: string) => {
    try {
      const { data } = await axiosinstance.get(
        `/api/v1/admins/graduates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGraduateDetails(data.data);
      setOpenProfile(true);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  // ================= ➕ DOWNLOAD CV =================
  const downloadCV = async (filePath: string) => {
    try {
      const filename = filePath.split("/").pop();

      const res = await axiosinstance.get(
        `/api/v1/download/${filename}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(res.data);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "cv.pdf";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);

      toast.success("CV downloaded");
    } catch (err) {
      toast.error("Download failed");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        Loading...
      </div>
    );

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


{/* Filters */}
<div className="bg-white rounded-3xl shadow-sm border p-6 mb-8">
  <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-xs font-bold uppercase text-[#5b4b8a] mb-2">
        Track
      </label>

      <select
        value={track}
        onChange={(e) => setTrack(e.target.value)}
        className="w-full border rounded-xl p-3"
      >
        <option value="">All Tracks</option>
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-bold uppercase text-[#5b4b8a] mb-2">
        English Score
      </label>

      <select
        value={minEnglish}
        onChange={(e) => setMinEnglish(e.target.value)}
        className="w-full border rounded-xl p-3"
      >
        <option value="">Select Score</option>
        <option value="50">50+</option>
        <option value="60">60+</option>
        <option value="70">70+</option>
        <option value="80">80+</option>
        <option value="90">90+</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-bold uppercase text-[#5b4b8a] mb-2">
        Technical Score
      </label>

      <select
        value={minTechnical}
        onChange={(e) => setMinTechnical(e.target.value)}
        className="w-full border rounded-xl p-3"
      >
        <option value="">Select Score</option>
        <option value="50">50+</option>
        <option value="60">60+</option>
        <option value="70">70+</option>
        <option value="80">80+</option>
        <option value="90">90+</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-bold uppercase text-[#5b4b8a] mb-2">
        IQ Score
      </label>

      <select
        value={minIQ}
        onChange={(e) => setMinIQ(e.target.value)}
        className="w-full border rounded-xl p-3"
      >
        <option value="">Select Score</option>
        <option value="50">50+</option>
        <option value="60">60+</option>
        <option value="70">70+</option>
        <option value="80">80+</option>
        <option value="90">90+</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-bold uppercase text-[#5b4b8a] mb-2">
        Gender
      </label>

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full border rounded-xl p-3"
      >
        <option value="">All</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-bold uppercase text-[#5b4b8a] mb-2">
        Graduation Year
      </label>

      <select
        value={graduationYear}
        onChange={(e) => setGraduationYear(e.target.value)}
        className="w-full border rounded-xl p-3"
      >
        <option value="">All Years</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>
    </div>
  </div>

  <div className="flex justify-end gap-3 mt-6">
    <button
      onClick={clearFilters}
      className="font-semibold text-[#5b4b8a]"
    >
      Clear Filters
    </button>

    <button className="bg-[#5b4b8a] hover:bg-[#4c3f73] text-white px-6 py-3 rounded-xl font-semibold">
      Search
    </button>
  </div>
</div>




<div className="flex justify-center mb-8">
  <button
    onClick={() => setOpenContactAll(true)}
    className="
      bg-white
      border-2
      border-[#5b4b8a]
      text-[#5b4b8a]
      px-10
      py-4
      rounded-2xl
      font-bold
      text-lg
      shadow-sm
      hover:bg-[#5b4b8a]
      hover:text-white
      transition-all
      duration-300
      hover:-translate-y-1
    "
  >
    📩 Send Message To All Graduates
  </button>
</div>













        {/* CARDS */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
          {data?.data?.map((graduate: any) => (
            <div
              key={graduate._id}
              className="bg-white rounded-3xl border shadow-sm p-5"
            >
              <div className="flex justify-between items-start mb-4">
           <img
  src={`http://localhost:5000${graduate.profilePicture}`}
  alt={graduate.fullName}
  className="w-16 h-16 rounded-full object-cover"
/>

                <Star
                  size={22}
                  className="text-slate-400 cursor-pointer"
                />
              </div>

              <h3 className="font-bold text-xl">
                {graduate.fullName}
              </h3>

              <p className="text-[#5b4b8a] mt-1 mb-5">
                {graduate.track} Track
              </p>

              {/* SAME SCORE BARS */}
              <div className="space-y-4">
                <ScoreBar
                  label="IQ Score"
                  value={graduate.scores?.iq || 0}
                />

                <ScoreBar
                  label="English Score"
                  value={graduate.scores?.english || 0}
                />

                <ScoreBar
                  label="Technical Score"
                  value={graduate.scores?.technical || 0}
                />
              </div>

              {/* CONTACT */}
              <button
                onClick={() => {
                  setSelectedGraduateId(graduate._id);
                  setOpenContact(true);
                }}
                className="w-full mt-6 bg-violet-100 text-[#5b4b8a] py-3 rounded-2xl font-semibold"
              >
                Contact
              </button>

              {/* ➕ SHOW PROFILE BUTTON */}
              <button
                onClick={() =>
                  getGraduateProfile(graduate._id)
                }
                className="w-full mt-3 bg-indigo-100 text-indigo-700 py-3 rounded-2xl font-semibold"
              >
                Show Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CONTACT DIALOG ================= */}
      <Dialog
        open={openContact}
        onOpenChange={setOpenContact}
      >
        <DialogContent>
          <DialogTitle>Send Message</DialogTitle>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white py-2 rounded-xl"
          >
            Send
          </button>
        </DialogContent>
      </Dialog>












<Dialog open={openContactAll} onOpenChange={setOpenContactAll}>
  <DialogContent>
    <DialogTitle>Send Message to All Graduates</DialogTitle>

    <textarea
      value={messageAll}
      onChange={(e) => setMessageAll(e.target.value)}
      className="w-full border p-3 rounded-xl"
      placeholder="Write your message..."
    />

    <button
      onClick={sendToAllGraduates}
      disabled={sendingAll}
      className="bg-[#5b4b8a] text-white py-2 rounded-xl w-full mt-3"
    >
      {sendingAll ? "Sending..." : "Send"}
    </button>
  </DialogContent>
</Dialog>









      {/* ================= PROFILE DIALOG ================= */}
      <Dialog
        open={openProfile}
        onOpenChange={setOpenProfile}
      >
        <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden">
          {!graduateDetails ? (
            <div className="p-10 text-center">
              Loading...
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
                <DialogTitle className="text-xl font-bold">
                  Graduate Profile
                </DialogTitle>
              </div>

              {/* BODY */}
              <div className="p-6 space-y-6">
                {/* TOP INFO */}
                <div className="flex items-center gap-4">
                  {graduateDetails?.profilePicture && (
                    <img
                      src={graduateDetails.profilePicture}
                      alt="profile"
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                  )}

                  <div>
                    <h2 className="text-2xl font-bold">
                      {graduateDetails?.fullName}
                    </h2>

                    <p className="text-gray-500">
                      {graduateDetails?.email}
                    </p>

                    <p className="text-sm text-gray-400">
                      {graduateDetails?.role}
                    </p>
                  </div>
                </div>

                {/* BASIC INFO */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    Phone: {graduateDetails?.phone}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl">
                    Age: {graduateDetails?.age}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl">
                    Gender: {graduateDetails?.gender}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl">
                    University: {graduateDetails?.university}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl">
                    Graduation Year:{" "}
                    {graduateDetails?.graduationYear}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl">
                    Track: {graduateDetails?.track}
                  </div>
                </div>

                {/* LINKS */}
                <div className="space-y-2">
                  {graduateDetails?.gitHubProfile && (
                    <a
                      className="text-blue-600 underline block"
                      href={graduateDetails.gitHubProfile}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub Profile
                    </a>
                  )}

                  {graduateDetails?.linkedInProfile && (
                    <a
                      className="text-blue-600 underline block"
                      href={graduateDetails.linkedInProfile}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn Profile
                    </a>
                  )}

                  {graduateDetails?.portfolioLink && (
                    <a
                      className="text-blue-600 underline block"
                      href={graduateDetails.portfolioLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Portfolio Link
                    </a>
                  )}
                </div>

                {/* CV DOWNLOAD */}
                <button
                  onClick={() =>
                    downloadCV(graduateDetails?.cv)
                  }
                  className="w-full bg-green-50 text-green-700 py-3 rounded-xl font-semibold"
                >
                  Download CV
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ScoreBar (UNCHANGED)
function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-2 bg-slate-200 rounded-full">
        <div
          className="h-2 bg-[#5b4b8a] rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}