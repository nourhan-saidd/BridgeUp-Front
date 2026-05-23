import { createContext, useState } from "react"
export const authContext =  createContext<any>(null);
export default function AuthContextProvider({children} : any) {

const[token,setToken]=useState(()=>{return localStorage.getItem('token')})
const[role,setRole]=useState(()=>{return localStorage.getItem('role')})

// update value of token from local storage
function getUpdateToken(token:string){
    setToken(token)
}



//set role to route in dashboard
function GetSetRole(role:any){
    setRole(role)
}


//remove value of token from local storage
function getRemoveLogin(){
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null)
    setRole(null)

}


  return (
    <>
    <authContext.Provider value={{token,role,getUpdateToken,getRemoveLogin,GetSetRole}}>
{children}
    </authContext.Provider>
      
    </>
  )
}
