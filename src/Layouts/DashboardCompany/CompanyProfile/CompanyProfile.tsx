import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import {
  Users,
  Bookmark,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Building2,
  Pencil,
} from "lucide-react";

// ── TYPES ──────────────────────────────────────────────────────────────────────
interface Company {
  _id?: string;
  id?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  companySize?: string;
  description?: string;
  industry?: string;
  isApproved?: boolean;
  logo?: string;
}

interface Stats {
  totalGraduates?: number;
  frontendGraduates?: number;
  backendGraduates?: number;
  graduatesContacted?: number;
  shortlisted?: number;
  acceptedOffers?: number;
}

interface ProfileResponse {
  status: string;
  data: {
    company: Company;
    stats: Stats;
  };
}

interface FormState {
  companyName: string;
  phone: string;
  website: string;
  location: string;
  companySize: string;
  description: string;
  industry: string;
}

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const INDUSTRY_OPTIONS = [
  "IT & Software",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Marketing",
  "Other",
];

const COMPANY_SIZE_OPTIONS = [
  "Small (1-50)",
  "Mid (101-500)",
  "Large (500+)",
];

// ── MAIN ───────────────────────────────────────────────────────────────────────
const CompanyProfile = () => {
  const queryClient = useQueryClient();
  const { token } = useContext(authContext);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    companyName: "",
    phone: "",
    website: "",
    location: "",
    companySize: "",
    description: "",
    industry: "",
  });

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ── GET PROFILE ──
  const { data, isLoading, error } = useQuery<ProfileResponse>({
    queryKey: ["companyProfile"],
    queryFn: () =>
      axiosinstance
        .get("api/v1/company/profile", authHeaders)
        .then((r) => r.data),
    enabled: !!token,
  });

  // Safeguard empty objects safely
  const company = data?.data?.company || {};
  const stats = data?.data?.stats;

  // ── PUT PROFILE ──
  const updateProfile = async (payload: FormState) => {
    const body = {
      companyName: payload.companyName.trim(),
      phone: payload.phone.trim(),
      website: payload.website.trim(),
      location: payload.location.trim(),
      companySize: payload.companySize,
      industry: payload.industry,
      description: payload.description.trim(),
    };

    const res = await axiosinstance.put(
      "api/v1/company/profile",
      body,
      authHeaders
    );
    return res.data; // This returns the updated profile object from Postman!
  };

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedData) => {
      // FIX: Manually update the cache data immediately so the screen updates instantly!
      queryClient.setQueryData(["companyProfile"], (oldQueryData: ProfileResponse | undefined) => {
        if (!oldQueryData) return updatedData;
        return {
          ...oldQueryData,
          data: {
            ...oldQueryData.data,
            // Merge the updated company details directly into your display state
            company: updatedData?.data?.company || updatedData?.company || updatedData?.data || company,
          },
        };
      });

      // Refetch in background just to stay perfectly synced with DB
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
      setEditOpen(false);
    },
    onError: (err) => console.error("Update failed:", err),
  });

  const handleEditOpen = () => {
    setForm({
      companyName: company.companyName || "",
      phone:       company.phone       || "",
      website:     company.website     || "",
      location:    company.location    || "",
      companySize: company.companySize || "",
      description: company.description || "",
      industry:    company.industry    || "",
    });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!form.companyName || !form.phone || !form.industry || !form.companySize || !form.location) {
      alert("Please fill in all required fields marked with *");
      return;
    }
    saveProfile(form);
  };

  const getInitials = (name?: string) =>
    (name || "Company")
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#6c63d4] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500 font-medium">
        Failed to load profile. Please try again.
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#7b74e6] to-[#5a4fcf] text-white shadow-md">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium opacity-90">Graduates Contacted</p>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold">
            {stats?.graduatesContacted ?? stats?.totalGraduates ?? 0}
          </p>
          <p className="text-xs mt-1 opacity-70">This month</p>
        </div>

        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Shortlisted</p>
            <div className="w-9 h-9 rounded-full bg-[#f0eeff] flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-[#6c63d4]" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {stats?.shortlisted ?? stats?.frontendGraduates ?? 0}
          </p>
          <p className="text-xs mt-1 text-gray-400">This month</p>
        </div>

        <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Accepted Offers</p>
            <div className="w-9 h-9 rounded-full bg-[#f0eeff] flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#6c63d4]" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {stats?.acceptedOffers ?? stats?.backendGraduates ?? 0}
          </p>
          <p className="text-xs mt-1 text-gray-400">This month</p>
        </div>
      </div>

      {/* PROFILE DETAILS CARD */}
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        <div className="h-36 bg-gradient-to-r from-[#7b74e6] to-[#5a4fcf]" />

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-[#6c63d4] font-bold text-2xl overflow-hidden">
              {company?.logo ? (
                <img
                  src={`http://localhost:5000/${company.logo.replace(/^\//, "")}`}
                  alt="logo"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                getInitials(company?.companyName)
              )}
            </div>

            <button
              onClick={handleEditOpen}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#6c63d4] text-white text-sm font-semibold hover:bg-[#5a4fcf] transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">
                {company?.companyName || "No Company Setup Yet"}
              </h2>
              {company?.isApproved && (
                <span className="px-3 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  Active
                </span>
              )}
              {company?.industry && (
                <span className="text-sm text-[#6c63d4] font-medium">
                  {company.industry}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Mail className="w-4 h-4 text-[#6c63d4]" />,      label: "Email Address", value: company?.email },
              { icon: <Phone className="w-4 h-4 text-[#6c63d4]" />,     label: "Phone Number",  value: company?.phone },
              { icon: <Globe className="w-4 h-4 text-[#6c63d4]" />,     label: "Website",       value: company?.website },
              { icon: <MapPin className="w-4 h-4 text-[#6c63d4]" />,    label: "Location",      value: company?.location },
              { icon: <Briefcase className="w-4 h-4 text-[#6c63d4]" />, label: "Industry",      value: company?.industry },
              { icon: <Building2 className="w-4 h-4 text-[#6c63d4]" />, label: "Company Size",  value: company?.companySize },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                <div className="w-9 h-9 rounded-full bg-[#f0eeff] flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT CARD */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-3">About</h3>
        {company?.description ? (
          <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No description added yet. Click "Edit Profile" to add one.
          </p>
        )}
      </div>

      {/* DIALOG FORM */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Edit Company Profile
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Update your company information below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={company?.email || ""}
                disabled
                className="w-full h-11 px-4 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 outline-none text-sm cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="www.example.com"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition text-sm"
                >
                  <option value="">Select industry</option>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.companySize}
                  onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition text-sm"
                >
                  <option value="">Select size</option>
                  {COMPANY_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Cairo, Egypt"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Tell graduates about your company..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#6c63d4] focus:ring-2 focus:ring-[#6c63d4]/20 transition text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setEditOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-6 py-2.5 rounded-xl bg-[#6c63d4] text-white text-sm font-semibold hover:bg-[#5a4fcf] transition-colors disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyProfile;