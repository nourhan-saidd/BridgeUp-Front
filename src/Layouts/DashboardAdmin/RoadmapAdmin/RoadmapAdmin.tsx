import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import {  useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

export default function RoadmapAdmin() {

const {token}=useContext(authContext)
const [track , settrack]=useState("")
const [open, setOpen] = useState(false);
const [isEdit, setIsEdit] = useState(false);
const [selectedId, setSelectedId] = useState(null);
const queryClient = useQueryClient();





// add roadmap name
 async function addRoadmap(){
  try{
const res = await axiosinstance.post(`api/v1/roadmaps/create-roadmap` , 
  {track:track} , 
  {
  headers:{Authorization:`Bearer ${token}`}
})
toast.success('added successfully')
setOpen(false);
    settrack("");
    queryClient.invalidateQueries({ queryKey: ["all roadmaps"] });
console.log(res.data)
  }catch(error){
console.log(error)
  }
}



// get all roadmaps name
async function getRoadmap(){
try{
   const res= await axiosinstance.get(`api/v1/roadmaps` , {
    headers:{Authorization:`Bearer ${token}`}
  })
  return res.data ;
  
}catch(error){
  console.log(error)
}
}



const {data , isLoading , isError}=useQuery({
  queryKey:['all roadmaps'], 
  queryFn:getRoadmap
})

const alldata = data?.data
console.log(alldata)


if (isError) 
  return <h1>error happens ..... </h1>

if(isLoading)
  return <BeatLoader/>


//deleteoneroadmap
async function deleteOne(id:any){
  try{
await axiosinstance.delete(`/api/v1/roadmaps/${id}` , {
  headers:{Authorization: `Bearer ${token}`}
 })
 toast.success('deleted successfully')
queryClient.invalidateQueries({queryKey:["all roadmaps"]})
  }catch(error){
    console.log(error)
  }
}



//update roadmap name

async function updateroadmap(){
  try{
       const res= await axiosinstance.put(`api/v1/roadmaps/${selectedId}` ,
         {track:track} , 
        {headers:{Authorization: `Bearer ${token}`}}
        )
         toast.success('updated successfully')
          queryClient.invalidateQueries({queryKey:['all roadmaps']})
          setOpen(false)
          settrack('')

  }catch(error){
    console.log(error)
  }
}


  return (
    <div className="min-h-screen bg-[#f3f0ff] p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-5">

        <div className="flex justify-center gap-5 items-center">
          
          <h1 className="text-center font-bold text-5xl py-2 rounded-md">
            Road Map
          </h1>

          {/* Popup Trigger */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="rounded-3xl p-4 border bg-[#5b4b8a] text-white font-bold cursor-pointer hover:bg-[#f3f0ff] hover:text-black hover:border-[#5b4b8a]">
                Add Roadmap
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
             <DialogTitle className="text-center text-3xl font-bold">
                   {isEdit ? "Update Roadmap" : "Add Roadmap"}
              </DialogTitle>
              </DialogHeader>

              {/* content */}
              <div className="mt-4  p-5 flex gap-3">
                <label htmlFor="addRoadmap" className="font-bold">Roadmap Name</label>
               <input
               value={track}
               onChange={(e) => settrack(e.target.value)}
                id="addRoadmap" 
                type="text"
                 placeholder="Add your roadmap name ..." 
                 className="p-2"/>
              </div>
          <button
                    onClick={isEdit ? updateroadmap: addRoadmap}
                    className="border p-2 bg-[#5b4b8a] text-white cursor-pointer rounded-3xl"
                    > {isEdit ? "Update" : "Add"}
</button>
            </DialogContent>
          </Dialog>

        </div>





        
      { alldata.map((map:any)=>  
   <div className="bg-white w-full mt-5  rounded-2xl shadow-2xl p-6 flex justify-between">
      
         <h2 className="text-4xl font-bold text-center text-[#5b4b8a] drop-shadow-md">
            {map.track}
          </h2>
          <div className="flex gap-4">

            <button 
            onClick={()=>{deleteOne(map._id)}}
            className="border rounded-xl p-2 bg-red-600 border-black font-bold cursor-pointer hover:bg-red-400">delete
            </button>



          <button 
      onClick={() => {
         setOpen(true);
        setIsEdit(true);
        settrack(map.track);
         setSelectedId(map._id);
       }}   
          className="border rounded-xl p-2 bg-yellow-400 border-black font-bold cursor-pointer hover:bg-yellow-200">update
          </button>
                   <Link to={`/dashboardadmin/roadmapdetails/${map._id}`}>
 
 
          <button
          className="border rounded-xl p-2 bg-blue-400 border-black font-bold cursor-pointer hover:bg-blue-200">show
          </button>
                   </Link>

          </div>
          
        </div>
      
    
      
      
      
      ) }
     


      </div>
    </div>
  );
}