import React from "react";
import registerImg from "../../../public/registercompany.gif";
import { Link } from "react-router-dom";

export default function RegisterCompany() {
  return (
    <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side Form */}
        <div className="p-8 lg:p-12 overflow-y-auto">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#2E1A47]">
              Create Company Account
            </h1>

            <p className="text-sm text-[#7c5cff] mt-2">
              Register your company to find talented graduates
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Company Info */}
            <div>
          

              <div className="space-y-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm text-[#2E1A47] mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="TechCorp Egypt"
                    className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-[#2E1A47] mb-2">
                    Business Email <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    required
                    placeholder="hr@company.com"
                    className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                  />
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="password"
                      required
                      placeholder="********"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="password"
                      required
                      placeholder="********"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>
                </div>

                {/* Phone + Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Contact Phone <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="+20 1000 000 000"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Field (Industry) <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="Software Company"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-[#2E1A47] mb-2">
                    Company Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    rows="5"
                    required
                    placeholder="Tell us about your company..."
                    className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none resize-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              {/* Commercial Register */}
              <div>
                <label className="block text-sm text-[#2E1A47] mb-2">
                  Commercial Register <span className="text-red-500">*</span>
                </label>

                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-[#d9cdf7] rounded-2xl cursor-pointer bg-[#faf8ff] hover:bg-[#f4efff] transition">
                  <p className="text-sm font-medium text-[#6D4AFF]">
                    Upload Commercial Register
                  </p>

                  <p className="text-xs text-[#8b7bb8] mt-1">
                    PDF, JPG, PNG (Max 10MB)
                  </p>

                  <input type="file" required className="hidden" />
                </label>
              </div>

              {/* Tax Card */}
              <div>
                <label className="block text-sm text-[#2E1A47] mb-2">
                  Tax Card <span className="text-red-500">*</span>
                </label>

                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-[#d9cdf7] rounded-2xl cursor-pointer bg-[#faf8ff] hover:bg-[#f4efff] transition">
                  <p className="text-sm font-medium text-[#6D4AFF]">
                    Upload Tax Card
                  </p>

                  <p className="text-xs text-[#8b7bb8] mt-1">
                    PDF, JPG, PNG (Max 10MB)
                  </p>

                  <input type="file" required className="hidden" />
                </label>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 accent-[#7c5cff]"
              />

              <p className="text-sm text-[#7b6ca8]">
                I confirm that all information provided is accurate and I agree
                to       <span className="text-[#5a3ec8] font-bold">  BridgeUp's Terms and Conditions</span> and<span className="text-[#5a3ec8] font-bold"> Privacy Policy</span>.
              </p>
            </div>

            {/* Note */}
            <div className="bg-[#eee6ff] border border-[#cdbdff] rounded-2xl p-4">
              <p className="text-sm font-medium text-[#5a3ec8]">
                <span className="text-black font-bold">Note</span>: Your account will be reviewed by our admin team. You'll
                receive an email once approved.
              </p>
            </div>

            {/* Button */}
            <button className="w-full bg-[#6D4AFF] hover:bg-[#5c3df0] transition-all duration-300 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-xl">
              Submit for Review
            </button>

            {/* Login */}
            <p className="text-center text-sm text-[#8b7bb8]">
              Already have an account?{" "}
              <span className="text-[#6D4AFF] font-medium cursor-pointer hover:underline">
                <Link to="/login">Sign in</Link>
              </span>
            </p>
          </form>
        </div>

        {/* Right Side Image */}
        <div className="hidden lg:flex items-center justify-center bg-[#ede7ff]">
          <div className="w-[90%] h-full flex items-center justify-center py-8">
            <img
              src={registerImg}
              alt="register"
              className="h-full max-h-[900px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
