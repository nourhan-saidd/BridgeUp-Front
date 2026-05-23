import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectRoutes({ children , allowedRoles}: any) {
  const { role, token } = useContext(authContext);

  if (!token ) {
    return <Navigate to="/login" replace />;
  }

if(allowedRoles && !allowedRoles.includes(role)){
     return <Navigate to="/" replace />;
}

  return (
    <>
    {children}
        </>
  )
}