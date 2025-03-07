import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilledButton } from "../../components/FilledButton";
import employee3 from "../../assets/img/employee3.jpg";
import book2 from "../../assets/img/book2.jpg";

const NewPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 2000); // Redirect after 3 seconds
  };

  return (
    <section
      className="bg-blue-600 dark:bg-gray-900 h-screen flex items-center justify-center"
    
    >
      <div className="font-poppins max-w-lg w-full mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mb-3.5">
          <div className="w-12 h-12 rounded-full bg-green-100 p-2 flex items-center justify-center">
            <svg
              className="w-8 h-8  text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <p className=" mt-5text-center mb-4 text-lg  text-gray-900">
          Mail Sent Successfully!!
          </p>
        </div>
        {loading ? (<div
          className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider cursor-pointer">
            Loading...
          </div>
        ) : (
          <div className="flex justify-center"> {/* Centering the button */}
            <FilledButton onClick={handleContinue} label="Continue" />
          </div>
        )}
      </div>
    </section>
  );
};

export default NewPassword;
