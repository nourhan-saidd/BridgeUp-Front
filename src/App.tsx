import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layouts/Landingpage/Layout";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import HowItWork from "./Pages/HowItWork/HowItWork";
import Contact from "./Pages/Contact/Contact";
import Register from "./Auth/Register/Register";
import Login from "./Auth/Login/Login";
import RegisterGraduate from "./Auth/RegisterGraduate/RegisterGraduate";
import RegisterCompany from "./Auth/RegisterCompany/RegisterCompany";
import ForgetPassword from "./Auth/ForgetPassword/ForgetPassword";
import VerifyCode from "./Auth/VerifyCode/VerifyCode";
import ResetPassword from "./Auth/ResetPassword/ResetPassword";
import SuccessResetPassword from "./Auth/SuccessResetPassword/SuccessResetPassword";
import DashboardAdmin from "./Layouts/DashboardAdmin/DashboardAdmin";
import ReportsAdmin from "./Layouts/DashboardAdmin/ReportsAdmin/ReportsAdmin";
import RoadmapAdmin from "./Layouts/DashboardAdmin/RoadmapAdmin/RoadmapAdmin";
import SupportMessageAdmin from "./Layouts/DashboardAdmin/SupportMessageAdmin/SupportMessageAdmin";
import DashboardCompany from "./Layouts/DashboardCompany/DashboardCompany";
import BrowseGraduates from "./Layouts/DashboardCompany/BrowseGraduates/BrowseGraduates";
import CompanyProfile from "./Layouts/DashboardCompany/CompanyProfile/CompanyProfile";
import Notifications from "./Layouts/DashboardCompany/Notifications/Notifications";
import SendRequests from "./Layouts/DashboardCompany/SendRequests/SendRequests";
import ShortListed from "./Layouts/DashboardCompany/ShortListed/ShortListed";
import DashboardGraduate from "./Layouts/DashboardGraduate/DashboardGraduate";
import ProfilePageGraduate from "./Layouts/DashboardGraduate/ProfilePageGraduate/ProfilePageGraduate";
import RoadmapPageGraduate from "./Layouts/DashboardGraduate/RoadmapPageGraduate/RoadmapPageGraduate";
import AssessmentsPageGraduate from "./Layouts/DashboardGraduate/AssessmentsPageGraduate/AssessmentsPageGraduate";
import ScorePageGraduate from "./Layouts/DashboardGraduate/ScorePageGraduate/ScorePageGraduate";
import JobofferPageGraduate from "./Layouts/DashboardGraduate/JobofferPageGraduate/JobofferPageGraduate";
import NotificationPageGraduate from "./Layouts/DashboardGraduate/NotificationPageGraduate/NotificationPageGraduate";
import { Toaster } from 'sonner';
import AuthContextProvider from "./Context/AuthContext/AuthContextProvider";
import ProtectRoutes from "./Auth/ProtectRoutes/ProtectRoutes";
import CompaniesAdmin from "./Layouts/DashboardAdmin/CompaniesAdmin/CompaniesAdmin";
import AssessmentsAdmin from "./Layouts/DashboardAdmin/AssessmentsAmin/AssessmentsAdmin";
import GraduatesAdmin from "./Layouts/DashboardAdmin/GraduatesAdmin/GraduatesAdmin";
import OverViewAdmin from "./Layouts/DashboardAdmin/OverViewAdmin/OverViewAdmin";
import TotalSupportMessage from "./Layouts/DashboardAdmin/TotalSupportMessage/TotalSupportMessage";
import TodaySupportMessage from "./Layouts/DashboardAdmin/TodaySupportMessage/TodaySupportMessage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RoadmapDetails from "./Layouts/DashboardAdmin/RoadmapDetails/RoadmapDetails";
import PhasesDetails from "./Layouts/PhasesDetails/PhasesDetails";
import QuestionsDetails from "./Layouts/DashboardAdmin/QuestionsDetails/QuestionsDetails";
import PendingCompany from "./Layouts/DashboardAdmin/PendingCompany/PendingCompany";
import AllCompanies from "./Layouts/DashboardAdmin/AllCompanies/AllCompanies";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "howitwork", element: <HowItWork /> },
      { path: "contact", element: <Contact /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "registergraduate", element: <RegisterGraduate /> },
      { path: "registerCompany", element: <RegisterCompany /> },
      { path: "forgetpassword", element: <ForgetPassword /> },
      { path: "verifycode", element: <VerifyCode /> },
      { path: "resetpassword", element: <ResetPassword /> },
      { path: "successresetpassword", element: <SuccessResetPassword /> },
    ],
  },
  {
    path: "/dashboardadmin",
    element:  <ProtectRoutes allowedRoles={["admin"]}> <DashboardAdmin /> </ProtectRoutes>,
    children: [
      { index:true, element: <OverViewAdmin /> },
      { path:"overview", element: <OverViewAdmin/> },
      { path: "assessments", element: <AssessmentsAdmin/> },
      { path: "companies", element: <CompaniesAdmin/> , children:[
        {index:true, element:<AllCompanies/>},
        {path:'allcompanies' , element:<AllCompanies/>},
        {path:'pendingcompanies' , element:<PendingCompany/>}
      ]},
      { path: "graduates", element: <GraduatesAdmin/> },
      { path: "reports", element: <ReportsAdmin /> },
      { path: "roadmap", element: <RoadmapAdmin /> },
      { path: "supportmessage", element: <SupportMessageAdmin /> , children:[
        {index:true , element: <TotalSupportMessage/> },
        {path:'total' , element: <TotalSupportMessage/> },
        {path:'today' , element:<TodaySupportMessage/>}
      ] },{
        path:'roadmapdetails/:id' , element:<RoadmapDetails/>
      },{
        path:'phasesdetails/:id' , element:<PhasesDetails/>
      },
      {path:'questionsdetails/:id' , element:<QuestionsDetails/>}
      
      
      ,
    
    ],
  },
  {
    path:'/dashboardCompany' , 
     element:   <ProtectRoutes allowedRoles={["company"]}> <DashboardCompany/> </ProtectRoutes>, children:[
      {index:true , element:<CompanyProfile/>},
      {path:"companyprofile" , element:<CompanyProfile/>},
      {path:"browsegraduate" , element:<BrowseGraduates/>},
      {path:"notifications" , element:<Notifications/>},
      {path:"sendrequests" , element:<SendRequests/>},
      {path:"shortlisted" , element:<ShortListed/>},
    ]
  }
  ,
  {
    path:'dashboardgraduate' , element:  <ProtectRoutes allowedRoles={["graduate"]}>  <DashboardGraduate/> </ProtectRoutes>, children:[
      {index:true, element:<ProfilePageGraduate/>},
      {path:'profilepagegraduate' , element:<ProfilePageGraduate/>},
      {path:'roadmappagegraduate' , element:<RoadmapPageGraduate/>},
      {path:'assessmentspagegraduate' , element:<AssessmentsPageGraduate/>},
      {path:'scorepagegraduate' , element:<ScorePageGraduate/>},
      {path:'jobofferpagegraduate' , element:<JobofferPageGraduate/>},
      {path:'notificationspagegraduate' , element:<NotificationPageGraduate/>},
      
    ]
  }
]);

const queryclient=new QueryClient();


function App() {
  return (
    <>
    
<QueryClientProvider client={queryclient}>
<AuthContextProvider>
               <Toaster position="bottom-right" richColors/>
        <RouterProvider router={router} />
</AuthContextProvider>
</QueryClientProvider>

    </>
  );
}

export default App;
