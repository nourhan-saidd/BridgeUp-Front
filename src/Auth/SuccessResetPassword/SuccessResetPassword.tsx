import { Link } from "react-router-dom";


export default function SuccessResetPassword() {
  return (
    <>
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center p-6 overflow-hidden font-sans">
      
      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 md:p-14 border border-white/40">
        
        {/* Badge Top */}
        <div className="mb-6 text-center">
          <span className="px-5 py-1.5 rounded-full bg-[#ede9fe] text-[#5b4ce2] text-sm font-semibold inline-block">
            Success
          </span>
        </div>

        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-bold text-[#1e1b4b] leading-tight">
            Password Reset Successful
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Your password has been reset successfully
          </p>
        </div>

        {/* Success Content Box */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 my-8">
          
          {/* Animated Success Icon Counterpart */}
          <div className="w-20 h-20 bg-[#ede9fe] text-[#5b4ce2] rounded-full flex items-center justify-center shadow-inner animate-bounce [animation-duration:2s]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#1e1b4b]">
              All Done!
            </h3>
            <p className="text-gray-500 mt-2 text-base max-w-sm">
              Your password has been reset successfully. <br />
              <span className="text-[#7b74e6] font-medium block mt-1">Redirecting to sign in...</span>
            </p>
          </div>

        </div>

        {/* Action Button - Sign In Now */}
        <div className="mt-8">
          <Link to="/login" className="block w-full">
            <button
              type="button"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#7b74e6] to-[#7b74e6] text-white font-bold text-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl transition-all duration-300 text-center"
            >
              Sign in now
            </button>
          </Link>
        </div>

      </div>
    </div>
    </>
  )
}
