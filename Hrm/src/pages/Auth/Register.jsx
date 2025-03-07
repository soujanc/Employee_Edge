import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SlSocialGoogle, SlSocialFacebook } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FilledButton } from "../../components/FilledButton";
import { Input } from "@material-tailwind/react";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const schema = z.object({
    name: z.string().min(4, "Name must be at least 4 characters long").max(15, "Name must be at most 15 characters long"),
    phoneNumber: z.string().regex(/^\+?[0-9\s-]{3,}$/, "Invalid phone number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(20, "Password must be at most 20 characters long"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long").max(20, "Confirm password must be at most 20 characters long"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      setError('');
      await signup(data.email, data.password, data.name, data.phoneNumber); 
      navigate('/login');
    } catch (e) {
      console.error(e);
      setError('Failed to create an account');
    }
  };

  return (
    <>
    <section className=" bg-[#f7fbff] lg:pl-[320px]  mt-[60px] w-full h-screen items-center  px-4 md:px-4 p-6 lg:px-8">
          <div className="font-poppins    mt-4 mb-6 text-gray-900   leading-3  text-2xl font-bold  flex py-4 text-left w-full lg:pr-0">
            Register
      </div>
    <form onSubmit ={handleSubmit(onSubmit)}>
    <section className=" flex flex-col border py-6 border-stroke rounded-lg bg-white md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
    <div className="m-6">
        <img
        className=" object-fit w-[800px]"
          src="src/assets/img/login.jpg"
          alt="Sample image"
        />
      </div>
      <div className="p-[100px] w-[130%] sm:w-[130%] sm:p-[100px] lg:p-[60px] lg:w-[70%]">
        <div className="text-center text-title-sm md:text-left">
          <label className="mr-1">Sign in with</label>
          <button
            type="button"
            className="mx-1 h-9 w-9  rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_9px_-4px_#3b71ca]"
          >
            <SlSocialFacebook
              size={20}
              className="flex justify-center items-center w-full"
            />
          </button>
          <button
            type="button"
            className="inlne-block mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
          >
            <FaXTwitter
              size={20}
              className="flex justify-center items-center w-full"
            />
          </button>
          <button
            type="button"
            className="inlne-block mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
          >
            <SlSocialGoogle 
              size={20}
              className="flex justify-center items-center w-full"
            />
          </button>
        </div>
        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center font-medium text-slate-500">
            Or
          </p>
        </div>
        <div className="pb-4">
        <Input
          label="Name"
          id="Name"
          name="name"
          type="text"
          color="blue"
          {...register("name")}
        />
        {errors.name && <div className ="text-red-500 text-xs mt-1">{errors.name.message}</div>}
        </div>
        <div className="pb-4">
        <Input
          label="Email Address"
          id="email-address"
          name="email-address"
          type="email"
          color="blue"
          {...register("email")}
        />
        {errors.email && <div className ="text-red-500 text-xs mt-1">{errors.email.message}</div>}
        </div>
        <div className="pb-4">
        <Input
            label="Phone Number"
            id="Number"
            name="Phone Number"
            type="tel" // Change type to "tel"
            color="blue"
            {...register("phoneNumber")}
        />
        {errors.phoneNumber && <div className ="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</div>}
        </div>
        <div className="pb-4">
        <Input
          label="Password"
          id=" Password"
          name="Password"
          type="password"
          color="blue"
          {...register("password")}
        />
        {errors.password && <div className ="text-red-500 text-xs mt-1">{errors.password.message}</div>}
        </div>
        <div>
        <Input
          label="Confirm Password"
          id="Confoirm Password"
          name="Password"
          type="password"
          color="blue"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <div className ="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</div>}
        </div>
        {/* <div className="mt-4 flex justify-between font-medium text-sm">
        <TickButton label="I agree all statements in">
          <span className="text-blue-600">{"- "}terms of service</span>
          </TickButton>
          </div> */}
        <FilledButton label="Register"/>
      </div>
    </section>
    </form>
    </section>
    </>
  );
};
export default Register;