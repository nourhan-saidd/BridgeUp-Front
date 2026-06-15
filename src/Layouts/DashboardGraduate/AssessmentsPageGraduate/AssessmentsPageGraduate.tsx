import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { Clock, FileText, Award, X, ShieldCheck } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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

type Answer = {
  _id: string;
  text?: string;
  answerText?: string;
  title?: string;
  option?: string;
  content?: string;
  isCorrect?: boolean;
};

type Question = {
  _id: string;
  question?: string;
  questionText?: string;
  title?: string;
  text?: string;
  content?: string;
  body?: string;
  name?: string;
  answers?: Answer[];
  options?: Answer[];
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
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return data;
}

async function getMyAttempts() {
  const { data } = await axiosinstance.get("/api/v1/assessments/my-attempts", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return data;
}

async function startAssessment(quizId: string) {
  const { data } = await axiosinstance.get(
    `/api/v1/assessments/start?quizId=${quizId}&seb=1`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  return data;
}

async function submitAssessment({
  quizId,
  answers,
}: {
  quizId: string;
  answers: { questionId: string; answerId: string }[];
}) {
  const { data } = await axiosinstance.post(
    "/api/v1/assessments/submit?seb=1",
    { quizId, answers },
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  return data;
}

export default function AssessmentsPageGraduate() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const isSEB =
    searchParams.get("seb") === "1" ||
    sessionStorage.getItem("isSEB") === "true";

  const [safeModalQuizId, setSafeModalQuizId] = useState<string | null>(null);
  const [rulesQuiz, setRulesQuiz] = useState<Quiz | null>(null);
  const [startedQuizId, setStartedQuizId] = useState<string | null>(null);
  const [selectedQuizTitle, setSelectedQuizTitle] = useState("Exam");
  const [answers, setAnswers] = useState<
    { questionId: string; answerId: string }[]
  >([]);
  const [result, setResult] = useState<any>(null);

  const quizzesQuery = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const attemptsQuery = useQuery({
    queryKey: ["myAttempts"],
    queryFn: getMyAttempts,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const examQuery = useQuery({
    queryKey: ["startAssessment", startedQuizId],
    queryFn: () => startAssessment(startedQuizId!),
    enabled: !!startedQuizId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const submitMutation = useMutation({
    mutationFn: submitAssessment,
    onSuccess: (res) => {
      setResult(res);
      queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
    },
  });

  const allQuizzes: Quiz[] =
    quizzesQuery.data?.data || quizzesQuery.data?.quizzes || [];

  const attempts = attemptsQuery.data?.data || [];

  const studentTrack =
    localStorage.getItem("track") ||
    localStorage.getItem("studentTrack") ||
    "Frontend";

  const quizzes = allQuizzes.filter((quiz) => {
    const quizTrack = quiz.track?.toLowerCase();
    const myTrack = studentTrack.toLowerCase();

    return (
      quizTrack === myTrack ||
      quizTrack === "english" ||
      quizTrack === "iq" ||
      quizTrack === "general"
    );
  });

  const questions: Question[] =
    examQuery.data?.data?.questions ||
    examQuery.data?.questions ||
    examQuery.data?.data ||
    [];

  function getQuizId(quiz: Quiz) {
    return quiz.quizId || quiz._id || quiz.id;
  }

  function isQuizCompleted(quiz: Quiz) {
    const quizId = getQuizId(quiz);

    return attempts.some(
      (attempt: any) =>
        attempt.quiz?.toString() === quizId ||
        attempt.quiz?._id?.toString() === quizId
    );
  }

  function getQuestionText(question: Question) {
    return (
      question.question ||
      question.questionText ||
      question.title ||
      question.text ||
      question.content ||
      question.body ||
      question.name ||
      "Question"
    );
  }

  function getAnswerText(answer: Answer) {
    return (
      answer.text ||
      answer.answerText ||
      answer.title ||
      answer.option ||
      answer.content ||
      "Answer"
    );
  }

  function handleStartClick(quiz: Quiz) {
    if (isQuizCompleted(quiz)) return;

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

  function startExamNow() {
    if (!rulesQuiz) return;

    const quizId = getQuizId(rulesQuiz);

    if (!quizId) {
      alert("Quiz ID not found");
      return;
    }

    localStorage.setItem("currentQuizId", quizId);
    sessionStorage.setItem("currentQuizId", quizId);

    setSelectedQuizTitle(rulesQuiz.title || "Exam");
    setAnswers([]);
    setResult(null);
    setRulesQuiz(null);
    setStartedQuizId(quizId);
  }

  function handleSelectAnswer(questionId: string, answerId: string) {
    setAnswers((prev) => {
      const exists = prev.find((item) => item.questionId === questionId);

      if (exists) {
        return prev.map((item) =>
          item.questionId === questionId ? { questionId, answerId } : item
        );
      }

      return [...prev, { questionId, answerId }];
    });
  }

  function getSelectedAnswer(questionId: string) {
    return answers.find((item) => item.questionId === questionId)?.answerId;
  }

  function getScoreFromResponse() {
    const score =
      result?.totalScore ??
      result?.data?.totalScore ??
      result?.data?.score ??
      result?.score ??
      0;

    const total =
      result?.totalQuestions ??
      result?.data?.totalQuestions ??
      questions.length;

    const correct =
      result?.correctAnswers ??
      result?.data?.correctAnswers ??
      result?.answers?.filter((a: any) => a.isCorrect).length ??
      result?.data?.answers?.filter((a: any) => a.isCorrect).length ??
      0;

    return { score, correct, total };
  }

  function handleSubmitExam() {
    if (!startedQuizId) return;

    if (answers.length !== questions.length) {
      alert("Please answer all questions before submitting");
      return;
    }

    submitMutation.mutate({
      quizId: startedQuizId,
      answers,
    });
  }

  function backToExams() {
    setStartedQuizId(null);
    setAnswers([]);
    setResult(null);
  }

  if (quizzesQuery.isLoading || attemptsQuery.isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (quizzesQuery.isError || attemptsQuery.isError) {
    return <div className="p-8 text-red-500">Error Loading Exams</div>;
  }

  if (startedQuizId) {
    if (examQuery.isLoading) return <div className="p-8">Loading Exam...</div>;

    if (examQuery.isError) {
      return (
        <div className="min-h-screen bg-[#f7f7fb] p-8">
          <div className="rounded-xl bg-red-100 p-4 text-red-700">
            Error Loading Exam
          </div>
        </div>
      );
    }

    if (!questions.length) {
      return (
        <div className="min-h-screen bg-[#f7f7fb] p-8">
          <div className="rounded-xl bg-yellow-50 p-4 text-yellow-800">
            No questions found for this exam
          </div>
        </div>
      );
    }

    if (result) {
      const finalScore = getScoreFromResponse();

      return (
        <div className="min-h-screen bg-[#f7f7fb] p-8">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Exam Result
          </h1>

          <div className="mb-6 rounded-2xl border border-[#dddaf3] bg-white p-6 text-center shadow-sm">
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              {selectedQuizTitle}
            </h2>

            <p className="mb-4 text-[#6f6d99]">Your score is</p>

            <div className="mb-3 text-6xl font-bold text-[#5a4cc7]">
              {finalScore.score}
            </div>

            <p className="text-sm text-gray-500">
              Correct Answers: {finalScore.correct} / {finalScore.total}
            </p>
          </div>

          <button
            onClick={backToExams}
            className="rounded-xl bg-[#5a4cc7] px-8 py-3 font-semibold text-white hover:bg-[#4b3fba]"
          >
            Back To Assessments
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f7f7fb] p-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Assessment Questions
        </h1>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const options = question.answers || question.options || [];

            return (
              <div
                key={question._id}
                className="rounded-2xl border border-[#dddaf3] bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  {index + 1}. {getQuestionText(question)}
                </h2>

                <div className="space-y-3">
                  {options.map((answer) => {
                    const checked = answers.some(
                      (item) =>
                        item.questionId === question._id &&
                        item.answerId === answer._id
                    );

                    return (
                      <label
                        key={answer._id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                          checked
                            ? "border-[#5a4cc7] bg-indigo-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question._id}
                          checked={checked}
                          onChange={() =>
                            handleSelectAnswer(question._id, answer._id)
                          }
                        />

                        <span>{getAnswerText(answer)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmitExam}
          disabled={submitMutation.isPending}
          className="mt-8 rounded-xl bg-[#5a4cc7] px-8 py-3 font-semibold text-white hover:bg-[#4b3fba] disabled:opacity-50"
        >
          {submitMutation.isPending ? "Submitting..." : "Submit Exam"}
        </button>

        {submitMutation.isError && (
          <div className="mt-4 rounded-xl bg-red-100 p-4 text-red-700">
            {(submitMutation.error as any)?.response?.data?.message ||
              "Failed to submit exam"}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Assessments</h1>

      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#dddaf3] bg-[#f0effb] p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dedbf7] text-[#5a4cc7]">
          <Award size={26} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">Available Exams</h2>
          <p className="text-[#6f6d99]">
            Read the rules carefully before starting your attempt.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {quizzes.length === 0 ? (
          <div className="rounded-2xl border border-[#dddaf3] bg-white p-8 text-center text-gray-500 shadow-sm">
            No active exams available
          </div>
        ) : (
          quizzes.map((quiz, index) => {
            const completed = isQuizCompleted(quiz);

            return (
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
                      {quiz.title?.toLowerCase().includes("english")
                        ? "English"
                        : quiz.title?.toLowerCase().includes("iq")
                        ? "IQ"
                        : quiz.track || "General"}
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
                  disabled={completed}
                  onClick={() => handleStartClick(quiz)}
                  className={`rounded-xl px-6 py-3 font-semibold text-white ${
                    completed
                      ? "cursor-not-allowed bg-green-500"
                      : "bg-[#5a4cc7] hover:bg-[#4b3fba]"
                  }`}
                >
                  {completed
                    ? "Completed ✓"
                    : isSEB
                    ? "Start Attempt"
                    : "Start Exam"}
                </button>
              </div>
            );
          })
        )}
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
              Please open the exam using Safe Exam Browser.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  localStorage.setItem("currentQuizId", safeModalQuizId);
                  sessionStorage.setItem("currentQuizId", safeModalQuizId);
                  window.open(
                    `${window.location.origin}/bridgeup.seb`,
                    "_blank"
                  );
                }}
                className="rounded-xl bg-[#5a4cc7] px-5 py-3 font-semibold text-white hover:bg-[#4b3fba]"
              >
                Open Safe Exam Browser Config
              </button>

              <button
                onClick={() =>
                  window.open(
                    "https://safeexambrowser.org/download_en.html",
                    "_blank"
                  )
                }
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