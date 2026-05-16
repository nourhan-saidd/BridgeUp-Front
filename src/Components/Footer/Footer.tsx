import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <>
      <footer className="px-6 py-10 bg-violet-50">
  
    <div className="bg-white shadow-xl rounded-3xl p-10">

    {/* Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      


      {/* Section 1 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          
          <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
            Logo
          </div>

          <h2 className="text-2xl font-bold text-violet-900">
            BridgeUp
          </h2>
        </div>
        <p className="text-gray-600 leading-7">
          BridgeUp helps students and graduates connect with
          companies, opportunities, and build their future careers.
        </p>
      </div>

      {/* Section 2 */}
      <div>
        
        <h3 className="text-xl font-semibold mb-5 text-violet-900">
          Social Media
        </h3>

        <ul className="space-y-3 text-gray-600">
          <li className="hover:text-violet-600 cursor-pointer transition">
          <a href='https://www.facebook.com/' target="_blank" rel="noopener noreferrer">FaceBook</a>
          </li>

          <li className="hover:text-violet-600 cursor-pointer transition">
                   <a href='https://www.instagram.com/' target="_blank" rel="noopener noreferrer">Instagram</a> 
          </li>

          <li className="hover:text-violet-600 cursor-pointer transition">
                   <a href='https://www.linkedin.com/feed/' target="_blank" rel="noopener noreferrer">LinkedIn</a>   
          </li>

          <li className="hover:text-violet-600 cursor-pointer transition">
                      <a href='https://x.com/' target="_blank" rel="noopener noreferrer">Twitter</a>
          </li>
        </ul>

      </div>

      {/* Section 3 */}
      <div>

        <h3 className="text-xl font-semibold mb-5 text-violet-900">
          Quick Links
        </h3>

        <ul className="space-y-3 text-gray-600">

          <li>
            <Link
              to="/home"
              className="hover:text-violet-600 transition"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="hover:text-violet-600 transition"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/howitwork"
              className="hover:text-violet-600 transition"
            >
              How It Work
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="hover:text-violet-600 transition"
            >
              Contact
            </Link>
          </li>

        </ul>

      </div>

  {/* Section 4 */}
<div>

  <h3 className="text-xl font-semibold mb-5 text-violet-900">
    Contact Info
  </h3>

  <div className="space-y-4 text-gray-600">

    <div className="flex items-center gap-3">
      <i className="fa-solid fa-location-dot text-violet-700"></i>
      <p>Cairo, Egypt</p>
    </div>

    <div className="flex items-center gap-3">
      <i className="fa-solid fa-envelope text-violet-700"></i>
      <p>bridgeup@gmail.com</p>
    </div>

    <div className="flex items-center gap-3">
      <i className="fa-solid fa-phone text-violet-700"></i>
      <p>+20 123 456 789</p>
    </div>

    <div className="flex items-center gap-3">
      <i className="fa-solid fa-envelopes-bulk text-violet-700"></i>
      <p>P.O Box 2026</p>
    </div>

  </div>

</div>
    </div>

    {/* Bottom Text */}
    <div className="border-t mt-10 pt-5 text-center text-gray-500">
      2026. BridgeUp All Rights Reserved
    </div>

  </div>

</footer>
    </>
  )
}
