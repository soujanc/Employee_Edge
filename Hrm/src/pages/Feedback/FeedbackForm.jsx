import React, { useRef, useState } from "react";
import { MdOutlineMessage } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Input, Textarea } from "@material-tailwind/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { useProfile } from "../../hooks/useProfile";
import { Alert, Button } from "@material-tailwind/react";
import { FaLinkedinIn } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FaComments } from 'react-icons/fa';


function Feedback() {
  const form = useRef();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const schema = z.object({
    user_firstname: z.string().min(4).max(15),
    user_lastname: z.string(),
    user_phone: z.string().regex(/^\+?[0-9\s-]{3,}$/),
    user_email: z.string().email(),
    subject: z.string(),
    message: z.string().min(5),
  });
  const { profileData, updateProfileImage, updateProfileData, loading, error } =
    useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendEmail = (data) => {
    // console.log(data, "      ", form.current);
    emailjs
      .sendForm(
        "service_pyyy5so",
        "template_waydgus",
        form.current,
        "HVOfZlLmn9z-ZZFDG"
      )
      .then(
        () => {
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 3000);

          setErrorMessage("");
        },
        (error) => {
          setErrorMessage(
            "Failed to send your message. Please try again later."
          );
          setSuccessMessage("");
        }
      );
  };

  const onSubmit = async (data) => {
    await sendEmail(data);
    reset();
  };

  const handleGoogleRedirect = () => {
    window.location.href = "https://nicozn.com/";
  };

  const handleLinkedInRedirect = () => {
    window.location.href =
      "https://www.linkedin.com/company/nicozn/mycompany/verification/";
  };

  const handleInstaRedirect = () => {
    window.location.href =
      "https://www.instagram.com/nicozn_tech/?igshid=MzRlODBiNWFlZA%3D%3D";
  };

  return (
    <section className="bg-[#f7fbff] mt-[60px] w-full h-screen items-center px-4 md:px-4 p-6 lg:px-8">
      <div className="font-poppins mt-2 mb-2 text-gray-900 leading-3 text-2xl font-bold flex items-center py-4 text-left w-full lg:pr-0">
        <div className=" h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] flex justify-center items-center">
          <FaComments size={17} />
        </div>
        <span className="ml-2">Feedback</span>
      
        <Alert
          className="text-sm  absolute top-[-10px] "
          open={open}
          color="blue"
          variant="gradient"
          onClose={() => setOpen(false)}
          animate={{
            mount: { y: 0 },
            unmount: { y: 100 },
          }}
        >
          Your message has been sent successfully! !
        </Alert>
      </div>
      <div className="bg-[#f7fbff] font-poppins max-h-screen">
        <div className="bg-white w-full grid lg:grid-cols-3 items-center gap-4 p-2 shadow-default border border-stroke rounded-lg">
          <div className="bg-gray-100 rounded-lg p-6 max-lg:text-center">
            <h2 className="text-xl font-bold text-black">
              Contact Information
            </h2>
            <p className="text-sm text-black mt-3">
              Have some big idea or brand to develop and need help?
            </p>
            <ul className="mt-16 space-y-10">
              <li className="flex items-center max-lg:justify-center">
                <MdOutlineMessage />
                <a className="text-black text-sm ml-1">company@nicozn.com</a>
              </li>
              <li className="flex items-center max-lg:justify-center">
                <LuPhone />
                <a className="text-black text-sm ml-1">+91 9364011711</a>
              </li>
              <li className="flex items-center max-lg:justify-center">
                <GrLocation />
                <a className="text-black text-sm ml-1">
                  Nicozn Technologies, Mangaluru.
                </a>
              </li>
            </ul>
            <ul className="flex max-lg:justify-center mt-10 space-x-4">
              <div className="text-center md:text-left">
                <button
                  type="button"
                  className="mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_9px_-4px_#3b71ca]"
                  onClick={handleInstaRedirect}
                >
                  <GrInstagram
                    size={20}
                    className="flex justify-center items-center w-full"
                  />
                </button>
                <button
                  type="button"
                  className="inline-block mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
                  onClick={handleLinkedInRedirect}
                >
                  <FaLinkedinIn
                    size={20}
                    className="flex justify-center items-center w-full"
                  />
                </button>
                <button
                  type="button"
                  className="inline-block mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
                  onClick={handleGoogleRedirect}
                >
                  <FaGoogle
                    size={20}
                    className="flex justify-center items-center w-full"
                  />
                </button>
              </div>
            </ul>
          </div>
          <div className="p-2 rounded-xl lg:col-span-2">
            <form ref={form} onSubmit={handleSubmit(onSubmit)}>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <Input
                    label="First Name"
                    type="text"
                    color="blue"
                    name="user_firstname"
                    value={profileData.personalInfo.firstName}
                    {...register("user_firstname")}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <Input
                  label="Last Name"
                  type="text"
                  color="blue"
                  name="user_lastname"
                  value={profileData.personalInfo.lastName}
                  {...register("user_lastname")}
                />
                <div className="flex flex-col">
                  <Input
                    label="Phone Number"
                    type="text"
                    color="blue"
                    name="user_phone"
                    value={profileData.personalInfo.phone}
                    {...register("user_phone")}
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.phoneNumber.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <Input
                    label="Email"
                    type="email"
                    color="blue"
                    name="user_email"
                    value={profileData.personalInfo.email}
                    {...register("user_email")}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <Input
                  label="Subject"
                  placeholder="What issue/Suggestion do you have?"
                  type="text"
                  color="blue"
                  name="subject"
                  {...register("subject")}
                />
                <div className="flex flex-col">
                  <Textarea
                    label="Write Message"
                    className="w-full p-3 border rounded flex justify-center"
                    color="blue"
                    name="message"
                    {...register("message")}
                  />
                  {errors.message && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.message.message}
                    </span>
                  )}
                </div>
              </div>
              {successMessage && (
                <p className="text-green-500 mt-4">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-red-500 mt-4">{errorMessage}</p>
              )}
              <button
                type="submit"
                className="mt-12 flex items-center justify-center text-sm lg:ml-auto max-lg:w-full rounded px-4 py-2.5 font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Feedback;
