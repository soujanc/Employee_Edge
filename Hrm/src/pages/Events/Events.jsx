import React, { useState } from "react";
import { FilledButton } from "../../components/FilledButton";
import { CancelButton } from "../../components/CancelButton";
import { BiSolidTrashAlt } from "react-icons/bi";
import { Input, Select, Option, Textarea } from "@material-tailwind/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEvents } from "../../hooks/useEvents";
import { useProfile } from "../../hooks/useProfile";
import { Alert, Button } from "@material-tailwind/react";
import { FaCalendarAlt } from 'react-icons/fa';

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const eventSchema = z.object({
  title: z.string().min(3).max(50),
  startDate: z.coerce
    .date()
    .refine((data) => data >= startOfToday, {
      message: "Start date must be today or in the future",
    }),
  endDate: z.optional(z.string()),
});

const FullScreenCalendar = () => {
  const { profileData } = useProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
  });

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [showForm, setShowForm] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventColor, setEventColor] = useState("red");
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false); // Add this state
  const { events, addEvent, deleteEvent, loading, error } = useEvents();
  const [open, setOpen] = useState(false);


  // console.log(events);
  const daysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const firstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleAddEvent = () => {
    setShowForm(true);
  };

  
  const handleFormSubmit =  (data) => {
    setOpen(true);
  
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  
    const formattedStartDate = formatDate(data.startDate);
    const formattedEndDate = formatDate(data.endDate);
    const newEvent = {
      title: data.title,
      startDate: formattedStartDate,
      endDate: formattedEndDate || formattedStartDate,
      color: eventColor,
      description: eventDescription,
    };
    addEvent(newEvent);
  
    setShowForm(false);
    reset();
    setEventStartDate("");
    setEventEndDate("");
    setEventDescription("");
    setEventColor("red");
  
     
  };
  

  const isDateInRange = (date, start, end) => {
    return date >= start && date <= end;
  };

  const handleDateCellClick = (day) => {
    const clickedDate = new Date(year, month - 1, day + 1);
    const eventsOnDate = events.filter((event) => {
      const startDate = new Date(event.startDate);

      const endDate = event.endDate ? new Date(event.endDate) : startDate; // If no end date, consider start date as end date
      return (
        isDateInRange(clickedDate, startDate, endDate) || // Check if clicked date is within the event range
        clickedDate.toDateString() === startDate.toDateString() || // Check if cl icked date matches start date
        clickedDate.toDateString() === endDate.toDateString()
      ); // Check if clicked date matches end date
    });

    if (eventsOnDate.length > 0) {
      setSelectedDateEvents(eventsOnDate);
      setShowEventModal(true);
    } else {
      // console.log("No events on this date.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  // const onSubmit = (data) => {
  //   console.log(data)
  // }

  const handleDeleteEvent = (id) => {
    deleteEvent(id);
    const updatedSelectedDateEvents = selectedDateEvents.filter(
      (event) => event.id !== id
    );
    setSelectedDateEvents(updatedSelectedDateEvents);
    if (updatedSelectedDateEvents.length === 0) {
      setShowEventModal(false);
    }
  };
  return (
    <>
      <section
        className=" bg-[#f7fbff] font-poppins mt-[60px] h-fit items-center  px-4 md:px-4 p-6 lg:px-8"
      >
        <div className="font-poppins mt-2 mb-2 text-gray-900 leading-3 text-2xl font-bold flex items-center py-4 text-left w-full lg:pr-0">
        <div className=" h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] flex justify-center items-center">
          <FaCalendarAlt size={15} />
        </div>
        <span className="ml-2">Events</span>
      
          <Alert
            className="text-sm  absolute top-[0px] "
            open={open}
            color="blue"
            variant="gradient"
            onClose={() => setOpen(false)}
            animate={{
              mount: { y: 0 },
              unmount: { y: 100 },
            }}
          >
            Event added succesfully !
          </Alert>
        </div>
        {showForm && (
          <div className="  fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 mt-24 rounded-lg shadow-lg w-full md:max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add Event</h2>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="my-4">
                  <Input
                    type="text"
                    {...register("title")}
                    label="Event Title"
                    color="blue"
                    // onChange={(e) => setEventTitle(e.target.value)}
                  />
                  {errors.title && (
                    <div className="text-red-500 flex justify-items-start text-sm">
                      {errors.title.message}
                    </div>
                  )}
                </div>

                <div className="my-4">
                  <Input
                    type="date"
                    // value={eventStartDate}
                    // onChange={(e) => setEventStartDate(e.target.value)}
                    {...register("startDate")}
                    label="Start date"
                    color="blue"
                  />

                  {errors.startDate && (
                    <div className="text-red-500 flex justify-items-start text-sm">
                      {errors.startDate.message}
                    </div>
                  )}
                </div>
                <div className="my-4">
                  <Input
                    type="date"
                    label="End date(optional)"
                    {...register("endDate")}
                    // value={eventEndDate}
                    color="blue"
                    onChange={(e) => setEventEndDate(e.target.value)}
                  />
                  {errors.endDate && (
                    <div className="text-red-500 flex justify-items-start text-sm">
                      {errors.endDate.message}
                    </div>
                  )}
                </div>
                <div className="my-4">
                  <Select
                    value={eventColor}
                    label="Color"
                    color="blue"
                    //{...register("color")}
                    onChange={(e) => setEventColor(e)}
                  >
                    <Option value="red">Red</Option>
                    <Option value="purple">Purple</Option>
                    <Option value="green">Green</Option>
                    <Option value="blue">Blue</Option>
                    <Option value="orange">Orange</Option>
                    <Option value="gray">Gray</Option>
                  </Select>
                </div>
                <div className="my-4">
                  <Textarea
                    type="text"
                    value={eventDescription}
                    // {...register("description")}
                    onChange={(e) => setEventDescription(e.target.value)}
                    label="Event Description"
                    color="blue"
                  ></Textarea>
                  {errors.description && (
                    <div className="text-red-500 flex justify-items-start text-sm">
                      {errors.description.message}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <FilledButton label="Add Event" type="submit" />
                  <CancelButton
                    label="Cancel"
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full ">
          <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center">
            <div className="flex md:flex-row mb-2 ">
              <FilledButton label="Prev" onClick={handlePrevMonth} />
              <span className=" mt-4 mx-4 text-lg font-bold">
                {new Date(year, month - 1).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <FilledButton label="Next" onClick={handleNextMonth} />
            </div>
            {profileData.role !== "employee" && (
              <div className="md:mb-4 mb-2">
                <FilledButton label="Add Event" onClick={handleAddEvent} />
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 min-w-[650px]">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <div
                    key={index}
                    className="text-center font-semibold bg-gray-200 py-4 text-sm cursor-pointer"
                    // onClick={() => handleDateCellClick(index)}
                  >
                    {day}
                  </div>
                )
              )}

              {[...Array(firstDayOfMonth(year, month))].map((_, index) => (
                <div key={index}></div>
              ))}
              {[...Array(daysInMonth(year, month)).keys()].map((day) => {
                const currentDate = new Date(year, month - 1, day + 1);
                const dayEvents = events.filter((event) => {
                  const startDate = new Date(event.startDate);
                  const endDate = new Date(event.endDate);
                  return (
                    isDateInRange(currentDate, startDate, endDate) ||
                    currentDate.toDateString() === startDate.toDateString()
                  );
                });
                return (
                  <div
                    key={day}
                    className="text-center py-6 border border-gray-200 text-sm cursor-pointer"
                    onClick={() => handleDateCellClick(day)}
                  >
                    <span>{day + 1}</span>
                    <div className="mt-1">
                      {dayEvents.length > 3 ? (
                        <>
                          {dayEvents.slice(0, 3).map((event, index) => (
                            <div
                              key={index}
                              className={`p-1 mt-1 bg-${event.color}-500 text-white`}
                            >
                              {event.title}
                            </div>
                          ))}
                          <div
                            className="p-1 rounded-md text-blue-600 cursor-pointer"
                            onClick={() => handleMoreClick(dayEvents)}
                          >
                            + More
                          </div>
                        </>
                      ) : (
                        dayEvents.map((event, index) => (
                          <div
                            key={index}
                            className={`p-1 mt-1 bg-${event.color}-500 text-white`}
                          >
                            {event.title}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {showEventModal && (
          <div className="fixed inset-0 lg:pl-[320px] bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                Events for Selected Date
              </h2>
              <div>
                <table className="w-full">
                  <tbody>
                    {selectedDateEvents.map((event) => (
                      <tr key={event.id} className="border-b border-gray-200">
                        <td
                          className={`py-3 px-1 text-${event.color}-500 font-semibold`}
                        >
                          {event.title}
                        </td>
                        <td className="py-3 px-1 text-xs text-wrap">
                          {event.description}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-gray-500 text-xl hover:text-red-500 focus:outline-none"
                          >
                            <BiSolidTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2">
                <CancelButton
                  label="Close"
                  onClick={() => setShowEventModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
export default FullScreenCalendar;
