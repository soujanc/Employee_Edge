// src/components/AttendancePage.js
import React, { useState } from 'react';
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import useAttendance from '../../hooks/useAttendance';
import { FaRegCalendarCheck } from 'react-icons/fa';

const AttendancePage = () => {
  const { employees,attendanceData, loading, markAttendance } = useAttendance();
  // console.log(attendanceData);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month +1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleAttendanceClick = (employeeId, employeeName, day) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day,12);
    // console.log(date)
    const dateString = formatDateString(date);
    // console.log(dateString)
    let status;
    switch (attendanceData[employeeId]?.[dateString]) {
      case 'present':
        status = 'half-day';
        break;
      case 'half-day':
        status = 'absent';
        break;
      default:
        status = 'present';
    }
    markAttendance(employeeId, employeeName, dateString, status);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i+1 );
    const today = new Date();
    if (loading) return <div>Loading...</div>;

    return (
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              
              <th className="px-4 py-2 sticky left-0 bg-white "></th>
              {days.map((day) => (
                <th key={day} className="px-4 py-2 text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className='py-4'>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-4 py-2 font-medium whitespace-nowrap sticky left-0 bg-white ">{employee.personalInfo.firstName + " "+employee.personalInfo.lastName}</td>
                {days.map((day) => {
                  const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day,12);
                  const dateString =  formatDateString(date);
                  const isPastDate = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  return (
                    <td key={day} className={`px-4 py-2 ${day === 0 ? 'text-gray-500' : ''}`}>
                      <button
                        className={`rounded-full h-6 w-6 ${
                          attendanceData[employee.id]?.[dateString] === 'present' ? 'text-green-500' :
                          attendanceData[employee.id]?.[dateString] === 'half-day' ? 'text-yellow-500' : 
                          attendanceData[employee.id]?.[dateString] === 'absent' ? 'text-red-500' : 'bg-gray-200'
                        }`}
                        onClick={() => handleAttendanceClick(employee.id, employee.personalInfo.firstName+" "+employee.personalInfo.lastName, day)}
                        disabled={isPastDate}
                      >
                        {attendanceData[employee.id]?.[dateString] === 'present' && <FaRegCheckCircle />}
                        {attendanceData[employee.id]?.[dateString] === 'absent' && <FaRegTimesCircle />}
                        {attendanceData[employee.id]?.[dateString] === 'half-day' && <AiOutlineClockCircle />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
  };

  return (
    <section className=" bg-[#f7fbff] mt-[60px] w-full lg:max-w-[1230px] md:w-screen sm:h-screen items-center px-4 md:px-4 p-6 lg:px-8">
      <div className='max-h-screen'>
      <div className="font-poppins mt-2 mb-2 text-gray-900 leading-3 text-2xl font-bold flex items-center py-4 text-left w-full lg:pr-0">
        <div className=" h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] flex justify-center items-center">
          <FaRegCalendarCheck size={17} />
        </div>
        <span className="ml-2">Attendance </span>
        </div>
        <div className="font-poppins border shadow-default border-stroke rounded-lg bg-white p-4 md:p-8">
          <div className="flex justify-left mb-4">
            <div className="flex items-center">
              <FaRegCheckCircle className="text-green-500 mr-2" />
              <span>Full Day Present</span>
            </div>
            <div className="flex items-center">
              <AiOutlineClockCircle className="text-yellow-500 mr-2" />
              <span>Half Day Present</span>
            </div>
            <div className="flex items-center">
              <FaRegTimesCircle className="text-red-500 mr-2" />
              <span>Full Day Absent</span>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <button className="text-blue-500" onClick={handlePrevMonth}>&lt; Prev Month</button>
            <div>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
            <button className="text-blue-500" onClick={handleNextMonth}>Next Month &gt;</button>
          </div>
          {renderCalendar()}
        </div>
      </div>
    </section>
  );
};

export default AttendancePage;



