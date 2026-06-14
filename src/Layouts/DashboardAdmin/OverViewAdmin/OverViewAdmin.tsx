import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
 
//  ScoreBar
 
function ScoreBar({ label, value }: { label: string; value: number }) {
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
 
//  Pagination 
 
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-xl text-sm font-semibold border border-[#5b4b8a] text-[#5b4b8a] disabled:opacity-30 hover:bg-[#5b4b8a] hover:text-white transition-colors"
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-xl text-sm font-semibold transition-colors ${
            p === currentPage
              ? "bg-[#5b4b8a] text-white"
              : "border border-[#5b4b8a] text-[#5b4b8a] hover:bg-[#5b4b8a] hover:text-white"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-xl text-sm font-semibold border border-[#5b4b8a] text-[#5b4b8a] disabled:opacity-30 hover:bg-[#5b4b8a] hover:text-white transition-colors"
      >
        ›
      </button>
    </div>
  );
}
 
//  Main Component 
 
export default function OverViewAdmin() {
  const { token } = useContext(authContext);
  const [gradPage, setGradPage] = useState(1);
  const [compPage, setCompPage] = useState(1);
 
  // ── Fetchers ──
 
  const getStats = async () => {
    const { data } = await axiosinstance.get("api/v1/admins/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  };
 
  const getGraduates = async () => {
    const { data } = await axiosinstance.get("api/v1/admins/graduates", {
      params: { page: gradPage, limit: 4 },
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };
 
  const getCompanies = async () => {
    const { data } = await axiosinstance.get(
      "api/v1/admins/companies-dashboard",
      {
        params: { page: compPage, limit: 4 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };
 
  //  Queries 
 
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getStats,
  });
 
  const {
    data: graduatesData,
    isLoading: gradsLoading,
    isPlaceholderData: gradPlaceholder,
  } = useQuery({
    queryKey: ["adminGraduates", gradPage],
    queryFn: getGraduates,
    placeholderData: (prev) => prev,
  });
 
  const {
    data: companiesData,
    isLoading: compsLoading,
    isPlaceholderData: compPlaceholder,
  } = useQuery({
    queryKey: ["adminCompanies", compPage],
    queryFn: getCompanies,
    placeholderData: (prev) => prev,
  });
 
  //  Derived data 
 
  const graduates = graduatesData?.data ?? [];
  const gradTotalPages = graduatesData?.totalPages ?? 1;
 
  const companies = companiesData?.data?.approvedRecentCompanies ?? [];
  const compTotalPages = companiesData?.data?.totalPages ?? 1;
 
  return (
    <div className="min-h-screen bg-[#f3f0ff] p-6 w-screen">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Overview</h1>
 
      {/* ── Stats ── */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <p className="text-xs font-bold uppercase text-[#5b4b8a] mb-3">
            Total Graduates
          </p>
          {statsLoading ? (
            <div className="h-10 w-24 bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <p className="text-4xl font-bold text-slate-900">
              {statsData?.totalGraduates ?? 0}
            </p>
          )}
        </div>
 
        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <p className="text-xs font-bold uppercase text-[#5b4b8a] mb-3">
            Active Companies
          </p>
          {statsLoading ? (
            <div className="h-10 w-24 bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <p className="text-4xl font-bold text-slate-900">
              {statsData?.activeCompanies ?? 0}
            </p>
          )}
        </div>
 
        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <p className="text-xs font-bold uppercase text-[#5b4b8a] mb-3">
            Pending Approvals
          </p>
          {statsLoading ? (
            <div className="h-10 w-24 bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <p className="text-4xl font-bold text-red-500">
              {statsData?.pendingApprovals ?? 0}
            </p>
          )}
          {!statsLoading && (
            <p className="text-xs text-slate-400 mt-1">
              {(statsData?.pendingApprovals ?? 0) > 0
                ? "Companies awaiting review"
                : "All clear"}
            </p>
          )}
        </div>
      </div>
 
      {/* ── Graduates ── */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Recent Graduates
      </h2>
 
      {gradsLoading ? (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border shadow-sm p-5 h-72 animate-pulse"
            />
          ))}
        </div>
      ) : graduates.length === 0 ? (
        <p className="text-slate-400 text-sm">No graduates found.</p>
      ) : (
        <>
          <div
            className={`grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6 transition-opacity duration-200 ${
              gradPlaceholder ? "opacity-60" : "opacity-100"
            }`}
          >
            {graduates.map((graduate: any) => (
              <div
                key={graduate._id}
                className="bg-white rounded-3xl border shadow-sm p-5"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                    {graduate.fullName
                      ?.split(" ")
                      ?.slice(0, 2)
                      ?.map((name: string) => name[0])
                      ?.join("")}
                  </div>
                </div>
 
                <h3 className="font-bold text-xl">{graduate.fullName}</h3>
                <p className="text-[#5b4b8a] mt-1 mb-5">{graduate.track} Track</p>
 
                <div className="space-y-4">
                  <ScoreBar label="IQ Score" value={graduate.scores?.iq || 0} />
                  <ScoreBar
                    label="English Score"
                    value={graduate.scores?.english || 0}
                  />
                  <ScoreBar
                    label="Technical Score"
                    value={graduate.scores?.technical || 0}
                  />
                </div>
 
                <span
                  className={`inline-block w-full text-center mt-5 py-2 rounded-2xl text-sm font-semibold ${
                    graduate.scores.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-violet-100 text-[#5b4b8a]"
                  }`}
                >
                  {graduate.scores.status}
                </span>
              </div>
            ))}
          </div>
 
          <Pagination
            currentPage={gradPage}
            totalPages={gradTotalPages}
            onPageChange={setGradPage}
          />
        </>
      )}
 
      {/* ── Companies ── */}
      <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
        Recent Companies
      </h2>
 
      {compsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border shadow-sm p-5 h-20 animate-pulse"
            />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <p className="text-slate-400 text-sm">No companies found.</p>
      ) : (
        <>
          <div
            className={`space-y-3 transition-opacity duration-200 ${
              compPlaceholder ? "opacity-60" : "opacity-100"
            }`}
          >
            {companies.map((company: any) => (
              <div
                key={company._id}
                className="bg-white rounded-3xl border shadow-sm px-6 py-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {company.companyName
                    ?.split(" ")
                    ?.slice(0, 2)
                    ?.map((w: string) => w[0])
                    ?.join("")}
                </div>
 
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">{company.companyName}</p>
                  <p className="text-sm text-slate-400 truncate">
                    {company.email} · {company.industry}
                  </p>
                </div>
 
                <span
                  className={`text-xs font-semibold px-4 py-1.5 rounded-2xl flex-shrink-0 ${
                    company.isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-violet-100 text-[#5b4b8a]"
                  }`}
                >
                  {company.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
            ))}
          </div>
 
          <Pagination
            currentPage={compPage}
            totalPages={compTotalPages}
            onPageChange={setCompPage}
          />
        </>
      )}
    </div>
  );
}