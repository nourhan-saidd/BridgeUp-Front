
import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <>


<nav className="bg-white h-16 px-6 flex items-center justify-between shadow-xl">

   {/* logo */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
      Logo
    </div>

    <h1 className="text-2xl font-bold text-violet-900">
      BridgeUp
    </h1>
  </div>



  {/* Links */}
  <div className="w-1/3">
    <ul className="flex items-center justify-between font-medium text-violet-950">
      <li>
        <Link to="/home" className="hover:bg-violet-300 px-3 py-1 rounded-lg transition">
          Home
        </Link>
      </li>

      <li>
        <Link to="/about" className="hover:bg-violet-300 px-3 py-1 rounded-lg transition">
          About
        </Link>
      </li>

      <li>
        <Link to="/contact" className="hover:bg-violet-300 px-3 py-1 rounded-lg transition">
          Contact
        </Link>
      </li>

      <li>
        <Link to="/howitwork" className="hover:bg-violet-300 px-3 py-1 rounded-lg transition">
          How It Works
        </Link>
      </li>
    </ul>
  </div>




  {/* Buttons */}
  <div className="flex items-center gap-3">
    
    <button className="border border-violet-700 px-4 py-2 rounded-lg hover:bg-violet-300 transition">
     <Link to ="/register"> Register</Link>
    </button>

    <button className="bg-violet-700 text-white px-4 py-2 rounded-lg hover:bg-violet-800 transition">
     <Link to ="/login"> Login</Link>
    </button>

  </div>
</nav>
    </>
  )
}
