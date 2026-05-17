import React from 'react'
import aboutImg from '../../../public/bout.gif'

export default function About() {
  return (
    <>
 <section className="bg-[#eee5ff] py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        {/* Image */}
        <div className="relative">
          <div className="absolute -top-5 -left-5 w-full h-full bg-[#c9b3ff] rounded-3xl"></div>

          <img
            src={aboutImg}
            alt="about"
            className="relative rounded-3xl shadow-xl object-cover h-[500px] w-full"
          />
        </div>

        {/* Content */}
        <div>
          <span className="bg-[#d7c4ff] text-[#5b4b8a] px-5 py-2 rounded-full text-sm font-semibold">
            ABOUT BRIDGEUP
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-[#2d2555] leading-tight mt-6">
            Connecting Graduates
            <br />
            With Great Companies
          </h2>

          <p className="text-[#5f5a7a] mt-6 leading-8 text-lg">
            BridgeUp is a smart platform that helps graduates find jobs,
            internships, and opportunities while enabling companies to
            discover talented candidates easily and efficiently.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-5 mt-10">

            <div className="bg-white rounded-2xl p-6 shadow-md hover:scale-105 duration-300">
              <h3 className="text-3xl font-bold text-[#5b4b8a]">
                +500
              </h3>

              <p className="text-[#5f5a7a] mt-2">
                Graduates Joined
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:scale-105 duration-300">
              <h3 className="text-3xl font-bold text-[#5b4b8a]">
                +120
              </h3>

              <p className="text-[#5f5a7a] mt-2">
                Companies
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:scale-105 duration-300">
              <h3 className="text-3xl font-bold text-[#5b4b8a]">
                +1K
              </h3>

              <p className="text-[#5f5a7a] mt-2">
             Active Users
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:scale-105 duration-300">
              <h3 className="text-3xl font-bold text-[#5b4b8a]">
                95%
              </h3>

              <p className="text-[#5f5a7a] mt-2">
                Satisfaction
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
    </>
  )
}
