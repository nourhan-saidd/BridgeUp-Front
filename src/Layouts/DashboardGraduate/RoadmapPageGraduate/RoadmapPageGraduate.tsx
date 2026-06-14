import { useQuery } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { BookOpen, CheckCircle, ChevronDown } from "lucide-react";

type Resource = {
  _id?: string;
  title?: string;
  url?: string;
  type?: string;
};

type Phase = {
  _id?: string;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  topics?: string[] | { title?: string; name?: string }[];
  resources?: Resource[];
};

type Roadmap = {
  _id?: string;
  track?: string;
  phases?: Phase[];
};

async function getMyRoadmap() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt");

  const { data } = await axiosinstance.get(
    "/api/v1/graduates/me/roadmap",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}

export default function RoadmapPageGraduate() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myRoadmap"],
    queryFn: getMyRoadmap,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const roadmap: Roadmap = data?.data || data;

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (isError) {
    return <div className="p-8 text-red-500">Error Loading Roadmap</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        My Roadmap
      </h1>

      <div className="rounded-2xl border border-[#dddaf3] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ebe9ff] text-[#5a4cc7]">
            <BookOpen size={24} />
          </div>

          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {roadmap?.track || "My Track"} Roadmap
              </h2>

              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-600">
                {roadmap?.phases?.length || 0} Phases
              </span>
            </div>

            <p className="text-[#6f6d99]">
              Learning roadmap for {roadmap?.track || "your track"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {roadmap?.phases?.map((phase, index) => (
            <details
              key={phase._id || index}
              className="group rounded-xl border border-[#dddaf3] bg-[#fafaff] p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5a4cc7] text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <h3 className="font-bold text-gray-900">
                    {phase.title || phase.name || `Phase ${index + 1}`}
                  </h3>
                </div>

                <ChevronDown className="transition group-open:rotate-180" />
              </summary>

              <div className="mt-5 border-t border-[#dddaf3] pt-4">
                <p className="mb-4 text-sm text-[#6f6d99]">
                  {phase.description ||
                    phase.content ||
                    "No description available"}
                </p>

                {phase.resources && phase.resources.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-900">
                      Resources
                    </h4>

                    <ul className="space-y-2">
                      {phase.resources.map((resource, resourceIndex) => (
                        <li
                          key={resource._id || resourceIndex}
                          className="flex items-center gap-2 text-sm text-[#6f6d99]"
                        >
                          <CheckCircle size={15} />

                          {resource.url ? (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#5a4cc7] hover:underline"
                            >
                              {resource.title || "Open Resource"}
                            </a>
                          ) : (
                            <span>{resource.title || "Resource"}</span>
                          )}

                          {resource.type && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                              {resource.type}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}