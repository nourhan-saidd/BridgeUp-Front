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
import { Link, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

export default function RoadmapDetails() {
  const { id } = useParams();
  const queryclinet = useQueryClient();
  const [phase, setphase] = useState("");
  const { token } = useContext(authContext);
  const [open, setopen] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  // get all phases by id
  async function getAllPhases() {
    try {
      const res = await axiosinstance.get(`api/v1/phases/${id}/phases`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["phases", id],
    queryFn: getAllPhases,
  });

  if (isLoading) return <BeatLoader />;
  if (isError) return <h1> .... error occures</h1>;

  const alldata = data?.data;

  // add phases
  async function addphase() {
    try {
      await axiosinstance.post(
        `api/v1/phases/${id}`,
        { title: phase },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("added phases successfully");
      setphase("");
      setopen(false);

      queryclinet.invalidateQueries({ queryKey: ["phases", id] });
    } catch (error) {
      console.log(error);
    }
  }

  // delete phase
  async function deletePhase(delId: any) {
    try {
      await axiosinstance.delete(`api/v1/phases/${delId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      queryclinet.invalidateQueries({ queryKey: ["phases", id] });
    } catch (error) {
      console.log(error);
    }
  }

  // update phase
  async function updatePhase() {
    try {
      await axiosinstance.put(
        `api/v1/phases/${selectedId}`,
        { title: phase },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("updated successfully");

      setphase("");
      setopen(false);
      setisEdit(false);
      setSelectedId("");

      queryclinet.invalidateQueries({ queryKey: ["phases", id] });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#f3f0ff] p-6 overflow-x-hidden">
        <div className="flex justify-center mb-5">
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setopen(val);
              if (!val) {
                setisEdit(false);
                setphase("");
                setSelectedId("");
              }
            }}
          >
            <DialogTrigger asChild>
              <button className="rounded-3xl p-4 border bg-[#5b4b8a] text-white font-bold cursor-pointer hover:bg-[#f3f0ff] hover:text-black hover:border-[#5b4b8a]">
                {isEdit ? " edit Phases " : " Add Phases "}
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center text-3xl font-bold">
                  Add phase name
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 p-5 flex gap-3">
                <label htmlFor="addRoadmap" className="font-bold">
                  phase Name
                </label>
                <input
                  value={phase}
                  onChange={(e) => setphase(e.target.value)}
                  id="addRoadmap"
                  type="text"
                  placeholder="Add your roadmap name ..."
                  className="p-2"
                />
              </div>

              <button
                onClick={isEdit ? updatePhase : addphase}
                className="border p-2 bg-[#5b4b8a] text-white cursor-pointer rounded-3xl"
              >
                {isEdit ? 'edit' :'add'}
              </button>
            </DialogContent>
          </Dialog>
        </div>

        {alldata?.map((phase: any) => (
          <div
            key={phase._id}
            className="bg-white w-full mt-5 rounded-2xl shadow-2xl p-6 flex"
          >
            <div className="bg-[#5b4b8a] text-white w-full mt-5 rounded-2xl shadow-2xl p-6 flex justify-between w-full">
              <p className="text-3xl font-bold">{phase.title}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setisEdit(true);
  setphase(phase.title);
  setSelectedId(phase._id);
  setopen(true);
                  }}
                  className="border rounded-xl p-2 bg-yellow-400 border-black font-bold cursor-pointer hover:bg-yellow-200"
                >
                  update
                </button>

                <button
                  onClick={() => deletePhase(phase._id)}
                  className="border rounded-xl p-2 bg-red-600 border-black font-bold cursor-pointer hover:bg-red-400"
                >
                  delete
                </button>


                
     <Link to={`/dashboardadmin/phasesdetails/${phase._id}`}>
             <button
          className="border rounded-xl p-2 bg-blue-400 border-black font-bold cursor-pointer hover:bg-blue-200">show
          </button>
     </Link>


              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}