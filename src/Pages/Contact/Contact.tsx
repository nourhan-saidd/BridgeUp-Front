import { useForm } from 'react-hook-form'
import contactImg from '../../../public/contact.gif'
import axiosinstance from '@/Context/BaseUrl/AxiosInstance'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { toast } from 'sonner'
export default function Contact() {


const [isLoader,setIsLoader]=useState(false)


const schemaContact= zod.object({
  firstName:zod.string().nonempty('thid field is required').min(3,'letters must be more than 3').max(20,'letters must be less than 20'),
  lastName:zod.string().nonempty('this field is required').min(3,'letters must be more than 3').max(20,'letters must be less than 20'),
  email:zod.string().nonempty('this field is required').regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , 'this is not valid email'),
  message:zod.string().nonempty('this field is required').min(10,'letters must be more than 10').max(500,'lerrters must be less than 500')
})



const {register,handleSubmit,formState , reset}=useForm({
  defaultValues:{
    firstName:"",
    lastName:"",
    email:"",
    message:""
  },
  mode:'onBlur',
  resolver:zodResolver(schemaContact)
})



async function onSubmit(data:unknown){
 setIsLoader(true)
  try{
        const formData=await axiosinstance.post(`api/v1/contact-us` , data)
        toast.success(formData?.data?.message)
        setTimeout(() => {
          reset()
        }, 1000);
        
  }catch(error:unknown){
    toast.error(error.response?.data?.message || "Something went wrong")
  }finally{
     setIsLoader(false)
  }

}












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
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-3xl font-bold text-[#2d2555]">
              Contact Us
            </h3>

            {/* Name Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[#5f5a7a]" htmlFor='firstNameContact'>
                  First Name
                </label>

                <input
                {...register('firstName')}
                id='firstNameContact'
                  type="text"
                  className="w-full bg-transparent border-b border-[#7d73a8] outline-none py-2 mt-2"
                />
                  
             {
            formState.errors.firstName && formState.touchedFields.firstName && (     
              <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors?.firstName?.message}</p>) 
              }

              
            


              </div>

              <div>
                <label className="text-sm text-[#5f5a7a]" htmlFor='lastNameContact'>
                  Last Name
                </label>

                <input
                {...register('lastName')}
                id='lastNameContact'
                  type="text"
                  className="w-full bg-transparent border-b border-[#7d73a8] outline-none py-2 mt-2"
                />
 {
            formState.errors.lastName && formState.touchedFields.lastName && (     
              <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors?.lastName?.message}</p>) 
              }
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-[#5f5a7a]" htmlFor='emailContact'>
                Email
              </label>

              <input
              {...register("email")}
                id='emailContact'
                type="email"
                className="w-full bg-transparent border-b border-[#7d73a8] outline-none py-2 mt-2"
              />
   {
            formState.errors.email && formState.touchedFields.email && (     
              <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors?.email?.message}</p>) 
              }

            </div>

            {/* Message */}
            <div>
              <label className="text-sm text-[#5f5a7a]" htmlFor='messageContact'>
                Your Message
              </label>

              <textarea
              {...register("message")}
              id='messageContact'
                rows="4"
                className="w-full bg-transparent border-b border-[#7d73a8] outline-none py-2 mt-2 resize-none"
              ></textarea>
               {
            formState.errors.message && formState.touchedFields.message && (     
              <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors?.message?.message}</p>) 
              }
            </div>

            {/* Button */}
            <button
            disabled={isLoader}
              type="submit"
              className="bg-[#5b4b8a] hover:bg-[#493a74] transition-all duration-300 text-white px-10 py-3 rounded-full font-medium shadow-md"
            >
              {isLoader ? <BeatLoader /> : 'submit'}
            </button>
          </form>
        </div>
      </div>
    </section>
</div>
    </>
  )
}
