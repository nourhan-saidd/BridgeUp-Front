import { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/Components/ui/dialog";

export default function PendingCompany() {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [openProfile, setOpenProfile] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);

  // ================= FILE URL =================
  const fileUrl = (path) => {
    if (!path) return "";
    return `${axiosinstance.defaults.baseURL}/${path}`.replace(
      /([^:]\/)\/+/g,
      "$1"
    );
  };

  // ================= DOWNLOAD FILE (FIXED) =================
  const downloadFile = async (filePath) => {
    try {
      if (!filePath) {
        toast.error("File not found");
        return;
      }

      const filename = filePath.split("/").pop();

      const response = await axiosinstance.get(
        `/api/v1/download/${filename}`,
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
      toast.error(err?.response?.data?.message || "Download failed");
    }
  };

  // ================= GET COMPANIES =================
  const getCompanies = async () => {
    const { data } = await axiosinstance.get(
      "api/v1/admins/companies?status=pending",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["pending-companies"],
    queryFn: getCompanies,
    enabled: !!token,
  });

  const filteredCompanies =
    data?.companies?.filter((c) =>
      c?.companyName?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  // ================= APPROVE =================
  const approveCompany = async (id) => {
    try {
      await axiosinstance.patch(
        `api/v1/admins/companies/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Company approved ✅");

      queryClient.invalidateQueries({ queryKey: ["pending-companies"] });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Approve failed");
    }
  };

  // ================= REJECT =================
  const rejectCompany = async (id) => {
    try {
      await axiosinstance.patch(
        `api/v1/admins/companies/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Company rejected ❌");

      queryClient.invalidateQueries({ queryKey: ["pending-companies"] });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reject failed");
    }
  };

  // ================= VIEW PROFILE =================
  const getCompanyDetails = async (id) => {
    try {
      const { data } = await axiosinstance.get(
        `api/v1/admins/companies/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCompanyDetails(data?.company);
      setOpenProfile(true);
    } catch (err) {
      toast.error("Failed to load company profile");
    }
  };

  if (isLoading)
    return <div className="text-center py-20">Loading...</div>;

  if (error)
    return <div className="text-center py-20 text-red-500">Error</div>;

  return (
    <>
      {/* SEARCH */}
      <div className="bg-white rounded-3xl shadow-sm border p-6 mb-8">
        <input
          className="w-full border rounded-xl p-3"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <div
            key={company._id}
            className="bg-white rounded-3xl border shadow-sm p-5"
          >
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold mb-4">
              {company?.companyName?.charAt(0)}
            </div>

            <h3 className="font-bold text-xl">
              {company?.companyName}
            </h3>

            <p className="text-gray-500">{company?.email}</p>

            <div className="text-sm mt-3 space-y-1">
              <div className="flex justify-between">
                <span>Phone</span>
                <span>{company?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span>Pending</span>
              </div>
            </div>

            <button
              onClick={() => approveCompany(company._id)}
              className="w-full mt-5 bg-green-500 text-white py-2 rounded-xl"
            >
              Approve
            </button>

            <button
              onClick={() => rejectCompany(company._id)}
              className="w-full mt-2 bg-red-500 text-white py-2 rounded-xl"
            >
              Reject
            </button>

            <button
              onClick={() => getCompanyDetails(company._id)}
              className="w-full mt-2 bg-violet-100 text-violet-700 py-2 rounded-xl"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {/* ================= DIALOG ================= */}
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
                    alt=""
                  />
                  <div>
                    <h2 className="text-xl font-bold">
                      {companyDetails?.companyName}
                    </h2>
                    <p className="text-gray-500">
                      {companyDetails?.email}
                    </p>
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
                      downloadFile(
                        companyDetails?.commercialRegister
                      )
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