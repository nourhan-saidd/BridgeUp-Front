import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layouts/Landingpage/Layout'
import Home from './Pages/Home/Home'
import About from './Pages/About/About'
import HowItWork from './Pages/HowItWork/HowItWork'
import Contact from './Pages/Contact/Contact'
import Register from './Auth/Register/Register'
import Login from './Auth/Login/Login'
import RegisterGraduate from './Auth/RegisterGraduate/RegisterGraduate'
import RegisterCompany from './Auth/RegisterCompany/RegisterCompany'
import ForgetPassword from './Auth/ForgetPassword/ForgetPassword'
import VerifyCode from './Auth/VerifyCode/VerifyCode'
import ResetPassword from './Auth/ResetPassword/ResetPassword'
import SuccessResetPassword from './Auth/SuccessResetPassword/SuccessResetPassword'
import DashboardAdmin from './Layouts/DashboardAdmin/DashboardAdmin'

function App() {
const router=createBrowserRouter([
    {path:'/' , element:<Layout/> , children:[
    {index:true,element:<Home/>},
    {path:'home' , element:<Home/>},
    {path:'about' , element:<About/>},
    {path:'howitwork', element:<HowItWork/>},
    {path:'contact' , element:<Contact/>} , 
    {path:'register' , element:<Register/>},
    {path:'login' , element :<Login/>} ,
    {path:'registergraduate' , element:<RegisterGraduate/>},
    {path:'registerCompany' , element:<RegisterCompany/>},
    {path:'forgetpassword' , element:<ForgetPassword/>},
    {path:'verifycode' , element:<VerifyCode/>},
    {path:'resetpassword' , element:<ResetPassword/>},
    {path:'successresetpassword' , element:<SuccessResetPassword/>}
  ]},
  {path:'dashboardadmin' , element:<DashboardAdmin/>}
])

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
