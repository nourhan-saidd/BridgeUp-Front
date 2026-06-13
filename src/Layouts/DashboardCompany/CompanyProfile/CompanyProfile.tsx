import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Pencil, Mail, Phone, Globe, MapPin, Users, Briefcase } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Company {
  _id: string;
  companyName: string;
  email: string;
  phone?: string;
  industry?: string;
  description?: string;
  website?: string;
  location?: string;
  companySize?: string;
  isApproved: boolean;
  logo?: string;
}

interface Stats {
  totalGraduates: number;
  frontendGraduates: number;
  backendGraduates: number;
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

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-full bg-[#f3f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-[#6c63ff]">{icon}</span>
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-[#111033] font-medium">{value || "Not provided"}</p>
    </div>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  sub,
  icon,
  purple,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  purple?: boolean;
}) => (
  <div
    className={`flex-1 rounded-xl p-5 flex flex-col gap-2 ${
      purple ? "bg-[#6c63ff] text-white" : "bg-white border border-[#e8e4ff]"
    }`}
  >
    <div className="flex items-center justify-between">
      <p className={`text-sm ${purple ? "text-purple-100" : "text-gray-400"}`}>{label}</p>
      <span className={purple ? "text-purple-200" : "text-[#6c63ff]"}>{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${purple ? "text-white" : "text-[#111033]"}`}>{value}</p>
    <p className={`text-xs ${purple ? "text-purple-200" : "text-gray-400"}`}>{sub}</p>
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) => (
  <div>
    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
    {textarea ? (
      <textarea
        rows={3}
        className="w-full border border-[#e8e4ff] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff] resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        className="w-full border border-[#e8e4ff] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
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

  // ── GET ──
  const { data, isLoading, error } = useQuery<ProfileResponse>({
    queryKey: ["companyProfile"],
    queryFn: () =>
      axiosinstance
        .get("api/v1/company/profile", authHeaders)
        .then((r) => r.data),
    enabled: !!token,
  });

  const company = data?.data?.company;
  const stats   = data?.data?.stats;

  // ── PUT — only send non-empty fields ──
  const updateProfile = async (payload: FormState) => {
    // Build body with only filled fields to avoid backend 500
    const body: Partial<FormState> = {};
    (Object.keys(payload) as (keyof FormState)[]).forEach((key) => {
      if (payload[key].trim() !== "") {
        body[key] = payload[key].trim();
      }
    });

    const res = await axiosinstance.put(
      "api/v1/company/profile",
      body,
      authHeaders
    );
    return res.data;
  };

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
      setEditOpen(false);
    },
    onError: (err) => console.error("Update failed:", err),
  });

  // ── Open edit — pre-fill with current values ──
  const handleEditOpen = () => {
    if (!company) return;
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

  const setField = (key: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const getInitials = (name?: string) =>
    (name || "")
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (isLoading) return <div className="py-20 text-center text-gray-400">Loading...</div>;
  if (error)     return <div className="py-20 text-center text-red-500">Error loading profile</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#111033]">Company Profile</h1>

      {/* STATS */}
      <div className="flex gap-4">
        <StatCard
          label="Graduates Contacted"
          value={stats?.totalGraduates ?? 0}
          sub="This month"
          icon={<Users size={18} />}
          purple
        />
        <StatCard
          label="Shortlisted"
          value={stats?.frontendGraduates ?? 0}
          sub="Candidates"
          icon={<Users size={18} />}
        />
        <StatCard
          label="Sent Requests"
          value={stats?.backendGraduates ?? 0}
          sub="Total"
          icon={<Mail size={18} />}
        />
      </div>

      {/* PROFILE CARD */}
      <Card className="border border-[#e8e4ff] overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-28 bg-[#6c63ff]" />

        <CardContent className="px-6 pb-6 -mt-10 space-y-6">
          {/* Avatar + Edit */}
          <div className="flex items-end justify-between">
            <div className="w-20 h-20 rounded-xl bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-[#6c63ff]">
              {company?.logo ? (
                <img
                  src={`http://localhost:5000/${company.logo}`}
                  alt="logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                getInitials(company?.companyName)
              )}
            </div>

            <Button
              onClick={handleEditOpen}
              variant="outline"
              className="border-[#e8e4ff] text-[#6c63ff] hover:bg-[#f3f0ff]"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit Profile
            </Button>
          </div>

          {/* Active badge */}
          {company?.isApproved && (
            <span className="inline-block bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
              Active
            </span>
          )}

          {/* Company name + industry */}
          <div>
            <h2 className="text-xl font-bold text-[#111033]">{company?.companyName}</h2>
            {company?.industry && (
              <p className="text-sm text-gray-400 mt-0.5">{company.industry}</p>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-5">
            <InfoRow icon={<Mail size={14} />}      label="Email Address" value={company?.email} />
            <InfoRow icon={<Phone size={14} />}     label="Phone Number"  value={company?.phone} />
            <InfoRow icon={<Globe size={14} />}     label="Website"       value={company?.website} />
            <InfoRow icon={<MapPin size={14} />}    label="Location"      value={company?.location} />
            <InfoRow icon={<Users size={14} />}     label="Company Size"  value={company?.companySize} />
            <InfoRow icon={<Briefcase size={14} />} label="Industry"      value={company?.industry} />
          </div>

          {/* About */}
          <div className="border-t border-[#e8e4ff] pt-4">
            <p className="text-sm font-semibold text-[#111033] mb-2">About Company</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              {company?.description || "No description provided."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
            <DialogDescription>
              Only filled fields will be updated. Leave blank to keep current value.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <Field label="Company Name" value={form.companyName} onChange={setField("companyName")} />
            <Field label="Phone"        value={form.phone}       onChange={setField("phone")} />
            <Field label="Website"      value={form.website}     onChange={setField("website")} />
            <Field label="Location"     value={form.location}    onChange={setField("location")} />
            <Field label="Company Size" value={form.companySize} onChange={setField("companySize")} />
            <Field label="Industry"     value={form.industry}    onChange={setField("industry")} />
            <Field label="Description"  value={form.description} onChange={setField("description")} textarea />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#6c63ff] hover:bg-[#4d44db] text-white"
              onClick={() => saveProfile(form)}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyProfile;