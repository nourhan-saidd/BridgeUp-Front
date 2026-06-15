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

function getScoreStatus(score?: number | string) {
  const value = Number(score);

  if (!score && score !== 0) {
    return {
      text: "Pending",
      className: "bg-purple-100 text-purple-600",
    };
  }

  if (value === 0) {
    return {
      text: "Not Started",
      className: "bg-gray-100 text-gray-500",
    };
  }

  if (value >= 90) {
    return {
      text: "Outstanding",
      className: "bg-green-100 text-green-600",
    };
  }

  if (value >= 80) {
    return {
      text: "Excellent",
      className: "bg-green-100 text-green-600",
    };
  }

  if (value >= 70) {
    return {
      text: "Good",
      className: "bg-blue-100 text-blue-600",
    };
  }

  if (value >= 50) {
    return {
      text: "Passed",
      className: "bg-yellow-100 text-yellow-600",
    };
  }

  return {
    text: "Needs Improvement",
    className: "bg-red-100 text-red-600",
  };
}

type ScoreCardProps = {
  title: string;
  score: number | string;
};

function ScoreCard({ title, score }: ScoreCardProps) {
  const status = getScoreStatus(score);

  return (
    <div className="flex h-[185px] flex-col items-center justify-center rounded-2xl border border-[#dddaf3] bg-white shadow-sm">
      <p className="mb-3 text-sm text-[#6f6d99]">{title}</p>

      <h2 className="mb-4 text-5xl font-light text-[#5a4cc7]">
        {score ?? "-"}
      </h2>

      <span className={`rounded-full px-4 py-1 text-xs ${status.className}`}>
        {status.text}
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

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
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
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Scores</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ScoreCard title="IQ Assessment" score={scores?.iqScore ?? 0} />
        <ScoreCard title="English Proficiency" score={scores?.englishScore ?? 0} />
        <ScoreCard title="Technical Skills" score={scores?.technicalScore ?? 0} />
      </div>
    </div>
  );
}