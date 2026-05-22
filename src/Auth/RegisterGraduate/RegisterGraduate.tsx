import registerImg from "../../../public/registergraduate.webp"
import { Link, useNavigate} from "react-router-dom"
import { useForm } from "react-hook-form";
import * as zod from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { toast } from 'sonner';
import { useState } from "react";
import { BeatLoader } from "react-spinners";
export default function RegisterGraduate() {
 
const navigate=useNavigate()
const[loader,setIsLoader]=useState(false)
     const schemaRegisterGraduate=zod.object({
      fullName:zod.string().nonempty('this field is required').min(3,"min length of char is 3 words").max(50,"max length of char is 50 words"),
      email:zod.string().nonempty('this field is required').regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ,"email must include @"),
      password:zod.string().nonempty('this field is requires').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
         "password must contain uppercase, lowercase, number, special character and be at least 8 characters",
      ),
      confirmPassword:zod.string().nonempty('this field is requires').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
         "password must contain uppercase, lowercase, number, special character and be at least 8 characters",
      ),
      phone:zod.string().nonempty('this field is required').regex(/^01[0125][0-9]{8}$/, "phone number is wrong"),
      age:zod.coerce.number().min(18,"you must be more than 18").max(30,"you must be smaller than 30"),
      gender:zod.enum(['Male','Female'],
        {message:'you must choose one'}
      ),
      university:zod.string().nonempty('this field is required').min(3,"min length of char is 3 words").max(50,"max length of char is 50 words"),
      graduationYear:zod.coerce.number(),
      track:zod.enum(['Frontend','Backend'],
        {message:'you must choose one',
          
        }
      ),
      cv:zod.any().optional(),
       portfolioLink:zod.string().optional(),
      linkedInProfile:zod.string().optional(),
        gitHubProfile:zod.string().optional()
     }).refine((passvalue)=>{if(passvalue.password === passvalue.confirmPassword) return true },
    {message:'password not match',
      path:['confirmPassword']
    }

  )

  const{register,formState,handleSubmit}=useForm({
    defaultValues:{
       fullName:'',
       email:'',
       password:'',
       confirmPassword:'',
       phone:'',
       age:undefined,
       gender:undefined,
       university:'',
       graduationYear:undefined,
       track:undefined,
       cv:undefined,
       portfolioLink:'',
       linkedInProfile:'',
       gitHubProfile:''
    },
    mode:"onBlur",
    resolver: zodResolver(schemaRegisterGraduate)
  })
 

  console.log(formState.errors)

  
async function onSubmit(data:any){
  setIsLoader(true)
const formData = new FormData();

formData.append("fullName", data.fullName);
formData.append("email", data.email);
formData.append("password", data.password);
formData.append("confirmPassword", data.confirmPassword);
formData.append("phone", data.phone);
formData.append("age", String(data.age));
formData.append("gender", data.gender);
formData.append("university", data.university);
formData.append("graduationYear",String(data.graduationYear));
formData.append("track", data.track);
if(data.cv?.[0]){formData.append("cv", data.cv[0]);}
formData.append("portfolioLink",data.portfolioLink );
formData.append("linkedInProfile",data.linkedInProfile );
formData.append("gitHubProfile",data.gitHubProfile );

try{

const resRegister = await axiosinstance.post("api/v1/auth/signup-grad",formData);
console.log(resRegister.data);
  toast.success("Account created successfully 🎉");
  navigate('/login')
}catch(error:any){
console.log(error.response?.data);
toast.error( error.response?.data?.message)
}finally{
  setIsLoader(false)
}
}


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
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

              {/* Personal Info */}
              <div>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                    {...register('fullName')}
                      type="text"
                      
                      placeholder="Ahmed Hassan"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
      


            {formState.errors.fullName && formState.touchedFields.fullName && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.fullName.message}</p>
             )}

             
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                    {...register('email')}
                  
                      placeholder="ahmed@example.com"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />     
                    
            {formState.errors.email && formState.touchedFields.email && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.email.message}</p>
             )}  
                            
 
                  </div>
                
                  {/* Passwords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#2E1A47] mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                      {...register('password')}
                        type="password"
            
                        placeholder="********"
                        className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                      />
                                 {formState.errors.password && formState.touchedFields.password && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.password.message}</p>
             )}  

                    </div>
                    <div>
                      <label className="block text-sm text-[#2E1A47] mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                      {...register('confirmPassword')}
                        type="password"
     
                        placeholder="********"
                        className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                      />
                      {formState.errors.confirmPassword && formState.touchedFields.confirmPassword && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.confirmPassword.message}</p>
             )}  

                    </div>
                  </div>

                  {/* Phone + Age + Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-[#2E1A47] mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                      {...register('phone')}
                        type="text"
                        placeholder="+20 100 000 0000"
                        className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                      />
        {formState.errors.phone && formState.touchedFields.phone && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.phone.message}</p>
             )}  
                    </div>
                    <div>
                      <label className="block text-sm text-[#2E1A47] mb-2">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                      {...register('age')}
                        type="number"    
                        placeholder="23"
                        className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                      />
{formState.errors.age && formState.touchedFields.age && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.age.message}</p>
             )} 
                    </div>
              <div>
                 <label className="block text-sm text-[#2E1A47] mb-2">
                  Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                     {...register("gender")}
                     className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                     >
    <option value="" disabled>
      Select Gender
    </option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>
{formState.errors.gender && formState.touchedFields.gender && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.gender.message}</p>
             )} 
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
                    {...register('university')}
                      type="text"
                      placeholder="Cairo University"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
{formState.errors.university && formState.touchedFields.university && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.university.message}</p>
             )} 
                  </div>
                  <div>
                    <label className="block text-sm text-[#2E1A47] mb-2">
                      Graduation Year <span className="text-red-500">*</span>
                    </label>
                    <input
                    {...register('graduationYear')}
                      type="text"
                      placeholder="2024"
                      className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                    />
{formState.errors.graduationYear && formState.touchedFields.graduationYear && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.graduationYear.message}</p>
             )} 
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
      <input
      {...register('track')}
        type="radio"
        name="track"
        value="Frontend"
        className="sr-only peer"
      />

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
 
      <input
         {...register('track')}
        type="radio"
        name="track"
        value="Backend"
        className="sr-only peer"
      />
      
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
{formState.errors.track && formState.touchedFields.track && ( 
             <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.track.message}</p>
             )} 
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
                  <input type="file"  className="hidden" {...register('cv')} />
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
                    {...register('portfolioLink')}
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
                        {...register('linkedInProfile')}
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
                               {...register('gitHubProfile')}
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
                  className="mt-1 accent-[#7c5cff]"
                />
                <p className="text-sm text-[#7b6ca8]">
                  I agree to BridgeUp's Terms and Conditions and Privacy Policy
                </p>
              </div>

              {/* Button */}
              <button type="submit" disabled={loader} className="w-full bg-[#6D4AFF] hover:bg-[#5c3df0] transition-all duration-300 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-xl">
                  {loader? <BeatLoader/> : " Create Account"}             
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