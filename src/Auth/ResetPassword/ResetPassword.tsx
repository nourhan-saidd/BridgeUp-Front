import React from 'react'
import { Link } from 'react-router-dom'

export default function ResetPassword() {
  return (
    <>
          <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center p-6 overflow-hidden font-sans">
      
      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 md:p-14 border border-white/40">
        
        {/* Badge Top */}
        <div className="mb-6 text-center">
          <span className="px-5 py-1.5 rounded-full bg-[#ede9fe] text-[#5b4ce2] text-sm font-semibold inline-block">
            New Password
          </span>
        </div>

        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-bold text-[#1e1b4b] leading-tight">
            Create New Password
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Enter your new password
          </p>
        </div>



       <form>
        {/* Form Static Wrapper */}
        <div className="space-y-6">
          
          {/* New Password Input */}
          <div>
            <label className="block mb-2 font-semibold text-[#1e1b4b] text-lg">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full h-14 px-5 rounded-2xl border border-[#ddd6fe] bg-white/80 outline-none focus:border-[#5b4ce2] focus:ring-4 focus:ring-[#c4b5fd] transition-all text-lg"
            />
            <span className="block mt-2 text-sm text-[#7b74e6] font-medium">
              Must be at least 8 characters
            </span>
          </div>

          {/* Confirm New Password Input */}
          <div>
            <label className="block mb-2 font-semibold text-[#1e1b4b] text-lg">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full h-14 px-5 rounded-2xl border border-[#ddd6fe] bg-white/80 outline-none focus:border-[#5b4ce2] focus:ring-4 focus:ring-[#c4b5fd] transition-all text-lg"
            />
          </div>

          {/* Action Button */}
          <button
            type="button"
            className="w-full h-14 mt-4 rounded-2xl bg-gradient-to-r from-[#7b74e6] to-[#7b74e6] text-white font-bold text-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl transition-all duration-300"
          >
          <Link to="/successresetpassword">  Reset Password</Link>
          </button>
          
        </div>

       </form>



        {/* Footer Link */}
        <div className="mt-10 text-center">
          <span className="text-[#7b74e6] font-bold cursor-pointer hover:underline inline-flex items-center gap-2 text-lg">
            <Link to="/verifycode" className="inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7M3 12h18" />
              </svg>
              Back to Verification
            </Link>
          </span>
        </div>

      </div>
    </div>
    </>
  )
}
