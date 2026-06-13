import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import {  useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function SupportMessageAdmin() {

const {token}=useContext(authContext)

async function getCountMessages(){
  const res =await axiosinstance.get(`api/v1/contact-us/stats`,
    {headers:{Authorization:`Bearer ${token}`}}
  )
  return res.data ;

}


const {data,isLoading , isError}=useQuery({
  queryKey:['count messages'],
  queryFn:getCountMessages,



})

const allData =data?.data
console.log(allData)

if(isLoading) return <BeatLoader />

if(isError) return <h1>error occured ... </h1>

  return (
    <div className="min-h-screen bg-[#f3f0ff] p-6 w-screen">
<div className="max-w-7xl mx-auto  p-5">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2d2555] text-center">
            Support Messages
          </h1>

          <p className="text-[#5b4b8a] mt-2 text-center">
            Manage and review all contact requests from users.
          </p>
        </div>








  
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <Link to="total">
            <div className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition">
              <h3 className="text-[#5f5a7a] text-sm">
                Total Messages
              </h3>

              <p className="text-4xl font-bold text-[#5b4b8a] mt-2">
            {data?.data?.totalMessages}
              </p>
            </div>
          </Link>

          <Link to="today">
            <div className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition">
              <h3 className="text-[#5f5a7a] text-sm">
                Today's Messages
              </h3>

              <p className="text-4xl font-bold text-[#5b4b8a] mt-2">
                 {data?.data?.todayMessages}
              </p>
            </div>
          </Link>

        </div>

















     <div className="text-center p-5">
         <Outlet />
     </div>

      </div>
    </div>
  );
}