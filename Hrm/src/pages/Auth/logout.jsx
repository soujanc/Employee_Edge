import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault(); 
    navigate("/");// Prevents default form submission behavior
    console.log("Cancelled");
  };

  return (
    <section className="bg-[#f7fbff] w-full h-screen flex items-center justify-center px-4 md:px-4 p-6 lg:px-8">
      <div className="font-poppins max-w-lg w-full mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300 flex flex-col items-center justify-center">
       
          <h2 className="text-xl font-semibold mb-4 text-center">
            Logout Confirmation
          </h2>
          <p className="text-gray-700 text-center mb-6">
            Are you sure you want to logout?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      
    </section>
  );
};

export default Logout;
