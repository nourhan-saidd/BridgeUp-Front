import { Link, Links } from 'react-router-dom'
import loginImg from '../../../public/login.gif'
export default function Login() {
  return (
    <>
<div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center p-6 overflow-hidden">
  {/* Main Card */}
  <div className="w-full max-w-6xl bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden border border-white/40 grid grid-cols-1 lg:grid-cols-2">
    


    {/* Left Side */}
    <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-[#7b74e6] to-[#7b74e6] p-10 overflow-hidden">
      
      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl"></div>

      {/* image  */}
    <img
  src={loginImg}
  alt="login animation"
  className="relative z-10 w-full max-w-md rounded-3xl shadow-2xl border border-white/20"
/>

      {/* Text Overlay */}
      <div className="absolute bottom-10 left-10 z-20 text-white">
        <h1 className="text-4xl font-bold leading-tight">
          Welcome Back 👋
        </h1>

        <p className="mt-3 text-white/80 max-w-sm text-lg">
          Sign in and continue your journey with us.
        </p>
      </div>
    </div>








    {/* Right Side */}
    <div className="flex items-center justify-center p-8 md:p-14">
      
      <div className="w-full max-w-md">
        
        {/* Mobile Heading */}
        <div className="lg:hidden mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#1e1b4b]">
            Welcome Back
          </h1>

          <p className="text-[#6d68d8] mt-2">
            Login to continue
          </p>
        </div>

        {/* Heading */}
        <div className="hidden lg:block mb-10">
          <span className="px-4 py-1 rounded-full bg-[#ede9fe] text-[#5b4ce2] text-sm font-semibold">
            Login
          </span>

          <h2 className="text-5xl font-bold text-[#1e1b4b] mt-4 leading-tight">
            Sign In
          </h2>

          <p className="text-gray-500 mt-3 text-lg">
            Enter your details to access your account
          </p>
        </div>




        {/* Form */}
        <form className="space-y-6">

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-[#1e1b4b]">
              Email Address
            </label>

            <input
              type="email"
              placeholder="your@email.com"
              className="w-full h-14 px-5 rounded-2xl border border-[#ddd6fe] bg-white/80 outline-none focus:border-[#5b4ce2] focus:ring-4 focus:ring-[#c4b5fd] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-[#1e1b4b]">
                Password
              </label>

              <span className="text-sm text-[#5b4ce2] hover:underline cursor-pointer">
                <Link to="/forgetpassword">Forgot password?</Link>
              </span>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-14 px-5 rounded-2xl border border-[#ddd6fe] bg-white/80 outline-none focus:border-[#5b4ce2] focus:ring-4 focus:ring-[#c4b5fd] transition-all"
            />
          </div>


          {/* Button */}
          <button
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#7b74e6] to-[#7b74e6] text-white font-bold text-lg shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
          >
            Sign In
          </button>

 </form>

          {/* Divider */}
          <div className="flex items-center gap-4 pt-5">
            <div className="flex-1 h-[1px] bg-gray-200"></div>

            <span className="text-gray-400 text-sm">
              OR
            </span>

            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

    

          {/* Footer */}
          <p className="text-center text-gray-500 pt-2">
            Don’t have an account?
            <span className="text-[#7b74e6] font-bold cursor-pointer hover:underline ml-2">
         <Link to="/register">Sign up</Link>
            </span>
          </p>



       
      </div>
    </div>




  </div>
</div>
    </>
  )
}
