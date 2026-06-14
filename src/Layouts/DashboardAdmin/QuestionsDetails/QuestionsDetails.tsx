import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

export default function QuestionsDetails() {
  const { id } = useParams();
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);

  // ================= GET QUESTIONS =================

  async function getQuestions() {
    try {
      const res = await axiosinstance.get(`/api/v1/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz questions", id],
    queryFn: getQuestions,
    enabled: !!token,
  });

  // ================= UPLOAD CSV =================

  async function uploadCsv() {
    if (!file) {
      toast.error("please choose csv file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosinstance.post(
        `/api/v1/questions/upload/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const { mutate: uploadMutate, isPending: isUploading } = useMutation({
    mutationFn: uploadCsv,

    onSuccess: () => {
      toast.success("questions uploaded successfully");

      queryClient.invalidateQueries({
        queryKey: ["quiz questions", id],
      });

      setFile(null);
    },

    onError: () => {
      toast.error("upload failed");
    },
  });

  // ================= DELETE =================

  async function deleteQuiz() {
    try {
      const res = await axiosinstance.delete(
        `api/v1/questions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteQuiz,

    onSuccess: () => {
      toast.success("Deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["quiz questions", id],
      });
    },

    onError: () => {
      toast.error("Delete failed");
    },
  });

  const allQuestions = data?.data;

  if (isLoading) return <BeatLoader />;

  if (isError) return <h1>Error Happens ....</h1>;

  return (
    <div className="min-h-screen bg-[#f3f0ff] p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-5">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-5xl py-2 rounded-md">
            Questions
          </h1>

          <button
            onClick={() => deleteMutate()}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-2xl transition"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* UPLOAD SECTION */}
        <div className="bg-white mt-8 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-5 text-[#5b4b8a]">
            Upload CSV File
          </h2>

          <div className="flex gap-4 items-center">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />

            <button
              onClick={() => uploadMutate()}
              disabled={isUploading}
              className="border p-2 bg-[#5b4b8a] text-white rounded-3xl cursor-pointer"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* QUESTIONS */}
        {allQuestions?.map((question: any) => (
          <div
            key={question._id}
            className="bg-white w-full mt-5 rounded-2xl shadow-2xl p-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#5b4b8a]">
                {question.text}
              </h2>

              <span className="font-bold">
                Grade : {question.grade}
              </span>
            </div>

            <div className="mt-5">
              {question.answers.map((answer: any) => (
                <div
                  key={answer._id}
                  className="border p-3 rounded-xl mt-2"
                >
                  {answer.text}
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}