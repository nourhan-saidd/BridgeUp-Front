import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function AssessmentsAdmin() {
  const { token } = useContext(authContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [track, setTrack] = useState("");

  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const queryClient = useQueryClient();

  // ================= RESET FORM =================
  function resetForm() {
    setTitle("");
    setDescription("");
    setDuration("");
    setNumberOfQuestions("");
    setTrack("");
  }

  // ================= ADD QUIZ =================
  async function addQuiz() {
    try {
      await axiosinstance.post(
        `api/v1/quizzes`,
        {
          title,
          description,
          duration: Number(duration),
          numberOfQuestions: Number(numberOfQuestions),
          track,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Added successfully");

      setOpen(false);
      resetForm();

      queryClient.invalidateQueries({ queryKey: ["all quiz"] });
    } catch (error) {
      console.log(error);
      toast.error("Add failed");
    }
  }

  // ================= GET QUIZZES =================
  async function getQuiz() {
    try {
      const res = await axiosinstance.get(
        `api/v1/questions/grouped-questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all quiz"],
    queryFn: getQuiz,
  });

  const allData = data?.data;

  // ================= DELETE QUIZ =================
  async function deleteQuiz(id) {
    try {
      await axiosinstance.delete(`api/v1/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["all quiz"] });
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  }

  // ================= UPDATE QUIZ =================
  async function updateQuiz() {
    try {
      await axiosinstance.put(
        `api/v1/quizzes/${selectedQuiz._id}`,
        {
          title,
          description,
          duration: Number(duration),
          numberOfQuestions: Number(numberOfQuestions),
          track,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Updated successfully");

      setEditOpen(false);
      setSelectedQuiz(null);
      resetForm();

      queryClient.invalidateQueries({ queryKey: ["all quiz"] });
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  }

  if (isError) return <h1>Error happened .....</h1>;
  if (isLoading) return <BeatLoader />;

  return (
    <div className="min-h-screen bg-[#f3f0ff] p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-5">

        {/* ================= HEADER ================= */}
        <div className="flex justify-center gap-5 items-center">
          <h1 className="text-5xl font-bold">Assessments</h1>

          {/* ================= CREATE QUIZ ================= */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="rounded-3xl p-4 border bg-[#5b4b8a] text-white font-bold">
                Create Quiz
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center text-3xl font-bold">
                  Create Quiz
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 p-5 flex flex-col gap-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Quiz Title"
                  className="p-2 border"
                />

                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="p-2 border"
                />

                <input
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  placeholder="Track"
                  className="p-2 border"
                />

                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  type="number"
                  placeholder="Duration"
                  className="p-2 border"
                />

                <input
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                  type="number"
                  placeholder="Questions"
                  className="p-2 border"
                />
              </div>

              <button
                onClick={addQuiz}
                className="border p-2 bg-[#5b4b8a] text-white rounded-3xl"
              >
                Add
              </button>
            </DialogContent>
          </Dialog>
        </div>

        {/* ================= QUIZ LIST ================= */}
        {allData?.map((quiz: any) => (
          <div
            key={quiz.quiz._id}
            className="bg-white w-full mt-5 rounded-2xl shadow-2xl p-6 relative"
          >
            {/* ACTION BUTTONS */}
            <div className="absolute right-4 top-4 flex gap-2">

              {/* SHOW */}
              <Link
                to={`/dashboardadmin/questionsdetails/${quiz.quiz._id}`}
                className="border rounded-xl p-2 bg-violet-100 text-[#5b4b8a] border-black font-bold cursor-pointer hover:border-blue-500"
              >
                Show
              </Link>

              {/* EDIT */}
              <button
                onClick={() => {
                  setSelectedQuiz(quiz.quiz);

                  setTitle(quiz.quiz.title);
                  setDescription(quiz.quiz.description);
                  setDuration(quiz.quiz.duration);
                  setNumberOfQuestions(quiz.quiz.numberOfQuestions);
                  setTrack(quiz.quiz.track);

                  setEditOpen(true);
                }}
                className="border rounded-xl p-2 bg-violet-100 text-[#5b4b8a] border-black font-bold cursor-pointer hover:border-yellow-400"
              >
                Edit
              </button>

              {/* DELETE */}
              <button
                onClick={() => deleteQuiz(quiz.quiz._id)}
                className="border rounded-xl p-2 bg-violet-100 text-[#5b4b8a] border-black font-bold cursor-pointer hover:border-red-400"
              >
                Delete
              </button>
            </div>

            <h2 className="text-4xl font-bold text-center text-[#5b4b8a]">
              {quiz.quiz.title}
            </h2>

            <p className="mt-3 text-center">{quiz.quiz.description}</p>
            <p className="text-center">Track: {quiz.quiz.track}</p>
            <p className="text-center">Duration: {quiz.quiz.duration} min</p>
            <p className="text-center">
              Questions: {quiz.quiz.numberOfQuestions}
            </p>
          </div>
        ))}

        {/* ================= EDIT DIALOG ================= */}
        <Dialog
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);

            if (!open) {
              setSelectedQuiz(null);
              resetForm();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-3xl font-bold">
                Edit Quiz
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 p-5 flex flex-col gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border"
                placeholder="Title"
              />

              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 border"
                placeholder="Description"
              />

              <input
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="p-2 border"
                placeholder="Track"
              />

              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="p-2 border"
                type="number"
                placeholder="Duration"
              />

              <input
                value={numberOfQuestions}
                onChange={(e) =>
                  setNumberOfQuestions(e.target.value)
                }
                className="p-2 border"
                type="number"
                placeholder="Questions"
              />
            </div>

            <button
              onClick={updateQuiz}
 className="rounded-3xl p-4 border bg-[#5b4b8a] text-white font-bold"            >
              Update
            </button>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}