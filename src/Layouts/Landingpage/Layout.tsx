
import NavBar from '../../Components/Navbar/NavBar'
import Footer from '../../Components/Footer/Footer'
import { Outlet } from 'react-router-dom'


export default function Layout() {

const LinksnavBar=[
  {
  label:'Home',
  path:'/home'
},
{
  label:'About',
  path:'/about'
},
{
  label:'Contact',
  path:'/contact'
},

{
   label:' How It Works',
  path:'/howitwork'
}
]

  return (
    <>
   <div className=' flex flex-col min-h-screen'>
      <NavBar linksnavbar={LinksnavBar}/>
   <div className='flex-1'>
       <Outlet/>
   </div>
     <Footer/>
   </div>
    </>
  )
}
