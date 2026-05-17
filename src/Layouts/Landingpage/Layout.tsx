import React from 'react'
import NavBar from '../../Components/Navbar/NavBar'
import Footer from '../../Components/Footer/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
   <div className=' flex flex-col min-h-screen'>
      <NavBar/>
   <div className='flex-1'>
       <Outlet/>
   </div>
     <Footer/>
   </div>
    </>
  )
}
