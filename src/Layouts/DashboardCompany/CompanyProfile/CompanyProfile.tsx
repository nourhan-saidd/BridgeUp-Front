import { useState, useEffect } from "react";
import axios from "axios"; // Imported Axios
import { Mail, Phone, Globe, MapPin, Users, Briefcase, Edit, Users2 } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/components/ui/separator";

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. State for the bottom Company Info card (API 1)
  const [profile, setProfile] = useState({
    name: "", status: "Active", industry: "",
    email: "", phone: "", website: "",
    location: "", size: "", about: "",
  });

  // 2. State for the top Stats cards (API 2)
  const [stats, setStats] = useState([
    { label: "Graduates Contacted", value: 0, sub: "This month", icon: Users2, primary: true },
    { label: "Shortlisted", value: 0, sub: "Candidates", icon: Users, primary: false },
    { label: "Sent Requests", value: 0, sub: "Total", icon: Mail, primary: false },
  ]);
  
  const [form, setForm] = useState(profile);

  // --- FETCH DATA FROM 2 SEPARATE APIs ON PAGE LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Promise.all fires both API requests simultaneously
        const [statsResponse, profileResponse] = await Promise.all([
          // 🛑 BACKEND NOTE: Replace with your Top Cards API URL
          axios.get("https://api.yourbackend.com/company/stats"),
          
          // 🛑 BACKEND NOTE: Replace with your Company Profile Info API URL
          axios.get("https://api.yourbackend.com/company/profile")
        ]);

        const statsData = statsResponse.data;
        const profileData = profileResponse.data;

        // Map and save company profile data
        // 💡 TIP: Make sure the keys (like profileData.name) match your backend spelling perfectly
        const mappedProfile = {
          name: profileData.name || "TechCorp Egypt",
          status: profileData.status || "Active",
          industry: profileData.industry || "IT & Software",
          email: profileData.email || "hr@techcorp.eg",
          phone: profileData.phone || "+20 100 000 0000",
          website: profileData.website || "www.techcorp.eg",
          location: profileData.location || "Cairo, Egypt",
          size: profileData.size || "Mid (101-500)",
          about: profileData.about || "Company description here...",
        };

        setProfile(mappedProfile);
        setForm(mappedProfile); // Fills input fields when clicking edit mode

        // Map and save top stats cards data
        setStats([
          { label: "Graduates Contacted", value: statsData.graduatesContacted || 0, sub: "This month", icon: Users2, primary: true },
          { label: "Shortlisted", value: statsData.shortlisted || 0, sub: "Candidates", icon: Users, primary: false },
          { label: "Sent Requests", value: statsData.sentRequests || 0, sub: "Total", icon: Mail, primary: false },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data with axios:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- SEND EDITED DATA TO BACKEND (SAVE CHANGES BUTTON) ---
  const handleSaveChanges = async () => {
    try {
      // 🛑 BACKEND NOTE: Replace with your actual Save Changes API URL
      await axios.put("https://api.yourbackend.com/company/edit-profile", form);

      setProfile(form); // Update the visual UI state
      setIsEditing(false);
      alert("Profile updated successfully!");
      
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while saving changes. Please try again.");
    }
  };

  const infoFields = [
    { icon: Mail, label: "Email Address", value: profile.email },
    { icon: Phone, label: "Phone Number", value: profile.phone },
    { icon: Globe, label: "Website", value: profile.website },
    { icon: MapPin, label: "Location", value: profile.location },
    { icon: Users, label: "Company Size", value: profile.size },
    { icon: Briefcase, label: "Industry", value: profile.industry },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-semibold text-[#6c63ff]">
        Loading Profile Data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#111033]">Company Profile</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className={`border-0 shadow-sm ${s.primary ? "bg-[#6c63ff] text-white" : "bg-white"}`}>
            <CardContent className="p-5 flex justify-between items-start">
              <div>
                <p className={`text-sm ${s.primary ? "text-[#c4c0ff]" : "text-[#7b74e6]"}`}>{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.primary ? "text-white" : "text-[#111033]"}`}>{s.value}</p>
                <p className={`text-xs mt-1 ${s.primary ? "text-[#c4c0ff]" : "text-gray-400"}`}>{s.sub}</p>
              </div>
              <s.icon className={`w-5 h-5 ${s.primary ? "text-[#c4c0ff]" : "text-[#b8a9ff]"}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Profile Info Card */}
      <Card className="border border-[#e8e4ff] shadow-sm overflow-hidden">
        <div className="h-32 bg-[#6c63ff]" />
        <CardContent className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl border-2 border-[#b8a9ff] flex items-center justify-center text-[#6c63ff] font-bold text-2xl shadow-md">
              TC
            </div>
            {!isEditing && (
              <Button onClick={() => { setForm(profile); setIsEditing(true); }} className="bg-[#6c63ff] hover:bg-[#4d44db] text-white gap-2">
                <Edit className="w-4 h-4" /> Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Company Name", key: "name" }, { label: "Industry", key: "industry" },
                  { label: "Email", key: "email" }, { label: "Phone", key: "phone" },
                  { label: "Website", key: "website" }, { label: "Location", key: "location" },
                  { label: "Company Size", key: "size" },
                ].map(({ label, key }) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-[#7b74e6] text-xs">{label}</Label>
                    <Input value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="border-[#b8a9ff] focus-visible:ring-[#6c63ff]" />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <Label className="text-[#7b74e6] text-xs">About</Label>
                <Textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })}
                  rows={3} className="border-[#b8a9ff] focus-visible:ring-[#6c63ff]" />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSaveChanges} className="bg-[#6c63ff] hover:bg-[#4d44db] text-white">Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="border-[#b8a9ff] text-[#6c63ff]">Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-[#111033]">{profile.name}</h2>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{profile.status}</Badge>
                <span className="text-sm text-[#7b74e6]">{profile.industry}</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {infoFields.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#f3f0ff] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#6c63ff]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#7b74e6]">{label}</p>
                      <p className="text-sm text-[#111033]">{value || "Not provided"}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-5 bg-[#e8e4ff]" />
              <div>
                <h3 className="text-sm font-semibold text-[#111033] mb-2">About Company</h3>
                <p className="text-sm text-[#7b74e6] leading-relaxed">{profile.about}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfile;