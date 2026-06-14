import { useState } from "react";
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
  gitHubProfile?: string;
  linkedInProfile?: string;
  portfolioLink?: string;
  createdAt?: string;
};

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("userToken") ||
  localStorage.getItem("jwt");

async function getProfile() {
  const endpoints = [
    "/api/v1/graduates/me",
    "/api/v1/auth/me",
    "/api/v1/users/me",
    "/api/v1/graduates/profile",
    "/api/v1/graduates/my-profile",
  ];

  for (const endpoint of endpoints) {
    try {
      const { data } = await axiosinstance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log("WORKING PROFILE ENDPOINT:", endpoint);
      return data;
    } catch {
      continue;
    }
  }

  throw new Error("No profile endpoint worked");
}

async function updateProfile(body: Partial<Graduate>) {
  const { data } = await axiosinstance.put("/api/v1/graduates/me", body, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return data;
}

async function uploadCv(file: File) {
  const formData = new FormData();
  formData.append("cv", file);
  formData.append("file", file);
  formData.append("documents", file);

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

  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["graduateProfile"],
    queryFn: getProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const graduate: Graduate =
    data?.data || data?.graduate || data?.user || data || {};

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfile"] });
      setEditMode(false);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: uploadCv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graduateProfile"] });
    },
  });

  function handleEdit() {
    setPhone(graduate.phone || "");
    setEditMode(true);
  }

  function handleSave() {
    updateMutation.mutate({
      phone,
    });
  }

  const initials =
    graduate.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "G";

  const cvFileName = graduate.cv ? graduate.cv.split("/").pop() : null;

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

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

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Profile Completion" value="75%" sub="Almost done" />
        <StatCard title="Exams Done" value="2/3" sub="Technical remaining" />
        <StatCard title="Job Offers" value="0" sub="Awaiting your reply" />
      </div>

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
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-semibold text-white">
            {initials}
          </div>

          <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
            <Info label="Name" value={graduate.fullName} />

            <div>
              <p className="mb-1 text-xs text-gray-400">Track</p>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {graduate.track || "No Track"} Track
              </span>
            </div>

            <Info label="Email" value={graduate.email} />

            <div>
              <p className="mb-1 text-xs text-gray-400">Phone</p>

              {editMode ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                />
              ) : (
                <p className="text-sm text-gray-700">
                  {graduate.phone || "-"}
                </p>
              )}
            </div>

            <Info
              label="Age"
              value={graduate.age ? `${graduate.age} years` : "-"}
            />

            <Info label="University" value={graduate.university} />

            <Info
              label="Graduation Year"
              value={graduate.graduationYear?.toString()}
            />

            <Info label="Gender" value={graduate.gender} />
          </div>
        </div>

        {updateMutation.isSuccess && (
          <p className="mt-4 text-sm text-green-600">
            Phone updated successfully
          </p>
        )}

        {updateMutation.isError && (
          <p className="mt-4 text-sm text-red-500">
            Failed to update phone
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
                CV uploaded successfully
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
                if (file) uploadMutation.mutate(file);
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

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm text-gray-500">{title}</p>
      <p className="mb-1 text-3xl font-semibold text-gray-800">{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
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