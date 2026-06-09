import { Outlet, Link } from "react-router-dom";

export default function SupportMessageAdmin() {
  return (
    <div className="min-h-screen bg-[#f3f0ff] p-6 w-screen">
<div className="max-w-7xl mx-auto  p-5">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2d2555] text-center">
            Support Messages
          </h1>

          <p className="text-[#5f5a7a] mt-2 text-center">
            Manage and review all contact requests from users.
          </p>
        </div>

  
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <Link to="total">
            <div className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition">
              <h3 className="text-[#5f5a7a] text-sm">
                Total Messages
              </h3>

              <p className="text-4xl font-bold text-[#5b4b8a] mt-2">
                29
              </p>
            </div>
          </Link>

          <Link to="today">
            <div className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition">
              <h3 className="text-[#5f5a7a] text-sm">
                Today's Messages
              </h3>

              <p className="text-4xl font-bold text-[#5b4b8a] mt-2">
                12
              </p>
            </div>
          </Link>

        </div>

     <div className="text-center p-5">
         <Outlet />
     </div>

      </div>
    </div>
  );
}