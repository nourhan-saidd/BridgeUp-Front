import axiosinstance from '@/Context/BaseUrl/AxiosInstance'
import MessageTable from '../MessageTable/MessageTable'
import { useContext } from 'react'
import { authContext } from '@/Context/AuthContext/AuthContextProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BeatLoader } from 'react-spinners'

export default function TodaySupportMessage() {
const{token}= useContext(authContext)
const queryclient =useQueryClient()

async function getTodayMessages(){
    const res =await axiosinstance.get(`api/v1/contactUs/today` , {
        headers : {  Authorization: `Bearer ${token}`}
       },
    )

    return res.data
}


const {data , isLoading , isError}=useQuery({
    queryKey:['today messages'],
    queryFn:getTodayMessages,
})


const todayMessages =data?.data;

if(isLoading) return <BeatLoader />

if(isError) return <h1>error occured ... </h1>

async function deleteAllMessages(){
await axiosinstance.delete(`api/v1/contactUs`,
    {
        headers:{Authorization:`Bearer ${token}`}
    }
)
queryclient.invalidateQueries({
    queryKey: ["today messages"],
})
}


  return (
    <>
                   <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all mb-5"
                   onClick={deleteAllMessages}
                   >
                       Delete All 
                    </button>

                      
      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
      <MessageTable dataContact={todayMessages}/>
        </div>
      </div>

    </>
  )
}
