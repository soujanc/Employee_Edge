// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { SlSocialGoogle, SlSocialFacebook } from "react-icons/sl";
// import { FaXTwitter } from "react-icons/fa6";
// import { Input } from "@material-tailwind/react";
// import { useAuth } from "../../hooks/useAuth";
// import { FilledButton } from "../../components/FilledButton";
// import { TickButton } from "../../components/TickButton";

// const schema = z.object({
//   email: z
//     .string()
//     .email("Invalid email address")
//     .nonempty("Email field is required."),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters long.")
//     .nonempty("Password field is required."),
// });

// export function Login() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(schema),
//   });
//   const { login, googleSignIn, twitterSignIn } = useAuth();
//   const [customError, setCustomError] = useState("");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const navigate = useNavigate();
//   const onSubmit = async (data) => {
//     try {
//       setCustomError("");
//       await login(data.email, data.password);
//       navigate("/");
//     } catch (error) {
//       console.error(error);
//       if (error.response && error.response.status === 401) {
//         setCustomError("Email or password is incorrect.");
//       } else {
//         setCustomError("Incorrect email or password.");
//       }
//     }
//   };

//   return (
//     <>
//       <section className=" bg-[#f7fbff]  w-full h-screen items-center  px-4 md:px-4 p-6 lg:px-8">
//         {/* <------Form Section-------> */}
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <section className=" w-full flex justify-center font-poppins h-fit mt-[94px] bg-white shadow-default overflow-hidden py-[12px] border border-stroke rounded-lg  flex-col md:flex-row  space-y-10 md:space-y-0 md:space-x-16 items-center">
//             <div className="m-6">
//               <img
//                 className=" object-fit mx-h-[400px] max-w-[400px]"
//                 src="src/assets/img/login.jpg"
//                 alt="Sample image"
//               />
//             </div>
//             {/* <------Social Buttons--------> */}
//             <div className="p-[80px] w-[130%] sm:w-[120%] sm:p-[70px] lg:p-[60px] lg:max-w-[600px] ">
//               {/* <------Input Section starts------> */}
// <div className="pb-4 ">
//   <Input
//     label="Email Address"
//     id="email-address"
//     name="email-address"
//     type="email"
//     color="blue"
//     {...register("email")}
//   />
//   {errors.email && (
//     <div className="text-red-500 text-xs mt-1">
//       {errors.email.message}
//     </div>
//   )}
// </div>

//               <Input
//                 label="Password"
//                 id="password"
//                 name="password"
//                 type="password"
//                 color="blue"
//                 {...register("password")}
//               />
//               {errors.password && (
//                 <div className="text-red-500 text-xs mt-1">
//                   {errors.password.message}
//                 </div>
//               )}
//               {/* <------Forgot section------> */}
//               {customError && (
//                 <div className="error-message text-red-500 text-xs mt-1">
//                   {customError}
//                 </div>
//               )}
//               <div className="mt-4 flex justify-between font-medium text-sm">
//                 {/* <TickButton label="Remember Me"/> */}
//                 <a
//                   className="text-blue-600 hover:text-blue-700 text-sm hover:underline hover:underline-offset-4"
//                   onClick={() => {
//                     navigate("/forgetPass");
//                   }}
//                 >
//                   Forgot Password?
//                 </a>
//               </div>
//               <FilledButton
//                 label={isSubmitting ? "Loading..." : "Login"}
//                 disabled={isSubmitting}
//               />
//               {errors.root && (
//                 <div className="text-red-500">{errors.root.message}</div>
//               )}
//             </div>
//           </section>
//         </form>
//       </section>
//     </>
//   );
// }

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@material-tailwind/react";
import { useAuth } from "../../hooks/useAuth";
import Button2 from "../../components/button2";
import Log from "../../assets/img/Log.jpg";

const schema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email field is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .nonempty("Password field is required."),
});

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { login, currentUser, loading } = useAuth();
  const [customError, setCustomError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setCustomError("");
      await login(data.email, data.password);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setCustomError("Email or password is incorrect.");
      } else {
        setCustomError("Incorrect email or password.");
      }
    }
  };

  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/");
    }
  }, [loading, currentUser, navigate]);

  return (
    <section className="bg-blue-600 dark:bg-gray-900 h-screen flex items-center justify-center">
      <div className=" drop-shadow-2xl flex flex-row justify-evenly w-[400px] h-screen md:h-fit max-w-[900px] m-10 bg-gray-50 md:w-screen rounded-lg">
        <div
          className="hidden md:flex md:w-1/2 h-[500px] w-[500px] bg-cover bg-center rounded-l-lg"
          style={{ backgroundImage: `url(${Log})` }}
        ></div>
        <div className="flex items-center justify-center w-[500px] h-[500px] sm:p-2 relative">
          <div className="flex items-center flex-col px-[30px] md:px-[50px] p-2 md:p-4 w-full h-full justify-center">
            <h1 className="text-center mb-5 text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Login
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="pb-4">
                <Input
                  label="Email Address"
                  id="email-address"
                  name="email-address"
                  type="email"
                  color="blue"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                color="blue"
                {...register("password")}
              />
              {errors.password && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </div>
              )}
              {customError && (
                <div className="error-message text-red-500 text-xs mt-1">
                  {customError}
                </div>
              )}
              <div className="flex justify-center pt-3 font-medium text-sm p-3">
                <a
                  className="text-black hover:text-blue-400 text-sm hover:underline hover:underline-offset-4"
                  onClick={() => {
                    navigate("/forgetPass");
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              {/* <Button2
            label={isSubmitting ? "Loading..." : "Login"}
            disabled={isSubmitting}
            type="submit"
          /> */}
              <button className="w-full" type="submit">
                <a
                  type="submit"
                  href="#_"
                  class="relative w-full inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-white  rounded   bg-blue-600 group"
                >
                  <span class="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>

                  <span class="relative w-full text-center transition-colors duration-200 ease-in-out group-hover:text-white">
                    {isSubmitting ? "Loading..." : "Login"}
                  </span>
                </a>
              </button>
            </form>
            {errors.root && (
              <div className="text-red-500">{errors.root.message}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
