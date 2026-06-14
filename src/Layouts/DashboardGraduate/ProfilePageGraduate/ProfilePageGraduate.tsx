import { useEffect, useState } from "react";

interface Graduate {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  university: string;
  graduationYear: number;
  track: string;
  cv?: string;
  gitHubProfile?: string;
  linkedInProfile?: string;
  portfolioLink?: string;
  profilePicture?: string;
  createdAt?: string;
}

export default function ProfilePageGraduate() {
  const [graduate, setGraduate] = useState<Graduate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUniversity, setEditUniversity] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const BASE_URL = "http://localhost:5000/api/v1";

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/graduates/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const json = await res.json();
      setGraduate(json.data);
      setEditFullName(json.data.fullName ?? "");
      setEditPhone(json.data.phone ?? "");
      setEditAge(json.data.age?.toString() ?? "");
      setEditEmail(json.data.email ?? "");
      setEditUniversity(json.data.university ?? "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSaveError(null);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/graduates/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: editFullName,
          phone: editPhone,
          age: Number(editAge),
          email: editEmail,
          university: editUniversity,
          graduationYear: graduate?.graduationYear,
          portfolioLink: graduate?.portfolioLink,
          gitHubProfile: graduate?.gitHubProfile,
          linkedInProfile: graduate?.linkedInProfile,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await fetchProfile();
      setEditMode(false);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCvUpload(file: File) {
    try {
      setUploadingCv(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("cv", file);
      const res = await fetch(`${BASE_URL}/graduates/me/documents`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload CV");
      await fetchProfile();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingCv(false);
    }
  }

  const initials = graduate?.fullName
    ? graduate.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AH";

  const cvFileName = graduate?.cv ? graduate.cv.split("/").pop() : null;

  const cvUploadedAt = graduate?.createdAt
    ? new Date(graduate.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-start shadow-sm">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Profile Completion</p>
            <p className="text-3xl font-semibold text-gray-800 mb-3">75%</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: "75%" }} />
            </div>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center ml-4 flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-start shadow-sm">
          <div>
            <p className="text-sm text-gray-500 mb-1">Exams Done</p>
            <p className="text-3xl font-semibold text-gray-800 mb-1">2/3</p>
            <p className="text-xs text-gray-400">Technical remaining</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-start shadow-sm">
          <div>
            <p className="text-sm text-gray-500 mb-1">Job Offers</p>
            <p className="text-3xl font-semibold text-gray-800 mb-1">0</p>
            <p className="text-xs text-gray-400">Awaiting your reply</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-semibold text-gray-800">Personal Information</h2>
          <div className="flex items-center gap-2">
            {saveError && <span className="text-xs text-red-500">{saveError}</span>}
            {editMode ? (
              <>
                <button onClick={() => { setEditMode(false); setSaveError(null); }} className="text-sm border border-gray-200 rounded-lg px-4 py-1.5 text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="text-sm bg-indigo-600 text-white rounded-lg px-4 py-1.5 hover:bg-indigo-700 transition disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} className="text-sm border border-gray-200 rounded-lg px-4 py-1.5 text-gray-600 hover:bg-gray-50 transition flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-semibold flex-shrink-0">
            {initials}
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-6 flex-1">
            <div>
              <p className="text-xs text-gray-400 mb-1">Name</p>
              {editMode ? (
                <input type="text" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
              ) : (
                <p className="text-sm font-medium text-gray-700">{graduate?.fullName}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Track</p>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                {graduate?.track} Track
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Email</p>
              {editMode ? (
                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
              ) : (
                <p className="text-sm text-gray-700">{graduate?.email}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Phone</p>
              {editMode ? (
                <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
              ) : (
                <p className="text-sm text-gray-700">{graduate?.phone}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Age</p>
              {editMode ? (
                <input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
              ) : (
                <p className="text-sm text-gray-700">{graduate?.age} years</p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">University</p>
              {editMode ? (
                <input type="text" value={editUniversity} onChange={(e) => setEditUniversity(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
              ) : (
                <p className="text-sm text-gray-700">{graduate?.university}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Graduation Year</p>
              <p className="text-sm text-gray-700">{graduate?.graduationYear}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-semibold text-gray-800">Documents & Links</h2>
        </div>

        <div className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3 mb-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{cvFileName ?? "No CV uploaded"}</p>
              {cvUploadedAt && <p className="text-xs text-gray-400">Uploaded {cvUploadedAt}</p>}
            </div>
          </div>
          <label className="cursor-pointer">
            <input type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCvUpload(f); }} />
            <span className="flex items-center gap-1.5 text-sm border border-gray-200 bg-white rounded-lg px-4 py-1.5 hover:bg-gray-50 transition text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {uploadingCv ? "Uploading..." : "Update CV"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a href={graduate?.portfolioLink ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition bg-gray-50">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Portfolio
          </a>
          <a href={graduate?.gitHubProfile ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition bg-gray-50">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}