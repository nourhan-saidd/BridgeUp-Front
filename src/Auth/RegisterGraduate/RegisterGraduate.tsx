import { useState } from "react"
import registerImg from "../../../public/registergraduate.webp"
import { Link } from "react-router-dom"

export default function RegisterGraduate() {
  // State لتخزين التراك المختار (سواء frontend أو backend)
  const [selectedTrack, setSelectedTrack] = useState("")

  return (
    <>
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center p-6">

        {/* Main Container */}
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

          {/* Left Side Form */}
          <div className="p-8 lg:p-12 overflow-y-auto">

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#2E1A47]">
                Create Graduate Account
              </h1>
              <p className="text-sm text-[#8b7bb8] mt-2">
                Fill in your details to start your journey
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">

              {/* Personal Info */}
              <div>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ahmed Hassan"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ahmed@example.com"
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

                  {/* Phone + Age + Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-[#2E1A47] mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+20 100 000 0000"
                        className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2E1A47] mb-2">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="23"
                        className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2E1A47] mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Female"
                        className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-sm font-semibold text-[#2E1A47] mb-4">
                  Education
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      College/University <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Cairo University"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Graduation Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2024"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>
                </div>
              </div>

           {/* Track */}
<div>
  <h2 className="text-sm font-semibold text-[#2E1A47] mb-2">
    Choose Your Track <span className="text-red-500">*</span>
  </h2>

  <p className="text-xs text-[#8b7bb8] mb-4">
    Select the specialization path you want to pursue
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Frontend Track */}
    <label className="cursor-pointer group">
      {/* الـ input الحقيقي مخفي تماماً ومأخد كلاس peer */}
      <input
        type="radio"
        name="track"
        value="frontend"
        required
        className="sr-only peer"
      />
      
      {/* الديف ده هو اللي هيتغير شكله بناءً على حالة الـ input اللي فوقه */}
      <div className="border border-[#d9cdf7] rounded-2xl p-4 bg-[#faf8ff] transition duration-300 peer-checked:border-[#7c5cff] peer-checked:bg-[#f3eeff] peer-checked:ring-2 peer-checked:ring-[#7c5cff]/20 hover:border-[#7c5cff] hover:bg-[#f3eeff]">
        <h3 className="font-semibold text-[#2E1A47] flex items-center gap-3">
          <i className="fa-solid fa-laptop-code text-[#6D4AFF]"></i>
          <span>Frontend Track</span>
        </h3>
        <p className="text-xs text-[#8b7bb8] mt-1">
          React, JavaScript, CSS, UI/UX Development
        </p>
      </div>
    </label>

    {/* Backend Track */}
    <label className="cursor-pointer group">
      {/* الـ input الحقيقي مخفي تماماً ومأخد كلاس peer */}
      <input
        type="radio"
        name="track"
        value="backend"
        className="sr-only peer"
      />
      
      {/* الديف ده هو اللي هيتغير شكله بناءً على حالة الـ input اللي فوقه */}
      <div className="border border-[#d9cdf7] rounded-2xl p-4 bg-[#faf8ff] transition duration-300 peer-checked:border-[#7c5cff] peer-checked:bg-[#f3eeff] peer-checked:ring-2 peer-checked:ring-[#7c5cff]/20 hover:border-[#7c5cff] hover:bg-[#f3eeff]">
        <h3 className="font-semibold text-[#2E1A47] flex items-center gap-3">
          <i className="fa-solid fa-server text-[#6D4AFF]"></i>
          <span>Backend Track</span>
        </h3>
        <p className="text-xs text-[#8b7bb8] mt-1">
          Node.js, Express, Databases, API 
        </p>
      </div>
    </label>

  </div>
</div>
              {/* Upload CV */}
              <div>
                <label className="block text-sm text-[#2E1A47] mb-2">
                  Upload CV/Resume
                </label>
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-[#d9cdf7] rounded-2xl cursor-pointer bg-[#faf8ff] hover:bg-[#f4efff] transition">
                  <p className="text-sm font-medium text-[#6D4AFF] flex items-center gap-3">
                    <i className="fa-solid fa-file-arrow-up text-[#6D4AFF]"></i>
                    <span>Click to upload your CV</span>
                  </p>
                  <p className="text-xs text-[#8b7bb8] mt-1">
                    PDF, DOC, DOCX (Max 5MB)
                  </p>
                  <input type="file" required className="hidden" />
                </label>
              </div>

              {/* Professional Links */}
              <div>
                <h2 className="text-sm font-semibold text-[#2E1A47] mb-4">
                  Professional Links
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Portfolio Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-portfolio.com"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
                  </div>
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
                  I agree to BridgeUp's Terms and Conditions and Privacy Policy
                </p>
              </div>

              {/* Button */}
              <button className="w-full bg-[#6D4AFF] hover:bg-[#5c3df0] transition-all duration-300 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-xl">
                Create Account
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
    </>
  )
}