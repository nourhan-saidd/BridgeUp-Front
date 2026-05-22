import React, { useState } from "react";
import registerImg from "../../../public/registercompany.gif";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { toast } from "sonner";
import { BeatLoader } from "react-spinners";
export default function RegisterCompany() {


  const navigate=useNavigate();

  const[loader,setIsLoading]=useState(false);
 
  const SchemaRegisterCompany = zod.object({
    companyName: zod.string().nonempty('this field is required').min(3, "min length is 3").max(50, "max length is 50"),
    email: zod.string().nonempty("this field is required").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "email must include @"),
    password: zod.string().nonempty("this field is required").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password must contain uppercase, lowercase, number, special character and be at least 8 characters"),
    confirmPassword: zod.string().nonempty("this field is required").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password must contain uppercase, lowercase, number, special character and be at least 8 characters"),
    phone: zod.string().nonempty("this field is required").regex(/^01[0125][0-9]{8}$/, "phone must be valid"),
    industry: zod.string().nonempty("this field is required").min(3, "min length is 3").max(20, "max length is 20"),
    description: zod.string().nonempty("this field is required").min(5, "min length is 5").max(200, "max length is 200"),
    commercialRegister: zod.any().refine((files) => files?.length === 1, { message: "commercial is required" }),
    taxCard: zod.any().refine((files) => files?.length === 1, { message: 'Tax card is required' }),
    agtreeTerms: zod.boolean().refine((val) => val === true, { message: "You must agree to the terms" })
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'password and confirm password do not match',
    path: ['confirmPassword']
  });

  const { register, handleSubmit, formState } = useForm({
    mode: 'onBlur',
    defaultValues: {
      companyName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      industry: '',
      description: '',
      commercialRegister: undefined,
      taxCard: undefined,
      agtreeTerms: false
    },
    resolver: zodResolver(SchemaRegisterCompany)
  });

  async function onSubmit(data: any) {
     setIsLoading(true)
    const formdata = new FormData();
    formdata.append("companyName", data.companyName);
    formdata.append("email", data.email);
    formdata.append("password", data.password);
    formdata.append("confirmPassword", data.confirmPassword);
    formdata.append("phone", data.phone);
    formdata.append("industry", data.industry);
    formdata.append("description", data.description);
    
    if (data.commercialRegister?.[0]) { formdata.append("commercialRegister", data.commercialRegister?.[0]); }
    if (data.taxCard?.[0]) { formdata.append("taxCard", data.taxCard?.[0]); }
    
    try {
      const resRegister = await axiosinstance.post('api/v1/auth/signup-comp', formdata);
      navigate('/login')  
      toast.success(resRegister.data?.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }finally{
      setIsLoading(false)
    }
  }

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
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm text-[#2E1A47] mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("companyName")}
                  type="text"
                  placeholder="TechCorp Egypt"
                  className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                />
                {formState.errors.companyName && formState.touchedFields.companyName && (
                  <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.companyName?.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-[#2E1A47] mb-2">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="hr@company.com"
                  className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                />
                {formState.errors.email && formState.touchedFields.email && (
                  <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.email?.message}</p>
                )}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#2E1A47] mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="********"
                    className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                  />
                  {formState.errors.password && formState.touchedFields.password && (
                    <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.password?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#2E1A47] mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="********"
                    className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                  />
                  {formState.errors.confirmPassword && formState.touchedFields.confirmPassword && (
                    <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.confirmPassword?.message}</p>
                  )}
                </div>
              </div>

              {/* Phone + Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#2E1A47] mb-2">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("phone")}
                    type="text"
                    placeholder="+20 1000 000 000"
                    className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                  />
                  {formState.errors.phone && formState.touchedFields.phone && (
                    <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.phone?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#2E1A47] mb-2">
                    Field (Industry) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("industry")}
                    type="text"
                    placeholder="Software Company"
                    className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                  />
                  {formState.errors.industry && formState.touchedFields.industry && (
                    <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.industry?.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-[#2E1A47] mb-2">
                  Company Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={5}
                  placeholder="Tell us about your company..."
                  className="w-full border border-[#d9cdf7] rounded-xl px-4 py-3 outline-none resize-none bg-[#faf8ff] focus:ring-2 focus:ring-[#7c5cff]"
                ></textarea>
                {formState.errors.description && formState.touchedFields.description && (
                  <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.description?.message}</p>
                )}
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
                  <p className="text-sm font-medium text-[#6D4AFF]">Upload Commercial Register</p>
                  <p className="text-xs text-[#8b7bb8] mt-1">PDF, JPG, PNG (Max 10MB)</p>
                  <input {...register("commercialRegister")} type="file" className="hidden" />
                </label>
                {formState.errors.commercialRegister && (
                  <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.commercialRegister?.message as string}</p>
                )}
              </div>

              {/* Tax Card */}
              <div>
                <label className="block text-sm text-[#2E1A47] mb-2">
                  Tax Card <span className="text-red-500">*</span>
                </label>
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-[#d9cdf7] rounded-2xl cursor-pointer bg-[#faf8ff] hover:bg-[#f4efff] transition">
                  <p className="text-sm font-medium text-[#6D4AFF]">Upload Tax Card</p>
                  <p className="text-xs text-[#8b7bb8] mt-1">PDF, JPG, PNG (Max 10MB)</p>
                  <input {...register("taxCard")} type="file" className="hidden" />
                </label>
                {formState.errors.taxCard && (
                  <p className="bg-red-500 text-white rounded-xl mt-2 p-2 text-center">{formState.errors.taxCard?.message as string}</p>
                )}
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3">
              <input
                {...register("agtreeTerms")}
                type="checkbox"
                className="mt-1 accent-[#7c5cff]"
              />
              <p className="text-sm text-[#7b6ca8]">
                I confirm that all information provided is accurate and I agree to{" "}
                <span className="text-[#5a3ec8] font-bold">BridgeUp's Terms and Conditions</span> and{" "}
                <span className="text-[#5a3ec8] font-bold">Privacy Policy</span>.
              </p>
            </div>
            
            {formState.errors.agtreeTerms && (
              <p className="bg-red-500 text-white rounded-xl p-2 text-center text-sm">{formState.errors.agtreeTerms?.message}</p>
            )}

            {/* Note */}
            <div className="bg-[#eee6ff] border border-[#cdbdff] rounded-2xl p-4">
              <p className="text-sm font-medium text-[#5a3ec8]">
                <span className="text-black font-bold">Note</span>: Your account will be reviewed by our admin team. You'll receive an email once approved.
              </p>
            </div>

            {/* Button */}
            <button type="submit" disabled={loader} className="w-full bg-[#6D4AFF] hover:bg-[#5c3df0] transition-all duration-300 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-xl">
           {loader? <BeatLoader/> :   " Submit for Review"}
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