import { useQuery } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { Clock, FileText, Award } from "lucide-react";

type Exam = {
  _id?: string;
  title: string;
  description: string;
  duration: string;
  numberOfQuestions: number;
  track: string;
};

async function getMyExams() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt");

  const { data } = await axiosinstance.get("/api/v1/questions/my-exams", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export default function MyExamsPageGraduate() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myExams"],
    queryFn: getMyExams,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const exams: Exam[] = data?.data || [];

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (isError) {
    return <div className="p-8 text-red-500">Error Loading Exams</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        My Exams
      </h1>

      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#dddaf3] bg-[#f0effb] p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dedbf7] text-[#5a4cc7]">
          <Award size={26} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Available Exams
          </h2>
          <p className="text-[#6f6d99]">
            Complete your exams to improve your hiring chances.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {exams.map((exam, index) => (
          <div
            key={exam._id || index}
            className="flex items-center justify-between rounded-2xl border border-[#dddaf3] bg-white p-6 shadow-sm"
          >
            <div>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">
                  {exam.title}
                </h2>

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-600">
                  {exam.track}
                </span>
              </div>

              <p className="mb-5 text-[#6f6d99]">
                {exam.description}
              </p>

              <div className="flex gap-8 text-sm text-[#6f6d99]">
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {exam.duration} minutes
                </span>

                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  {exam.numberOfQuestions} questions
                </span>
              </div>
            </div>

            <button className="rounded-xl bg-[#5a4cc7] px-6 py-3 font-semibold text-white hover:bg-[#4b3fba]">
              Start Exam
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}