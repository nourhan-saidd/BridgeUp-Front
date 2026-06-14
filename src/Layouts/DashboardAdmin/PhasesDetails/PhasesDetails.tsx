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
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

export default function PhasesDetails() {
  const { id } = useParams();
  const queryclient = useQueryClient();

  const [resourcetitle, setresourcetitle] = useState("");
  const [resourceurl, setresourceurl] = useState("");
  const [resourcetype, setresourcetype] = useState("");

  const [open, setopen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const { token } = useContext(authContext);


  //add resource
  async function addresource() {
    try {
      await axiosinstance.post(
        `api/v1/resources/${id}`,
        {
          title: resourcetitle,
          url: resourceurl,
          type: resourcetype,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("added successfully");

      setresourcetitle("");
      setresourceurl("");
      setresourcetype("");
      setopen(false);

      queryclient.invalidateQueries({ queryKey: ["all resources"] });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  }



  //get all resources
  async function getallresources() {
    try {
      const res = await axiosinstance.get(
        `api/v1/resources/phase/${id}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all resources", id],
    queryFn: getallresources,
  });

  if (isLoading) return <BeatLoader />;
  if (isError) return <h1>error occurred</h1>;

  const alldata = data?.data;


  //delete 
  async function deleteResource(delId: string) {
    try {
      await axiosinstance.delete(`api/v1/resources/${delId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("deleted successfully");

      queryclient.invalidateQueries({ queryKey: ["all resources", id] });
    } catch (error) {
      console.log(error);
    }
  }


  //update
  async function updateResource() {
    try {
      await axiosinstance.put(
        `api/v1/resources/${selectedId}`,
        {
          title: resourcetitle,
          url: resourceurl,
          type: resourcetype,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("updated successfully");

      setresourcetitle("");
      setresourceurl("");
      setresourcetype("");
      setopen(false);
      setIsEdit(false);
      setSelectedId("");

      queryclient.invalidateQueries({ queryKey: ["all resources", id] });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f0ff] p-6 overflow-x-hidden">

      <div className="flex justify-center mb-5">
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setopen(val);
            if (!val) {
              setIsEdit(false);
              setresourcetitle("");
              setresourceurl("");
              setresourcetype("");
              setSelectedId("");
            }
          }}
        >
          <DialogTrigger asChild>
            <button className="rounded-3xl p-4 border bg-[#5b4b8a] text-white font-bold">
              {isEdit ? "Edit Resource" : "Add Resource"}
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-3xl font-bold">
                {isEdit ? "Edit Resource" : "Add Resource"}
              </DialogTitle>
            </DialogHeader>

            <input
              value={resourcetitle}
              onChange={(e) => setresourcetitle(e.target.value)}
              placeholder="Title"
              className="p-2 border w-full mt-3"
            />

            <input
              value={resourceurl}
              onChange={(e) => setresourceurl(e.target.value)}
              placeholder="URL"
              className="p-2 border w-full mt-3"
            />

            <select
              value={resourcetype}
              onChange={(e) => setresourcetype(e.target.value)}
              className="p-2 border w-full mt-3"
            >
              <option value="">Select type</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="article">Article</option>
            </select>

            <button
              onClick={isEdit ? updateResource : addresource}
              className="mt-4 p-2 bg-[#5b4b8a] text-white rounded-2xl"
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </DialogContent>
        </Dialog>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {alldata?.map((item: any) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-2xl p-5 border"
          >
            <h2 className="text-xl font-bold text-[#5b4b8a]">
              {item.title}
            </h2>

            <p className="text-gray-600 break-words mt-2">
              {item.url}
            </p>

            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-gray-100">
              {item.type}
            </span>

            <div className="flex gap-3 mt-4">

             
              <button
                onClick={() => {
                  setIsEdit(true);
                  setresourcetitle(item.title);
                  setresourceurl(item.url);
                  setresourcetype(item.type);
                  setSelectedId(item._id);
                  setopen(true);
                }}
                className="px-3 py-1 bg-yellow-400 rounded-lg font-bold"
              >
                edit
              </button>

           
              <button
                onClick={() => deleteResource(item._id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold"
              >
                delete
              </button>

              <a
                href={item.url}
                target="_blank"
                className="px-3 py-1 bg-blue-400 rounded-lg font-bold"
              >
                open
              </a>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}