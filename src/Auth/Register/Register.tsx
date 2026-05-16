import React from 'react'
import { Link, Links } from 'react-router-dom'

export default function Register() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f5f3ff]">

        {/* Logo */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-[#1d1b4f]">
            Bridge<span className="text-[#6c63ff]">Up</span>
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">

          {/* Title */}
          <h2 className="text-5xl font-bold text-[#111033] mb-4">
            Choose Your Role
          </h2>

          <p className="text-[#7b74e6] text-xl mb-16">
            Select how you want to get started with BridgeUp
          </p>

          {/* Cards */}
          <div className="flex gap-10 flex-wrap justify-center">

            {/* Graduate Card */}
       <Link to="/registergraduate">
            <div className="w-[350px] bg-white rounded-[35px] p-10 shadow-lg border-2 border-[#b8a9ff] 
            hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer text-center">

           <div className="w-24 h-24 bg-[#f3f0ff] rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <i className="fa-solid fa-user-graduate text-5xl text-[#6c63ff]"></i>
             </div>

              <h3 className="text-4xl font-bold text-[#111033] mb-6">
                Graduate
              </h3>

              {/* <p className="text-[#7b74e6] leading-10 text-lg">
                I'm a graduate looking for job opportunities and want to showcase my skills through assessments and learning paths.
              </p> */}
            </div>
       
       </Link>

            {/* Company Card */}
        <Link to="/registerCompany">
        
            <div className="w-[350px] bg-white rounded-[35px] p-10 shadow-lg border-2 border-[#b8a9ff] 
            hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer text-center">

            <div className="w-24 h-24 bg-[#f3f0ff] rounded-3xl flex items-center justify-center mx-auto mb-8">
                <i className="fa-solid fa-building text-5xl text-[#6c63ff]"></i>
           </div>

              <h3 className="text-4xl font-bold text-[#111033] mb-6">
                Company
              </h3>

              {/* <p className="text-[#7b74e6] leading-10 text-lg">
                I'm a company looking to hire talented graduates and want to connect with skilled professionals.
              </p> */}
            </div>

        </Link>
          </div>

          {/* Footer */}
          <p className="mt-16 text-[#7b74e6] text-lg">
            Already have an account?
        <span className="pl-2 font-bold text-[#4d44db] cursor-pointer hover:border-b-2 hover:border-[#4d44db] transition-all duration-200">
                 <Link to="/login">Sign in here</Link>
           </span>
          </p>

        </div>
      </div>
    </>
  )
}