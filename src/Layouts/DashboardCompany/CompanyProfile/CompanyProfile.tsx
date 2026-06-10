import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";

import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";

import { Pencil } from "lucide-react";

const CompanyProfile = () => {
  const queryClient = useQueryClient();
  const { token } = useContext(authContext);

  const [editOpen, setEditOpen] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    phone: "",
    website: "",
    location: "",
    companySize: "",
    description: "",
    industry: "",
  });

  // ── GET PROFILE ──
  const getProfile = async () => {
    const res = await axiosinstance.get("api/v1/company/profile");
    return res.data;
  };

  // ── UPDATE PROFILE ──
  const updateProfile = async (payload) => {
    const res = await axiosinstance.put("api/v1/company/profile", payload);
    return res.data;
  };

  // ── QUERY ──
  const { data, isLoading, error } = useQuery({
    queryKey: ["companyProfile", token],
    queryFn: getProfile,
    enabled: !!token,
  });

  const company = data?.data?.company;
  const stats = data?.data?.stats;

  // ── MUTATION ──
  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
      setEditOpen(false);
    },
    onError: (err) => console.log(err),
  });

  // ── OPEN EDIT ──
  const handleEditOpen = () => {
    if (!company) return;

    setForm({
      companyName: company.companyName || "",
      phone: company.phone || "",
      website: company.website || "",
      location: company.location || "",
      companySize: company.companySize || "",
      description: company.description || "",
      industry: company.industry || "",
    });

    setEditOpen(true);
  };

  const handleSave = () => {
    saveProfile(form);
  };

  if (isLoading) return <div className="py-20 text-center">Loading...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error loading profile</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Company Profile</h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">

        <Card className="bg-purple-600 text-white">
          <CardContent className="p-5">
            <p>Graduates Contacted</p>
            <p className="text-3xl font-bold">{stats?.totalGraduates || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p>Shortlisted</p>
            <p className="text-3xl font-bold">{stats?.frontendGraduates || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p>Accepted Offers</p>
            <p className="text-3xl font-bold">{stats?.backendGraduates || 0}</p>
          </CardContent>
        </Card>

      </div>

      {/* PROFILE CARD */}
      <Card>
        <CardContent className="p-6 flex justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {company?.companyName}
            </h2>
            <p className="text-gray-500">{company?.industry}</p>
          </div>

          <Button onClick={handleEditOpen}>
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSave}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CompanyProfile;