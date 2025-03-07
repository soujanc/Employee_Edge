import React, { useEffect } from "react";
import CardDataStats from "../../components/CardDataStats";
import ChartOne from "../../components/ChartOne";
import ChartThree from "../../components/ChartThree";
import { useEmployee } from "../../hooks/useEmployee";
import { MdPeopleAlt } from "react-icons/md";
import { GiCash } from "react-icons/gi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaComputerMouse } from "react-icons/fa6";
import { useProfile } from "../../hooks/useProfile";
import { FaHandshake } from "react-icons/fa";
import { MdEmojiPeople } from "react-icons/md";
import { IoHomeSharp } from "react-icons/io5";
export default function Herosection() {
  const { numberOfEmployees, totalSalary, averageSalary } = useEmployee();
  const { profileData } = useProfile();

  function formatIndianCurrency(num) {
    return num.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  }

  const formattedTotalSalary = formatIndianCurrency(totalSalary);
  const formattedAverageSalary = formatIndianCurrency(averageSalary);

  return (
    <section className="flex flex-1 no-scrollbar flex-col bg-[#f7fbff]  mt-[60px] w-full items-center justify-between px-4 md:px-6 p-6 lg:px-8">
      <div className="font-poppins mt-2 text-gray-900 leading-3 text-2xl font-bold flex items-center py-4 text-left w-full lg:pr-0">
        <div className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] flex justify-center items-center">
          <IoHomeSharp size={17} /> 
        </div>
        <span className="ml-2">Dashboard</span> 
      </div>
      <div className="w-full no-scrollbar lg:pr-0  py-[12px] grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 ">
        <CardDataStats title="Total Employees" total={numberOfEmployees}>
          <MdPeopleAlt className="text-lg text-blue-700"></MdPeopleAlt>
        </CardDataStats>

        {profileData.role === "employee" ? (
          <CardDataStats title="Consumers" total="15+">
            <MdEmojiPeople className="text-xl text-blue-700" />
          </CardDataStats>
        ) : profileData.role === "admin" ? (
          <CardDataStats title="Total Salary" total={formattedTotalSalary}>
            <GiCash className="text-xl text-blue-700" />
          </CardDataStats>
        ) : null}

        {profileData.role === "employee" ? (
          <CardDataStats title="cooperations" total="1+ Years">
            <FaHandshake className="text-xl text-blue-700" />
          </CardDataStats>
        ) : profileData.role === "admin" ? (
          <CardDataStats title="Average salary" total={formattedAverageSalary}>
            <FaIndianRupeeSign className="text-lg text-blue-700" />
          </CardDataStats>
        ) : null}

        <CardDataStats title="No.of Projects" total="25+">
          <FaComputerMouse className="text-lg text-blue-700"></FaComputerMouse>
        </CardDataStats>
      </div>
      <div className="w-full no-scrollbar py-[12px] grid lg:grid-cols-2  grid-cols-1 lg:pr-0 gap-6 ">
        <div className="   bg-white shadow-default  border border-stroke rounded-lg py-14 lg:py-10 px-6 border-bg-gray-200 ">
          <ChartOne />
        </div>
        <div className=" bg-white shadow-default   border border-stroke rounded-lg py-14 lg:py-10 px-6 border-bg-gray-200   ">
          <ChartThree />
        </div>
      </div>
    </section>
  );
}
