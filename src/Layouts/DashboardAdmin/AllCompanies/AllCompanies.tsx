import { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import { Star } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/Components/ui/dialog";

export default function AllCompanies() {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");

  const [openContact, setOpenContact] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");

  const [companyDetails, setCompanyDetails] = useState(null);

  // ================= FILE URL =================
  const fileUrl = (path) => {
    if (!path) return "";
    return `${axiosinstance.defaults.baseURL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
  };

  // ================= DOWNLOAD FILE =================
const downloadFile = async (filePath) => {
  try {
    if (!filePath) {
      toast.error("File not found");
      return;
    }

    const filename = filePath.split("/").pop();

    const response = await axiosinstance.get(
      `api/v1/download/${filename}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blobUrl = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);

    toast.success("File downloaded successfully");
  } catch (err) {
    console.error(err);
    toast.error(
      err?.response?.data?.message || "Download failed"
    );
  }
};
console.log(companyDetails?.commercialRegister);
console.log(companyDetails?.taxCard);
  // ================= GET COMPANIES =================
  const getCompanies = async () => {
    const params = { status: "approved" };
    if (industry) params.industry = industry;

    const { data } = await axiosinstance.get(
      "/api/v1/admins/companies",
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["approved-companies", industry],
    queryFn: getCompanies,
    enabled: !!token,
  });

  const filteredCompanies =
    data?.companies?.filter((company) =>
      company?.companyName
        ?.toLowerCase()
        ?.trim()
        .includes(search.toLowerCase().trim())
    ) || [];

  // ================= CONTACT =================
  const sendMessage = async () => {
    try {
      await axiosinstance.post(
        `/api/v1/admins/companies/${selectedId}/contact`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Message sent successfully ✉️");

      setMessage("");
      setOpenContact(false);
      setSelectedId(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send message"
      );
    }
  };

  // ================= PROFILE =================
  const getCompanyDetails = async (id) => {
    try {
      const { data } = await axiosinstance.get(
        `/api/v1/admins/companies/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCompanyDetails(data.company);
      setOpenProfile(true);
    } catch (error) {
      toast.error("Failed to load company details");
    }
  };

  // ================= BAN =================
  const banCompany = async (id) => {
    try {
      await axiosinstance.patch(
        `/api/v1/admins/companies/${id}/ban`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Company banned successfully 🚫");

      queryClient.invalidateQueries(["approved-companies"]);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to ban company"
      );
    }
  };

  if (isLoading)
    return <div className="text-center py-20">Loading...</div>;

  return (
    <>
      {/* SEARCH */}
      <div className="bg-white rounded-3xl shadow-sm border p-6 mb-8">
        <input
          type="text"
          placeholder="Search by company name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* GRID */}
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <div
            key={company._id}
            className="bg-white rounded-3xl border shadow-sm p-5"
          >
            <div className="flex justify-between mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                {company?.companyName?.charAt(0)}
              </div>

              <Star size={22} className="text-slate-400" />
            </div>

            <h3 className="font-bold text-xl">
              {company?.companyName}
            </h3>

            <p className="text-[#5b4b8a]">{company?.email}</p>

            {/* VIEW PROFILE */}
            <button
              onClick={() => getCompanyDetails(company._id)}
              className="w-full mt-6 bg-violet-100 text-[#5b4b8a] py-3 rounded-2xl font-semibold"
            >
              View Profile
            </button>

            {/* CONTACT */}
            <button
              onClick={() => {
                setSelectedId(company._id);
                setOpenContact(true);
              }}
              className="w-full mt-3 bg-blue-500 text-white py-3 rounded-2xl font-semibold"
            >
              Contact
            </button>

            {/* BAN */}
            <button
              onClick={() => banCompany(company._id)}
              className="w-full mt-3 bg-red-500 text-white py-3 rounded-2xl font-semibold"
            >
              Ban Company
            </button>
          </div>
        ))}
      </div>

      {/* ================= CONTACT DIALOG ================= */}
      <Dialog open={openContact} onOpenChange={setOpenContact}>
        <DialogContent>
          <DialogTitle>Send Message</DialogTitle>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full border p-3 rounded-xl min-h-[120px]"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white py-2 rounded-xl"
          >
            Send
          </button>
        </DialogContent>
      </Dialog>

      {/* ================= PROFILE DIALOG ================= */}
      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
        <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden">
          {!companyDetails ? (
            <div className="p-10 text-center">Loading...</div>
          ) : (
            <>
              {/* HEADER */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                <DialogTitle className="text-xl font-bold">
                  Company Profile
                </DialogTitle>
              </div>

              {/* BODY */}
              <div className="p-6 space-y-6">
                {/* TOP */}
                <div className="flex gap-4 items-center">
                  <img
                    src={fileUrl(companyDetails?.logo)}
                    className="w-20 h-20 rounded-full object-cover"
                    alt="Company Logo"
                  />
                  <div>
                    <h2 className="text-xl font-bold">
                      {companyDetails?.companyName}
                    </h2>
                    <p className="text-gray-500">{companyDetails?.email}</p>
                  </div>
                </div>

                {/* INFO */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    Phone: {companyDetails?.phone}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    Industry: {companyDetails?.industry}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    Location: {companyDetails?.location || "—"}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    Website: {companyDetails?.website || "—"}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  {companyDetails?.description || "No description"}
                </div>

                {/* FILES */}
                <div className="space-y-2">
                <button
  onClick={() =>
    downloadFile(companyDetails?.commercialRegister)
  }
  className="w-full bg-green-50 p-3 rounded-xl text-green-700"
>
  Download Commercial Register
</button>

                  <button
  onClick={() =>
    downloadFile(companyDetails?.taxCard)
  }
  className="w-full bg-green-50 p-3 rounded-xl text-green-700"
>
  Download Tax Card
</button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}