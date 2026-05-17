import contactImg from '../../../public/contact.gif'
export default function Contact() {
  return (
    <>
<div>


    <section className="bg-[#f3f0ff] py-16 px-4">
      <div className="max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-lg bg-[#f7f4ff]">

        {/* Top Image Section */}
        <div className="relative h-[300px] md:h-[400px]">
          <img
            src={contactImg}
            alt="contact"
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#5b4b8a]/40 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight">
              We’re Here <br /> To Help You
            </h2>

            <p className="text-white/90 mt-4 text-sm md:text-lg max-w-xl">
              Have questions, problems, or need support?  
              Our team is always ready to help you.
            </p>
          </div>
        </div>

        {/* Bottom Form Section */}
        <div className="grid md:grid-cols-2 gap-10 p-8 md:p-14">

          {/* Left Text */}
          <div className="flex flex-col justify-center">
            <div className="text-5xl mb-6">✉️</div>

            <h3 className="text-3xl font-bold text-[#2d2555] leading-snug">
              Let’s Solve <br /> Your Problems
            </h3>

            <p className="text-[#5f5a7a] mt-5 leading-7">
              If you have any questions, technical issues, or inquiries,
              feel free to contact us anytime and we’ll respond as soon as possible.
            </p>

            <p className="mt-6 font-semibold text-[#5b4b8a] underline">
              support@bridgeup.com
            </p>
          </div>

          {/* Form */}
          <form className="space-y-8">
            <h3 className="text-3xl font-bold text-[#2d2555]">
              Contact Us
            </h3>

            {/* Name Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[#5f5a7a]">
                  First Name
                </label>

                <input
                  type="text"
                  className="w-full bg-transparent border-b border-[#7d73a8] outline-none py-2 mt-2"
                />
              </div>

              <div>
                <label className="text-sm text-[#5f5a7a]">
                  Last Name
                </label>

                <input
                  type="text"
                  className="w-full bg-transparent border-b border-[#7d73a8] outline-none py-2 mt-2"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-[#5f5a7a]">
                Email
              </label>

              <input
                type="email"
                className="w-full bg-transparent border-b border-[#7d73a8] outline-none py-2 mt-2"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-sm text-[#5f5a7a]">
                Your Message
              </label>

              <textarea
                rows="4"
                className="w-full bg-transparent border-b border-[#7d73a8] outline-none py-2 mt-2 resize-none"
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="bg-[#5b4b8a] hover:bg-[#493a74] transition-all duration-300 text-white px-10 py-3 rounded-full font-medium shadow-md"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
</div>
    </>
  )
}
