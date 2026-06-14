import { useEffect, useState } from "react";

interface Resource {
  _id: string;
  title: string;
  url: string;
  type: "doc" | "video";
}

interface Phase {
  _id: string;
  title: string;
  order: number;
  summary: string;
  resources: Resource[];
}

interface Roadmap {
  _id: string;
  track: string;
  phases: Phase[];
}

interface Graduate {
  track: string;
}

export default function RoadmapPageGraduate() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [graduate, setGraduate] = useState<Graduate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<string | null>(null);

  const BASE_URL = "http://localhost:5000/api/v1";

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [roadmapsRes, profileRes] = await Promise.all([
        fetch(`${BASE_URL}/roadmaps`, { headers }),
        fetch(`${BASE_URL}/graduates/me`, { headers }),
      ]);

      if (!roadmapsRes.ok) throw new Error("Failed to fetch roadmaps");
      if (!profileRes.ok) throw new Error("Failed to fetch profile");

      const roadmapsJson = await roadmapsRes.json();
      const profileJson = await profileRes.json();

      setRoadmaps(roadmapsJson.data);
      setGraduate(profileJson.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

  const roadmap = roadmaps.find(
    (r) => r.track.toLowerCase() === graduate?.track.toLowerCase()
  );

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-sm">
        No roadmap available for your track.
      </div>
    );
  }

  const totalPhases = roadmap.phases.length;
  const completedPhases = 0;
  const progressPercent = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Learning Roadmap</h1>

      {/* Track Header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: "linear-gradient(135deg, #5B4BDB 0%, #7C6FF7 100%)" }}>
        <h2 className="text-xl font-bold text-white mb-1">{roadmap.track} Development Track</h2>
        <p className="text-indigo-200 text-sm mb-4">Complete all phases to become job-ready</p>
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-lg">{progressPercent}%</span>
          <div className="flex-1 h-2 bg-white/30 rounded-full">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="flex flex-col gap-4">
        {roadmap.phases.map((phase, index) => {
          const isActive = activePhase === phase._id;
          const isFirst = index === 0;

          return (
            <div key={phase._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isFirst ? "border-indigo-200" : "border-gray-100"}`}>
              <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${isFirst ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {phase.order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-base font-semibold ${isFirst ? "text-gray-800" : "text-gray-400"}`}>{phase.title}</h3>
                      {isFirst && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                      )}
                      {index === 1 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                      )}
                      {index > 1 && (
                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium">Locked</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{phase.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isFirst && (
                    <button className="text-sm border border-gray-200 rounded-xl px-4 py-2 text-gray-600 hover:bg-gray-50 transition font-medium">
                      Review
                    </button>
                  )}
                  {index === 1 && (
                    <button className="text-sm bg-indigo-600 text-white rounded-xl px-4 py-2 hover:bg-indigo-700 transition font-medium">
                      Continue
                    </button>
                  )}
                  <button
                    onClick={() => setActivePhase(isActive ? null : phase._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-400"
                  >
                    <svg className={`w-4 h-4 transition-transform ${isActive ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-6 pb-2">
                <div className="w-full h-1 bg-gray-100 rounded-full">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: isFirst ? "100%" : index === 1 ? "60%" : "0%" }} />
                </div>
              </div>

              {/* Resources Dropdown */}
              {isActive && phase.resources.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-50 bg-gray-50">
                  <div className="flex flex-col gap-2">
                    {phase.resources.map((resource) => (
                      <a key={resource._id} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition group">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100">
                          {resource.type === "video" ? (
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{resource.title}</p>
                          <p className="text-xs text-gray-400 capitalize">{resource.type}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}