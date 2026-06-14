import { useQuery } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";

async function getScores() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt");

  const { data } = await axiosinstance.get(
    "/api/v1/graduates/assessments/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}

type ScoreCardProps = {
  title: string;
  score: number | string;
  status: string;
  statusClass: string;
};

function ScoreCard({
  title,
  score,
  status,
  statusClass,
}: ScoreCardProps) {
  return (
    <div className="flex h-[185px] flex-col items-center justify-center rounded-2xl border border-[#dddaf3] bg-white shadow-sm">
      <p className="mb-3 text-sm text-[#6f6d99]">{title}</p>

      <h2 className="mb-4 text-5xl font-light text-[#5a4cc7]">
        {score}
      </h2>

      <span className={`rounded-full px-4 py-1 text-xs ${statusClass}`}>
        {status}
      </span>
    </div>
  );
}

export default function ScorePageGraduate() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["graduateScores"],
    queryFn: getScores,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const scores = data?.data;

  console.log("Scores:", data);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Error Loading Scores
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        My Scores
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ScoreCard
          title="IQ Assessment"
          score={scores?.iqScore ?? "-"}
          status="Excellent"
          statusClass="bg-green-100 text-green-600"
        />

        <ScoreCard
          title="English Proficiency"
          score={scores?.englishScore ?? "-"}
          status="Outstanding"
          statusClass="bg-green-100 text-green-600"
        />

        <ScoreCard
          title="Technical Skills"
          score={scores?.technicalScore ?? "-"}
          status={scores?.technicalScore ? "Completed" : "Pending"}
          statusClass={
            scores?.technicalScore
              ? "bg-green-100 text-green-600"
              : "bg-purple-100 text-purple-600"
          }
        />
      </div>
    </div>
  );
}