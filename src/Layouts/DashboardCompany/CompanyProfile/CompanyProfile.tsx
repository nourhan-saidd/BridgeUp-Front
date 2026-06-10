import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Pencil,
} from "lucide-react";

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface Company {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  industry: string;
  description: string;
  website?: string;
  location?: string;
  companySize?: string;
  isApproved: boolean;
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

interface UpdatePayload {
  companyName: string;
  phone: string;
  website: string;
  location: string;
  companySize: string;
  description: string;
  industry: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────
const getProfile = async (): Promise<ProfileResponse> => {
  const { data } = await api.get("/company/profile");
  return data;
};

const updateProfile = async (payload: UpdatePayload) => {
  const { data } = await api.put("/company/profile", payload);
  return data;
};

// ─── Component ────────────────────────────────────────────────────────────────
const CompanyProfile = () => {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<UpdatePayload>({
    companyName: "",
    phone: "",
    website: "",
    location: "",
    companySize: "",
    description: "",
    industry: "",
  });

  // ── Fetch profile ──
  const { data, isLoading, isError } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: getProfile,
  });

  const company = data?.data?.company;
  const stats = data?.data?.stats;

  // ── Update mutation ──
  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
      setEditOpen(false);
    },
  });

  const handleEditOpen = () => {
    if (!company) return;
    setForm({
      companyName: company.companyName ?? "",
      phone: company.phone ?? "",
      website: company.website ?? "",
      location: company.location ?? "",
      companySize: company.companySize ?? "",
      description: company.description ?? "",
      industry: company.industry ?? "",
    });
    setEditOpen(true);
  };

  const handleSave = () => saveProfile(form);

  // ── Loading skeleton ──
  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-[#e8e4ff] rounded" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[#e8e4ff] rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-[#e8e4ff] rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-400">
        Failed to load profile. Please refresh.
      </div>
    );
  }

  const initials = company?.companyName
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "TC";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#111033]">Company Profile</h1>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#6c63ff] text-white border-0">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <p className="text-sm opacity-80">Graduates Contacted</p>
              <Users className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats?.totalGraduates ?? 0}</p>
            <p className="text-xs opacity-70 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border border-[#e8e4ff]">
          <CardContent className="p-5">
            <p className="text-sm text-[#7b74e6]">Shortlisted</p>
            <p className="text-3xl font-bold text-[#111033] mt-2">
              {stats?.frontendGraduates ?? 0}
            </p>
            <p className="text-xs text-[#7b74e6] mt-1">In review</p>
          </CardContent>
        </Card>

        <Card className="border border-[#e8e4ff]">
          <CardContent className="p-5">
            <p className="text-sm text-[#7b74e6]">Accepted Offers</p>
            <p className="text-3xl font-bold text-[#111033] mt-2">
              {stats?.backendGraduates ?? 0}
            </p>
            <p className="text-xs text-[#7b74e6] mt-1">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Profile Card ── */}
      <Card className="border border-[#e8e4ff] overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-[#6c63ff] to-[#a89cff]" />

        <CardContent className="p-6 -mt-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-xl font-bold text-[#111033] mb-4">
            {initials}
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-[#111033]">
                {company?.companyName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-green-100 text-green-600 hover:bg-green-100 text-xs">
                  {company?.isApproved ? "Active" : "Pending"}
                </Badge>
                <span className="text-sm text-[#7b74e6]">{company?.industry}</span>
              </div>
            </div>
            <Button
              onClick={handleEditOpen}
              className="bg-[#6c63ff] hover:bg-[#4d44db] text-white gap-2"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </Button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[
              { icon: <Mail className="w-4 h-4" />, label: "Email Address", value: company?.email },
              { icon: <Phone className="w-4 h-4" />, label: "Phone Number", value: company?.phone },
              { icon: <Globe className="w-4 h-4" />, label: "Website", value: company?.website },
              { icon: <MapPin className="w-4 h-4" />, label: "Location", value: company?.location },
              { icon: <Users className="w-4 h-4" />, label: "Company Size", value: company?.companySize },
              { icon: <Briefcase className="w-4 h-4" />, label: "Industry", value: company?.industry },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f3f0ff] flex items-center justify-center text-[#6c63ff] shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs text-[#7b74e6]">{label}</p>
                  <p className="text-sm text-[#111033] font-medium">
                    {value || "Not provided"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* About */}
          {company?.description && (
            <div className="mt-6 pt-6 border-t border-[#e8e4ff]">
              <h3 className="text-sm font-semibold text-[#111033] mb-2">About Company</h3>
              <p className="text-sm text-[#7b74e6] leading-relaxed">{company.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Edit Modal ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-[#7b74e6] mb-1 block">
                Company Name <span className="text-red-400">*</span>
              </label>
              <Input
                value={form.companyName}
                onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                className="border-[#b8a9ff] focus:ring-[#6c63ff]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7b74e6] mb-1 block">
                Email Address
              </label>
              <Input
                value={company?.email ?? ""}
                disabled
                className="bg-[#f3f0ff] border-[#b8a9ff] text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#7b74e6] mb-1 block">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="border-[#b8a9ff] focus:ring-[#6c63ff]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#7b74e6] mb-1 block">Website</label>
                <Input
                  value={form.website}
                  onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                  className="border-[#b8a9ff] focus:ring-[#6c63ff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#7b74e6] mb-1 block">
                  Industry <span className="text-red-400">*</span>
                </label>
                <Select
                  value={form.industry}
                  onValueChange={(v) => setForm((p) => ({ ...p, industry: v }))}
                >
                  <SelectTrigger className="border-[#b8a9ff]">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {["IT & Software", "Healthcare", "Finance", "Education", "Other"].map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#7b74e6] mb-1 block">
                  Company Size <span className="text-red-400">*</span>
                </label>
                <Select
                  value={form.companySize}
                  onValueChange={(v) => setForm((p) => ({ ...p, companySize: v }))}
                >
                  <SelectTrigger className="border-[#b8a9ff]">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Small (1-50)", "Mid (51-100)", "Mid (101-500)", "Large (500+)"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7b74e6] mb-1 block">
                Location <span className="text-red-400">*</span>
              </label>
              <Input
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                className="border-[#b8a9ff] focus:ring-[#6c63ff]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7b74e6] mb-1 block">
                Company Description <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="border-[#b8a9ff] focus:ring-[#6c63ff] resize-none"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-[#b8a9ff] text-[#6c63ff]">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#6c63ff] hover:bg-[#4d44db] text-white"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyProfile;