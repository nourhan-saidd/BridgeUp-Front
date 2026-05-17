import mainphoto from '../../../public/mainsection.gif'
import { Link } from 'react-router-dom'
import photosectionthree from '../../../public/mainhome.png'

export default function Home() {
  return (
    <>
    <div>
    <section className="min-h-screen bg-[#f8f5ff] flex items-center px-6 md:px-16 lg:px-24 overflow-hidden">
      
      {/* Left Content */}
      <div className="w-full lg:w-1/2 z-10">
        
        <p className="text-violet-500 font-semibold text-lg md:text-xl mb-4 tracking-wide border rounded-4xl inline-block p-2 mb-2 ">
          Start Your Success Journey
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
          Connect With <span className="text-violet-500">Top Companies</span>
          <br />
          & Build Your Future
        </h1>

        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl mb-8">
          BridgeUp helps graduates connect with companies, discover
          opportunities, and start a successful career journey with
          confidence and growth.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          
          <button className="px-8 py-3 rounded-full bg-violet-600 text-white font-semibold shadow-lg hover:bg-violet-700 transition-all duration-300 hover:scale-105">
            <Link to="/login">Login</Link>
          </button>

          <button className="px-8 py-3 rounded-full border-2 border-violet-600 text-violet-600 font-semibold hover:bg-violet-600 hover:text-white transition-all duration-300 hover:scale-105">
             <Link to="/register">Register</Link> 
          </button>

        </div>
      </div>

      {/* Right Image */}
      <div className="hidden lg:flex w-1/2 justify-end relative">
        <img
          src={mainphoto}
          alt="Hero"
          className="relative w-[90%] rounded-[100px] shadow-2xl object-cover"
        />
      </div>
    </section>


    <section className="py-24 ">
  <div className="max-w-6xl mx-auto px-6">
    
    {/* Heading */}
    <div className="text-center mb-14">
      <h2 className="text-5xl font-bold text-[#15143b] mb-4">
        Choose Your Track
      </h2>

      <p className="text-[#7a7a9d] text-lg">
        Specialized learning paths designed for your career goals
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Frontend Card */}
      <div className="bg-white rounded-3xl border border-[#d9d7f0] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#efedff] flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-[#5b4dff]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.752 11.168l-6.518-3.75A1 1 0 007 8.285v7.43a1 1 0 001.234.972l6.518-1.68A1 1 0 0015.5 14.04v-1.912a1 1 0 00-.748-.96z"
            />
          </svg>
        </div>

        <h3 className="text-3xl font-bold text-[#15143b] mb-4">
          Frontend Track
        </h3>

        <p className="text-[#7a7a9d] leading-8 mb-6">
          Master React, JavaScript, CSS, and modern frontend technologies
        </p>

        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-[#6b6b90]">
            <span className="w-5 h-5 rounded-full border border-[#5b4dff] flex items-center justify-center text-xs text-[#5b4dff]">
              ✓
            </span>
            UI/UX Development
          </li>

          <li className="flex items-center gap-3 text-[#6b6b90]">
            <span className="w-5 h-5 rounded-full border border-[#5b4dff] flex items-center justify-center text-xs text-[#5b4dff]">
              ✓
            </span>
            Component Architecture
          </li>

          <li className="flex items-center gap-3 text-[#6b6b90]">
            <span className="w-5 h-5 rounded-full border border-[#5b4dff] flex items-center justify-center text-xs text-[#5b4dff]">
              ✓
            </span>
            State Management
          </li>
        </ul>
      </div>

      {/* Backend Card */}
      <div className="bg-white rounded-3xl border border-[#d9d7f0] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#efedff] flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-[#5b4dff]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
          </svg>
        </div>

        <h3 className="text-3xl font-bold text-[#15143b] mb-4">
          Backend Track
        </h3>

        <p className="text-[#7a7a9d] leading-8 mb-6">
          Learn Node.js, Express, databases, and API development
        </p>

        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-[#6b6b90]">
            <span className="w-5 h-5 rounded-full border border-[#5b4dff] flex items-center justify-center text-xs text-[#5b4dff]">
              ✓
            </span>
            RESTful APIs
          </li>

          <li className="flex items-center gap-3 text-[#6b6b90]">
            <span className="w-5 h-5 rounded-full border border-[#5b4dff] flex items-center justify-center text-xs text-[#5b4dff]">
              ✓
            </span>
            Database Design
          </li>

          <li className="flex items-center gap-3 text-[#6b6b90]">
            <span className="w-5 h-5 rounded-full border border-[#5b4dff] flex items-center justify-center text-xs text-[#5b4dff]">
              ✓
            </span>
            Server Architecture
          </li>
        </ul>
      </div>

    </div>
  </div>
</section>





















<section
  className="relative min-h-screen flex items-center justify-center overflow-hidden"
>
  {/* Background Image */}
  <img
    src={photosectionthree}
    alt="bridge"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-[#12003a]/80"></div>

  {/* Glow */}
  <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
    
    <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
      Connecting Talent
      <span className="block text-[#b8a9ff]">
        With Opportunity
      </span>
    </h2>

    <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
      Building the bridge between graduates and companies through
      real experience, training, and opportunities.
    </p>

    {/* Cards */}
    <div className="grid md:grid-cols-2 gap-8 mt-16">
      
      {/* Graduates */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-10 hover:scale-105 transition duration-300 shadow-2xl">
        <div className="text-5xl mb-5">🎓</div>

        <h3 className="text-3xl font-bold text-white">
          Graduates
        </h3>

        <p className="text-gray-300 mt-4 leading-7">
          Join training programs, build real projects, and connect
          with companies looking for fresh talent.
        </p>

        <button className="mt-8 px-8 py-3 rounded-full bg-[#7b61ff] hover:bg-[#927dff] text-white font-semibold transition">
                 <Link to="/registergraduate"> Start Your Journey</Link>   
        </button>
      </div>

      {/* Companies */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-10 hover:scale-105 transition duration-300 shadow-2xl">
        <div className="text-5xl mb-5">🏢</div>

        <h3 className="text-3xl font-bold text-white">
          Companies
        </h3>

        <p className="text-gray-300 mt-4 leading-7">
          Discover talented graduates, review top projects, and hire
          candidates ready for the real market.
        </p>

        <button className="mt-8 px-8 py-3 rounded-full bg-white text-[#4d44db] hover:bg-gray-200 font-semibold transition">
         <Link to="/registerCompany"> Explore Talent</Link> 
        </button>
      </div>

    </div>
  </div>
</section>





















<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-5xl font-bold text-[#1d1d3c] mb-4">
        Trusted by Industry Leaders
      </h2>

      <p className="text-[#7a7a9d] text-lg">
        See what our customers are saying about their experience with our platform
      </p>
    </div>

    {/* Main Testimonial */}
    <div className="max-w-4xl mx-auto bg-white border border-[#e7e7ef] rounded-3xl p-10 shadow-sm hover:shadow-xl transition duration-300 mb-12">
      
      {/* User */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src="https://i.pravatar.cc/100?img=5"
          alt="user"
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>
          <h3 className="font-bold text-[#1d1d3c] text-lg">
            Sarah Thompson
          </h3>

          <p className="text-[#8b8ba7] text-sm">
            CTO at TechFlow Solutions
          </p>
        </div>
      </div>

      {/* Text */}
      <p className="text-[#44445c] text-2xl leading-relaxed mb-8">
        "This platform has completely transformed how we handle our workflow
        automation. The ROI has been incredible — we've seen a 40% increase
        in team productivity within just three months of implementation."
      </p>

      {/* Stars */}
      <div className="flex items-center gap-4">
        <div className="flex text-[#2563eb] text-xl">
          ★★★★★
        </div>

        <span className="text-[#8b8ba7] text-sm">
          Verified Customer
        </span>
      </div>
    </div>




    {/* Small Testimonials */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
      
      {/* Card 1 */}
      <div className="border border-[#e7e7ef] rounded-2xl p-6 hover:shadow-lg transition duration-300">
        <p className="text-[#4d4d68] leading-8 mb-8">
          "The analytics dashboard is incredibly intuitive. It's helped us make
          data-driven decisions faster than ever before."
        </p>

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="user"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h4 className="font-semibold text-[#1d1d3c]">
              Michael Chen
            </h4>

            <p className="text-sm text-[#8b8ba7]">
              Product Manager
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="border border-[#e7e7ef] rounded-2xl p-6 hover:shadow-lg transition duration-300">
        <p className="text-[#4d4d68] leading-8 mb-8">
          "Setup was a breeze, and the customer support team has been exceptional
          whenever we needed help."
        </p>

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100?img=32"
            alt="user"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h4 className="font-semibold text-[#1d1d3c]">
              Emily Rodriguez
            </h4>

            <p className="text-sm text-[#8b8ba7]">
              Operations Director
            </p>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="border border-[#e7e7ef] rounded-2xl p-6 hover:shadow-lg transition duration-300">
        <p className="text-[#4d4d68] leading-8 mb-8">
          "The automation features have eliminated hours of manual work.
          It's been a game-changer for our team."
        </p>

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100?img=47"
            alt="user"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h4 className="font-semibold text-[#1d1d3c]">
              David Kim
            </h4>

            <p className="text-sm text-[#8b8ba7]">
              Tech Lead
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className="text-center">
      <button className="bg-[#5b4b8a] hover:bg-[#493a74] transition-all duration-300 text-white px-10 py-3 rounded-full font-medium shadow-md">
        <Link to='/register'>Start</Link>
      </button>

      <p className="text-[#8b8ba7] mt-4 capitalize">
        just sign up and start your journey
      </p>
    </div>
  </div>
</section>




    </div>
   </>
  )
}
