import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";

type Graduate = {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: string;
  university?: string;
  graduationYear?: number;
  track?: string;
  cv?: string;
  profilePicture?: string;
  gitHubProfile?: string;
  linkedInProfile?: string;
  portfolioLink?: string;
};

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("userToken") ||
  localStorage.getItem("jwt");

async function getProfile() {
  const { data } = await axiosinstance.get("/api/v1/graduates/me", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return data;
}

async function updateProfile(body: Partial<Graduate>) {
  const { data } = await axiosinstance.put("/api/v1/graduates/me", body, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return data;
}

async function updateProfilePicture(file: File) {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const { data } = await axiosinstance.put("/api/v1/graduates/me", formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

async function uploadCv(file: File) {
  const formData = new FormData();
  formData.append("cv", file);

  const { data } = await axiosinstance.put(
    "/api/v1/graduates/me/documents",
    formData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export default function ProfilePageGraduate() {
  const queryClient = useQueryClient();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    university: "",
    portfolioLink: "",
    gitHubProfile: "",
    linkedInProfile: "",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["graduateProfile"],
    queryFn: getProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const graduate: Graduate = data?.data || data || {};

  useEffect(() => {
    if (graduate.email) {
      const savedImage = localStorage.getItem(
        `profilePreviewImage_${graduate.email}`
      );

      const savedCv = localStorage.getItem(`graduateCvName_${graduate.email}`);

      setPreviewImage(savedImage);
      setCvName(savedCv);
    }
  }, [graduate.email]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfile"] });
      setEditMode(false);
    },
  });

  const profilePictureMutation = useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfile"] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: uploadCv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfile"] });
    },
  });

  function handleEdit() {
    setFormData({
      fullName: graduate.fullName || "",
      email: graduate.email || "",
      phone: graduate.phone || "",
      age: graduate.age?.toString() || "",
      university: graduate.university || "",
      portfolioLink: graduate.portfolioLink || "",
      gitHubProfile: graduate.gitHubProfile || "",
      linkedInProfile: graduate.linkedInProfile || "",
    });

    setEditMode(true);
  }

  function handleSave() {
    updateMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      age: Number(formData.age),
      university: formData.university,
      portfolioLink: formData.portfolioLink,
      gitHubProfile: formData.gitHubProfile,
      linkedInProfile: formData.linkedInProfile,
    });
  }

  function handleProfileImage(file: File) {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewImage(base64);

      if (graduate.email) {
        localStorage.setItem(
          `profilePreviewImage_${graduate.email}`,
          base64
        );
      }
    };

    reader.readAsDataURL(file);
    profilePictureMutation.mutate(file);
  }

  function handleCvFile(file: File) {
    setCvName(file.name);

    if (graduate.email) {
      localStorage.setItem(`graduateCvName_${graduate.email}`, file.name);
    }

    uploadMutation.mutate(file);
  }

  const initials =
    graduate.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "G";

  const cvFileName =
    cvName || (graduate.cv ? graduate.cv.split("/").pop() : null);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Error Loading Profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">
        Profile
      </h1>

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">
            Personal Information
          </h2>

          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 text-2xl font-semibold text-white">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <label className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProfileImage(file);
                }}
              />

              {profilePictureMutation.isPending
                ? "Uploading..."
                : "Update Photo"}
            </label>

            {profilePictureMutation.isSuccess && (
              <p className="text-xs text-green-600">Photo saved</p>
            )}

            {profilePictureMutation.isError && (
              <p className="text-xs text-red-500">Failed to upload photo</p>
            )}
          </div>

          <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
            <EditableInfo
              label="Name"
              value={graduate.fullName}
              editMode={editMode}
              inputValue={formData.fullName}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, fullName: value }))
              }
            />

            <div>
              <p className="mb-1 text-xs text-gray-400">Track</p>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {graduate.track || "No Track"} Track
              </span>
            </div>

            <EditableInfo
              label="Email"
              value={graduate.email}
              editMode={editMode}
              inputValue={formData.email}
              type="email"
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, email: value }))
              }
            />

            <EditableInfo
              label="Phone"
              value={graduate.phone}
              editMode={editMode}
              inputValue={formData.phone}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, phone: value }))
              }
            />

            <EditableInfo
              label="Age"
              value={graduate.age ? `${graduate.age} years` : "-"}
              editMode={editMode}
              inputValue={formData.age}
              type="number"
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, age: value }))
              }
            />

            <EditableInfo
              label="University"
              value={graduate.university}
              editMode={editMode}
              inputValue={formData.university}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, university: value }))
              }
            />

            <Info
              label="Graduation Year"
              value={graduate.graduationYear?.toString()}
            />

            <Info label="Gender" value={graduate.gender} />
          </div>
        </div>

        {updateMutation.isSuccess && (
          <p className="mt-4 text-sm text-green-600">
            Profile updated successfully
          </p>
        )}

        {updateMutation.isError && (
          <p className="mt-4 text-sm text-red-500">
            Failed to update profile
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-gray-800">
          Documents & Links
        </h2>

        <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {cvFileName || "No CV uploaded"}
            </p>
            <p className="text-xs text-gray-400">
              Upload or update your CV
            </p>

            {uploadMutation.isSuccess && (
              <p className="mt-1 text-xs text-green-600">
                CV saved successfully
              </p>
            )}

            {uploadMutation.isError && (
              <p className="mt-1 text-xs text-red-600">
                Failed to upload CV
              </p>
            )}
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCvFile(file);
              }}
            />

            <span className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              {uploadMutation.isPending ? "Uploading..." : "Update CV"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <LinkBox label="Portfolio" href={graduate.portfolioLink} />
          <LinkBox label="GitHub" href={graduate.gitHubProfile} />
          <LinkBox label="LinkedIn" href={graduate.linkedInProfile} />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="mb-1 text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-700">{value || "-"}</p>
    </div>
  );
}

function EditableInfo({
  label,
  value,
  editMode,
  inputValue,
  onChange,
  type = "text",
}: {
  label: string;
  value?: string;
  editMode: boolean;
  inputValue: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs text-gray-400">{label}</p>

      {editMode ? (
        <input
          type={type}
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        />
      ) : (
        <p className="text-sm text-gray-700">{value || "-"}</p>
      )}
    </div>
  );
}

function LinkBox({ label, href }: { label: string; href?: string }) {
  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noreferrer"
      className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500 hover:bg-gray-100"
    >
      {label}
    </a>
  );
}