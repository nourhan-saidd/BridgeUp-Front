import React from 'react'
import { Link } from 'react-router-dom'

export default function VerifyCode() {
  return (
    <>
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center p-6 overflow-hidden font-sans">
      
      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 md:p-14 border border-white/40">
        
        {/* Badge Top */}
        <div className="mb-6 text-center">
          <span className="px-5 py-1.5 rounded-full bg-[#ede9fe] text-[#5b4ce2] text-sm font-semibold inline-block">
            Verification
          </span>
        </div>

        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-bold text-[#1e1b4b] leading-tight">
            Verify Code
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            We've sent a 6-digit code to <span className="font-semibold text-[#1e1b4b]">nourhanzz115@gmail.com</span>
          </p>
        </div>

        {/* Form Static Wrapper */}
        <div className="space-y-8">
          
          {/* Code Input Field */}
          <div>
            <label className="block mb-4 font-semibold text-[#1e1b4b] text-lg text-center">
              Enter Verification Code
            </label>
            
            <div className="grid grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  className="w-full h-16 text-center text-3xl font-bold rounded-2xl border border-[#ddd6fe] bg-white/80 outline-none focus:border-[#5b4ce2] focus:ring-4 focus:ring-[#c4b5fd] transition-all"
                />
              ))}
            </div>

            {/* Resend Link */}
            <p className="text-center text-gray-500 pt-5 text-base">
              Didn't receive the code?
              <span className="text-[#7b74e6] font-bold cursor-pointer hover:underline ml-2">
                Resend
              </span>
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#7b74e6] to-[#7b74e6] text-white font-bold text-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl transition-all duration-300"
          >
          <Link to="/resetpassword">Verify Code</Link>
          </button>
          
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          
          <span className="text-[#7b74e6] font-bold cursor-pointer hover:underline inline-flex items-center gap-2 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7M3 12h18" />
              </svg>
            <Link to="/forgetpassword" className="inline-flex items-center gap-2">
              Change Email
            </Link>
            
          </span>
        </div>

      </div>
    </div>
    </>
  )
}
