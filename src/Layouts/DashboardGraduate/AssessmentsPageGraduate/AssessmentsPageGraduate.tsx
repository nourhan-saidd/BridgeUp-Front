import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import {
  Clock,
  FileText,
  Award,
  X,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Quiz = {
  _id?: string;
  id?: string;
  quizId?: string;
  title?: string;
  description?: string;
  duration?: string | number;
  numberOfQuestions?: number;
  questions?: unknown[];
  track?: string;
};

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt")
  );
}

async function getQuizzes() {
  const { data } = await axiosinstance.get("/api/v1/quizzes", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return data;
}

export default function AssessmentsPageGraduate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isSEB =
    searchParams.get("seb") === "1" ||
    sessionStorage.getItem("isSEB") === "true";

  const [safeModalQuizId, setSafeModalQuizId] = useState<string | null>(null);
  const [rulesQuiz, setRulesQuiz] = useState<Quiz | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const quizzes: Quiz[] = data?.data || data?.quizzes || [];

  function getQuizId(quiz: Quiz) {
    return quiz.quizId || quiz._id || quiz.id;
  }

  function handleStartClick(quiz: Quiz) {
    const quizId = getQuizId(quiz);

    if (!quizId) {
      alert("Quiz ID not found");
      return;
    }

    if (!isSEB) {
      setSafeModalQuizId(quizId);
      return;
    }

    setRulesQuiz(quiz);
  }

  function openSebConfig() {
    if (!safeModalQuizId) return;

    localStorage.setItem("currentQuizId", safeModalQuizId);

    window.open(`${window.location.origin}/bridgeup.seb`, "_blank");
  }

  function downloadSafeExamBrowser() {
    window.open("https://safeexambrowser.org/download_en.html", "_blank");
  }

  function startExamNow() {
    if (!rulesQuiz) return;

    const quizId = getQuizId(rulesQuiz);

    if (!quizId) {
      alert("Quiz ID not found");
      return;
    }

    sessionStorage.setItem("currentQuizId", quizId);

    navigate(
      `/dashboardgraduate/assessmentquestionspagegraduate?quizId=${quizId}&seb=1`
    );
  }

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (isError) {
    return <div className="p-8 text-red-500">Error Loading Exams</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Assessments
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
            Read the rules carefully before starting your attempt.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz._id || quiz.id || index}
            className="flex items-center justify-between rounded-2xl border border-[#dddaf3] bg-white p-6 shadow-sm"
          >
            <div>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">
                  {quiz.title || `Exam ${index + 1}`}
                </h2>

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-600">
                  {quiz.track || "General"}
                </span>
              </div>

              <p className="mb-5 text-[#6f6d99]">
                {quiz.description || "No description"}
              </p>

              <div className="flex gap-8 text-sm text-[#6f6d99]">
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {quiz.duration || 0} minutes
                </span>

                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  {quiz.numberOfQuestions || quiz.questions?.length || 0}{" "}
                  questions
                </span>
              </div>
            </div>

            <button
              onClick={() => handleStartClick(quiz)}
              className="rounded-xl bg-[#5a4cc7] px-6 py-3 font-semibold text-white hover:bg-[#4b3fba]"
            >
              {isSEB ? "Start Attempt" : "Start Exam"}
            </button>
          </div>
        ))}
      </div>

      {safeModalQuizId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Safe Exam Browser Required
              </h2>

              <button
                onClick={() => setSafeModalQuizId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>

            <p className="mb-6 text-sm text-gray-600">
              Please open the exam using Safe Exam Browser. If you already have
              it installed, open the config file. If not, download it first.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={openSebConfig}
                className="rounded-xl bg-[#5a4cc7] px-5 py-3 font-semibold text-white hover:bg-[#4b3fba]"
              >
                Open Safe Exam Browser Config
              </button>

              <button
                onClick={downloadSafeExamBrowser}
                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Download Safe Exam Browser
              </button>

              <button
                onClick={() => setSafeModalQuizId(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {rulesQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <ShieldCheck className="text-[#5a4cc7]" />
                Exam Rules
              </h2>

              <button
                onClick={() => setRulesQuiz(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>

            <ul className="mb-6 list-disc space-y-2 pl-5 text-sm text-gray-600">
              <li>Do not close Safe Exam Browser during the exam.</li>
              <li>Do not refresh or leave the exam page.</li>
              <li>Answer all questions before submitting.</li>
              <li>You may have only one attempt.</li>
              <li>Make sure your internet connection is stable.</li>
            </ul>

            <button
              onClick={startExamNow}
              className="w-full rounded-xl bg-[#5a4cc7] px-5 py-3 font-semibold text-white hover:bg-[#4b3fba]"
            >
              Start Exam Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}