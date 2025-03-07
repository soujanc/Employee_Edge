import React, { useEffect } from "react";
import work from "../../assets/img/work2.jpg";
import { useNavigate } from "react-router-dom";

function GetStarted() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/login");
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${work})` }}
    >
      <div className="text-center text-white font-bold animation-target">
        <h1 className="text-7xl  font-bebas-neue  sm:text-5xl lg:text-7xl">
        
        </h1>
        <p className="mb-8 text-2xl sm:text-4xl lg:text-5xl">
          Join our community <br /> let's help you walk elegantly
        </p>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto sm:ml-0 sm:mr-0"
        onClick={handleButtonClick}
      >
      
      </button>
    </div>
  );
}

export default GetStarted;
