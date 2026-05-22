import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import * as zod from 'zod';
import axiosinstance from '@/Context/BaseUrl/AxiosInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { BeatLoader } from 'react-spinners';
export default function ForgetPassword() {


  const schemaEmail=zod.object({
 email: zod.string().nonempty("Email is required").email("Invalid email format")
  })

const navigate=useNavigate();
  const{register,handleSubmit,formState}=useForm({
    mode:'onBlur',
    defaultValues:{
      email:''
    }, 
   resolver:zodResolver(schemaEmail)
  })

const[loader , setLoader]=useState(false)
async function onSubmit(data:{email:string}){
  setLoader(true)
try{
  const resEmail=await axiosinstance.post('api/v1/auth/forgot-password' , data)
  console.log(resEmail.data)
  navigate('/verifycode')
  toast.success('Email send successfully 🎉')

}catch(error:any){
  console.log(error)
  toast.error(error.response?.data.message)
}finally{
 setLoader(false)
}
}

  return (
    <>
   <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center p-6 overflow-hidden font-sans">
      
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 md:p-14 border border-white/40">
        
        {/* Badge Top */}
        <div className="mb-6 text-center">
          <span className="px-5 py-1.5 rounded-full bg-[#ede9fe] text-[#5b4ce2] text-sm font-semibold inline-block">
            Security
          </span>
        </div>

        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-bold text-[#1e1b4b] leading-tight">
            Reset Password
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Enter your email to receive a verification code
          </p>
        </div>

        {/* Form Static Wrapper */}

        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
        
          <div>
            <label className="block mb-2 font-semibold text-[#1e1b4b] text-lg">
              Email Address
            </label>
            
            <input
            {...register("email")}
              type="email"
              placeholder="your@email.com"
              className="w-full h-14 px-5 rounded-2xl border border-[#ddd6fe] bg-white/80 outline-none focus:border-[#5b4ce2] focus:ring-4 focus:ring-[#c4b5fd] transition-all text-lg"
            />
              {formState.errors.email && formState.touchedFields.email && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.email.message}</p>
             )}
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#7b74e6] to-[#7b74e6] text-white font-bold text-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl transition-all duration-300"
          >
          {loader ? <BeatLoader/>:'Send Verification Code'}  
          </button>
          
        </div>
</form> 



        {/* Divider */}
        <div className="flex items-center gap-4 pt-8">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="text-gray-400 text-sm tracking-wider">OR</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-gray-500 pt-6 text-lg">
          Remember your password?
          <span className="text-[#7b74e6] font-bold cursor-pointer hover:underline ml-2 inline-flex items-center gap-1">
            <Link to="/login" className="inline-flex items-center gap-1">
              Sign In
            </Link>
          </span>
        </p>

      </div>
    </div>
    </>
  )
}
