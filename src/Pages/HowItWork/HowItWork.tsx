import React from 'react'
import {
  FaBuilding,
  FaUserGraduate,
  FaUserCheck,
  FaFilter,
  FaPaperPlane,
  FaBrain,
  FaLaptopCode,
  FaLinkedin,
  FaFileUpload,
} from "react-icons/fa";
export default function HowItWork() {


  return (
    <>
      <section className="bg-[#f7f4ff] py-20 px-4">

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="bg-[#d7c4ff] text-[#5b4b8a] px-5 py-2 rounded-full text-sm font-semibold">
          HOW IT WORKS
        </span>

        <h2 className="text-4xl md:text-5xl font-bold text-[#2d2555] mt-6 leading-tight">
          BridgeUp Makes Hiring
          <br />
          Easier For Everyone
        </h2>

        <p className="text-[#5f5a7a] mt-6 text-lg leading-8">
          A smart platform connecting talented graduates with companies
          looking for the best candidates.
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 mt-20">

        {/* Companies Section */}
        <div className="bg-white rounded-[35px] p-10 shadow-lg hover:-translate-y-2 duration-300">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#d7c4ff] flex items-center justify-center text-3xl text-[#5b4b8a]">
              <FaBuilding />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#2d2555]">
                For Companies
              </h3>

              <p className="text-[#5f5a7a] mt-1">
                Find and hire top graduates easily.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">

            <div className="flex gap-5">
              <div className="text-2xl text-[#5b4b8a] mt-1">
                <FaUserCheck />
              </div>

              <div>
                <h4 className="text-xl font-semibold text-[#2d2555]">
                  Register Company Account
                </h4>

                <p className="text-[#5f5a7a] mt-2 leading-7">
                  Companies can create accounts and set up their profiles.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="text-2xl text-[#5b4b8a] mt-1">
                <FaFilter />
              </div>

              <div>
                <h4 className="text-xl font-semibold text-[#2d2555]">
                  Filter Graduates
                </h4>

                <p className="text-[#5f5a7a] mt-2 leading-7">
                  Search and filter candidates based on skills, scores,
                  field, and experience.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="text-2xl text-[#5b4b8a] mt-1">
                <FaPaperPlane />
              </div>

              <div>
                <h4 className="text-xl font-semibold text-[#2d2555]">
                  Send Offers
                </h4>

                <p className="text-[#5f5a7a] mt-2 leading-7">
                  Choose the best graduates and send internship or job offers directly.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Graduates Section */}
        <div className="bg-[#5b4b8a] rounded-[35px] p-10 shadow-lg text-white hover:-translate-y-2 duration-300">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
              <FaUserGraduate />
            </div>

            <div>
              <h3 className="text-3xl font-bold">
                For Graduates
              </h3>

              <p className="text-white/80 mt-1">
                Improve your skills and get discovered.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">

            <div className="flex gap-5">
              <div className="text-2xl mt-1">
                <FaUserCheck />
              </div>

              <div>
                <h4 className="text-xl font-semibold">
                  Create Your Account
                </h4>

                <p className="text-white/80 mt-2 leading-7">
                  Register and choose your field and career interests.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="text-2xl mt-1">
                <FaBrain />
              </div>

              <div>
                <h4 className="text-xl font-semibold">
                  Take Assessments
                </h4>

                <p className="text-white/80 mt-2 leading-7">
                  Complete English, IQ, and technical tests based on your chosen field.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="text-2xl mt-1">
                <FaLaptopCode />
              </div>

              <div>
                <h4 className="text-xl font-semibold">
                  Improve Your Skills
                </h4>

                <p className="text-white/80 mt-2 leading-7">
                  Develop your experience and showcase your abilities to companies.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="text-2xl mt-1">
                <FaFileUpload />
              </div>

              <div>
                <h4 className="text-xl font-semibold">
                  Upload CV & LinkedIn
                </h4>

                <p className="text-white/80 mt-2 leading-7">
                  Add your CV and LinkedIn profile so companies can review your profile.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="text-2xl mt-1">
                <FaLinkedin />
              </div>

              <div>
                <h4 className="text-xl font-semibold">
                  Get Ranked
                </h4>

                <p className="text-white/80 mt-2 leading-7">
                  Companies will discover and compare top graduates based on performance.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
    </>
  )
}
