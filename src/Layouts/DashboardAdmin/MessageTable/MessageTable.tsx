import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { useContext } from "react";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";

export default function MessageTable({ dataContact }: any) {
  const queryClient = useQueryClient();
  const {token}=useContext(authContext)

  async function deleteOne(id: string) {
    await axiosinstance.delete(`api/v1/contactUs/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    console.log("deleted success");
    //  refresh data after delete
 queryClient.invalidateQueries({ queryKey: ["all messages"] });
queryClient.invalidateQueries({ queryKey: ["today messages"] });
  queryClient.invalidateQueries({queryKey: ["count messages"],
  });

  }




  return (
    <table className="w-full">
      {/* HEAD */}
      <thead className="bg-[#5b4b8a] text-white">
        <tr>
          <th className="px-6 py-4 font-semibold">First Name</th>
          <th className="px-6 py-4 font-semibold">Last Name</th>
          <th className="px-6 py-4 font-semibold">Email</th>
          <th className="px-6 py-4 font-semibold">Message Preview</th>
          <th className="px-6 py-4 font-semibold">Date</th>
          <th className="px-6 py-4 font-semibold">Action</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody className="text-center align-middle w-full">
        {dataContact?.map((data: any) => (
          <tr
            key={data._id}
            className="border-b border-[#ece8f8] hover:bg-[#f7f4ff] transition-all"
          >
            <td className="px-6 py-5 font-medium text-[#2d2555]">
              {data.firstName}
            </td>

            <td className="px-6 py-5 text-[#5f5a7a]">
              {data.lastName}
            </td>

            <td className="px-6 py-5 text-[#5f5a7a]">
              {data.email}
            </td>

           <td className="px-6 py-5 text-[#5f5a7a] max-w-xs truncate">
           {data.message}
            </td>

            <td className="px-6 py-5 text-[#5f5a7a]">
              {new Date(data.createdAt).toLocaleDateString("en-GB")}
            </td>

            {/* ACTIONS */}
            <td className="px-6 py-5">
              <div className="flex justify-center gap-3">

             <Dialog>
  <DialogTrigger asChild>
    <button className="bg-[#5b4b8a] hover:bg-[#493a74] text-white px-4 py-2 rounded-xl">
      View
    </button>
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle className="text-center font-bold text-3xl">Message Details</DialogTitle>
    </DialogHeader>

    <div className="text-center">
      {data.message}
    </div>
  </DialogContent>
</Dialog>

                <button
                  onClick={() => deleteOne(data._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all"
                >
                  Delete
                </button>

              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}