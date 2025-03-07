
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@material-tailwind/react";
// import { useAuth } from "../../hooks/useAuth";
// import Button2 from "../../components/button2";
// import employee3 from "../../assets/img/employee3.jpg";

// const schema = z.object({
//   email: z.string().email("Invalid email address").nonempty("Email field is required."),
//   password: z.string().min(8, "Password must be at least 8 characters long.").nonempty("Password field is required."),
// });

// export function Login() {
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
//     resolver: zodResolver(schema),
//   });
//   const { login, currentUser, loading } = useAuth();
//   const [customError, setCustomError] = useState("");
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {
//     try {
//       setCustomError("");
//       await login(data.email, data.password);
//     } catch (error) {
//       console.error(error);
//       if (error.response && error.response.status === 401) {
//         setCustomError("Email or password is incorrect.");
//       } else {
//         setCustomError("Incorrect email or password.");
//       }
//     }
//   };

//   useEffect(() => {
//     if (!loading && currentUser) {
//       navigate("/");
//     }
//   }, [loading, currentUser, navigate]);

//   return (
//     <section
//       className="bg-gray-50 dark:bg-gray-900 h-screen flex items-center justify-center"
//       style={{
//         backgroundImage: `url(${employee3})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         backgroundAttachment: "fixed",
//       }}
//     >
//       <div
//         className="w-full rounded-lg sm:max-w-md xl:p-0 p-4 mx-4"
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           border: "1px solid rgba(255, 255, 255, 0.2)",
//           boxShadow: `
//             0 4px 8px rgba(0, 0, 0, 0.1),
//             0 10px 20px rgba(0, 0, 0, 0.2)
//           `,
//           backdropFilter: "blur(5px)",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             top: "0",
//             left: "0",
//             width: "100%",
//             height: "100%",
//             background: "inherit",
//             filter: "blur(10px)",
//             zIndex: "-1",
//           }}
//         />
//         <div className="p-6 space-y-4 md:space-y-6 sm:p-8 relative">
//           <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//             Login
//           </h1>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 md:space-y-1">
//             <div className="pb-4">
//               <Input
//                 label="Email Address"
//                 id="email-address"
//                 name="email-address"
//                 type="email"
//                 color="blue"
//                 {...register("email")}
//               />
//               {errors.email && (
//                 <div className="text-red-500 text-xs mt-1">
//                   {errors.email.message}
//                 </div>
//               )}
//             </div>
//             <Input
//               label="Password"
//               id="password"
//               name="password"
//               type="password"
//               color="blue"
//               {...register("password")}
//             />
//             {errors.password && (
//               <div className="text-red-500 text-xs mt-1">
//                 {errors.password.message}
//               </div>
//             )}
//             {customError && (
//               <div className="error-message text-red-500 text-xs mt-1">
//                 {customError}
//               </div>
//             )}
//             <div className="flex justify-center pt-3 font-medium text-sm p-3">
//               <a
//                 className="text-black hover:text-white text-sm hover:underline hover:underline-offset-4"
//                 onClick={() => {
//                   navigate("/forgetPass");
//                 }}
//               >
//                 Forgot Password?
//               </a>
//             </div>
//             <Button2
//               label={isSubmitting ? "Loading..." : "Login"}
//               disabled={isSubmitting}
//               type="submit"
//             />
//           </form>
//           {errors.root && (
//             <div className="text-red-500">{errors.root.message}</div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Login;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@material-tailwind/react";
// import { useAuth } from "../../hooks/useAuth";
// import Button2 from "../../components/button2";
// import doodle1 from "../../assets/img/doodle1.jpg";

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
//   const { login, currentUser, loading } = useAuth();
//   const [customError, setCustomError] = useState("");
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {
//     try {
//       setCustomError("");
//       await login(data.email, data.password);
//     } catch (error) {
//       console.error(error);
//       if (error.response && error.response.status === 401) {
//         setCustomError("Email or password is incorrect.");
//       } else {
//         setCustomError("Incorrect email or password.");
//       }
//     }
//   };

//   useEffect(() => {
//     if (!loading && currentUser) {
//       navigate("/");
//     }
//   }, [loading, currentUser, navigate]);

//   return (
//     <section
//       className="bg-gray-50 dark:bg-gray-900 h-screen flex items-center justify-center"
//       style={{
//         backgroundImage: `url(${doodle1})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         backgroundAttachment: "fixed",
//       }}
//     >
//       <div
//         className=" bg-gray-50 w-full rounded-lg sm:max-w-md xl:p-0 p-4 mx-4"
//     //     style={{
//     //       marginTop: "50px",
//     //       // backgroundColor: "rgba(0, 0, 0, 0.1)", // Adjust the alpha value for transparency
//     //       border: "1px solid rgba(255, 255, 255, 0.2)",
//     //       boxShadow: `
//     //   0 4px 8px rgba(0, 0, 0, 0.1),
//     //   0 10px 20px rgba(0, 0, 0, 0.1)
//     // `,
//     //       backdropFilter: "blur(5px)",
//     //       position: "relative",
//     //       overflow: "hidden",
//     //     }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             top: "0",
//             left: "0",
//             width: "100%",
//             height: "100%",
//             background: "inherit",
//             filter: "blur(3px)",
//             zIndex: "-1",
//           }}
//         />
//         <div className="p-6 space-y-4 md:space-y-6 sm:p-8 relative">
//           <h1 className="text-center text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//           Login Form
//           </h1>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="space-y-1 md:space-y-1"
//           >
//             <div className="pb-4">
//               <Input
//                 label="Email Address"
//                 id="email-address"
//                 name="email-address"
//                 type="email"
//                 color="white"
//                 {...register("email")}
//               />
//               {errors.email && (
//                 <div className="text-red-500 text-xs mt-1">
//                   {errors.email.message}
//                 </div>
//               )}
//             </div>
//             <Input
//               label="Password"
//               id="password"
//               name="password"
//               type="password"
//               color="white"
//               {...register("password")}
//             />
//             {errors.password && (
//               <div className="text-red-500 text-xs mt-1">
//                 {errors.password.message}
//               </div>
//             )}
//             {customError && (
//               <div className="error-message text-red-500 text-xs mt-1">
//                 {customError}
//               </div>
//             )}
//             <div className="flex justify-center pt-3 font-medium text-sm p-3">
//               <a
//                 className="text-black hover:text-white text-sm hover:underline hover:underline-offset-4"
//                 onClick={() => {
//                   navigate("/forgetPass");
//                 }}
//               >
//                 Forgot Password?
//               </a>
//             </div>
//             <Button2
//               label={isSubmitting ? "Loading..." : "Login"}
//               disabled={isSubmitting}
//               type="submit"
//             />
//           </form>
//           {errors.root && (
//             <div className="text-red-500">{errors.root.message}</div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Login;