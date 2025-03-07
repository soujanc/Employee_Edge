import React, { useState } from "react";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FilledButton } from "../../components/FilledButton";
import { CancelButton } from "../../components/CancelButton";
import { Input, Select, Option, Textarea } from "@material-tailwind/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLeave } from "../../hooks/useLeave";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Alert, Button } from "@material-tailwind/react";
import { FaFileAlt } from 'react-icons/fa';

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const schema = z.object({
  dateFrom: z.coerce.date().refine((data) => data >= startOfToday, {
    message: "Start date must be in the future",
  }),
  dateTo: z.coerce.date().refine((data) => data >= startOfToday, {
    message: "End date must be in the future",
  }),
  reason: z.string().min(1),
});

const EmployeeRow = ({ employee, onAction, userRole, onEdit, onDelete }) => {
  return (
    <tr className="border-b text-sm text-center">
      <td className="px-2 py-2 md:px-4 md:py-2">
        <img
          src={employee.profilePicture}
          alt="Profile"
          className=" w-8 h-8 md:w-10 md:h-10 rounded-full mx-auto"
        />
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        {employee.name}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        {employee.Leave_Type}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        {employee.dateFrom}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        {employee.dateTo}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        {employee.Reason}
      </td>
      {userRole === "admin" && (
        <td className="px-5 py-2 whitespace-nowrap text-center">
          <div className="flex justify-center">
            <button
              className={`text-white font-bold py-2 px-2 rounded mr-2 ${
                employee.status === "accepted"
                  ? "bg-green-500 cursor-not-allowed "
                  : employee.status === "rejected"
                  ? "bg-green-400 cursor-not-allowed opacity-50"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={() => onAction("accept", employee.id)}
              disabled={employee.status === "accepted"}
            >
              <RiCheckboxCircleLine size={21} />
            </button>

            <button
              className={`text-white font-bold py-2 px-2 rounded ${
                employee.status === "rejected"
                  ? "bg-red-500 cursor-not-allowed "
                  : employee.status === "accepted"
                  ? "bg-red-400 cursor-not-allowed opacity-50"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={() => onAction("reject", employee.id)}
              disabled={employee.status === "rejected"}
            >
              <TiDeleteOutline size={21} />
            </button>
          </div>
        </td>
      )}
      <td
        className={`px-4 py-2 whitespace-nowrap text-center ${
          employee.status === "accepted"
            ? "text-green-500"
            : employee.status === "rejected"
            ? "text-red-500"
            : ""
        }`}
      >
        {employee.status}
      </td>
      {userRole !== "admin" && employee.status === "pending" && (
        <td className="px-4 py-2 whitespace-nowrap text-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => {
              onEdit(employee);
            }}
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => onDelete(employee.id)}
          >
            <MdDelete />
          </button>
        </td>
      )}
    </tr>
  );
};

export default function LeaveRequest() {
  const {
    state,
    addLeave,
    updateLeaveStatus,
    deleteLeave,
    updateLeave,
    fetchCurrentUserData,
    userRole,
  } = useLeave();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [editEmployeeData, setEditEmployeeData] = useState(null);
  const [leave, setLeave] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [open, setOpen] = useState(false);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  
  //sorting
  const sortedEmployees = [...state.employees].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const currentEmployees = sortedEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const addNewData = async (data) => {
    if (!isSubmitting) {
      const { dateFrom, dateTo, reason } = data;
      const formattedDateFrom = formatDate(dateFrom);
      const formattedDateTo = formatDate(dateTo);

      const { userData, userId } = await fetchCurrentUserData();
      if (userData) {
        const newEmployee = {
          userID: userId,
          name: `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`,
          profilePicture: userData.personalInfo.photo,
          Leave_Type: leave,
          dateFrom: formattedDateFrom,
          dateTo: formattedDateTo,
          Reason: reason,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        await addLeave(newEmployee);
        setShowForm(false);
        reset();
        setmessage("Leave Request Added Succesfully!");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 3000);
      }
    }
  };

  const handleAction = (action, id) => {
    setModalAction(action);
    setCurrentEmployeeId(id);
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (modalAction === "accept") {
      await updateLeaveStatus(currentEmployeeId, "accepted");
    } else if (modalAction === "reject") {
      await updateLeaveStatus(currentEmployeeId, "rejected");
    }
    setIsModalOpen(false);
    // Optionally, refresh employee data or force re-render
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Function to handle edit button click
  const handleEdit = (employee) => {
    if (employee.status === "pending") setEditEmployeeData(employee);
    // console.log(employee); // Set employee data for editing
    setShowEditForm(true);
  };
  // Function to handle update of leave request
  const handleUpdate = () => {
    if (!isSubmitting) {
      // console.log(editEmployeeData);
      updateLeave(editEmployeeData.id, editEmployeeData);
      setShowEditForm(false); // Hide edit form after update
      setEditEmployeeData(null); // Clear edit employee data
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      await deleteLeave(id);
    }
  };
  const handleChange = (value, name) => {
    
    setEditEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <section className="bg-[#f7fbff] mt-[60px] max-w-[1230px]  w-screen h-fit md:h-screen items-center px-4 md:px-4 p-6 lg:px-8">
      <div className="max-h-screen">
      <div className="font-poppins mt-2 mb-2 text-gray-900 leading-3 text-2xl font-bold flex items-center py-4 text-left w-full lg:pr-0">
        <div className=" h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] flex justify-center items-center">
          <FaFileAlt size={17} />
        </div>
        <span className="ml-2">Leave Request</span>
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
        <div className="font-poppins border shadow-default border-stroke rounded-lg bg-white p-4 md:p-8">
          <div className="flex justify-end items-center mb-4">
            <FilledButton
              onClick={() => setShowForm(true)}
              label="Add Leave Request"
            ></FilledButton>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit(addNewData)}>
              <div className="absolute top-1/2 left-[56%] transform -translate-x-1/2 -translate-y-1/3 bg-white bg-opacity-90 p-6 rounded shadow-lg z-10">
                <h3 className="text-lg font-semibold mb-2 text-left">
                  Add Leave Request
                </h3>
                <div className="flex flex-col mb-4">
                  <Select
                    label="Leave Type"
                    color="blue"
                    className="border p-2 rounded"
                    onChange={(e) => setLeave(e)}
                  >
                    <Option value="">Select Leave Type</Option>
                    <Option value="Casual Leave">Casual Leave</Option>
                    <Option value="Medical Leave">Medical Leave</Option>
                    <Option value="Maternity Leave">Maternity Leave</Option>
                  </Select>
                </div>
                <div className="flex mb-4">
                  <div className="flex flex-col mr-4">
                    <Input
                      type="date"
                      className="border p-2 rounded"
                      {...register("dateFrom")}
                      color="blue"
                      label="From"
                    />
                    {errors.dateFrom && (
                      <span className="text-red-500 text-xs">
                        Please enter the correct date
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Input
                      type="date"
                      className="border p-2 rounded"
                      {...register("dateTo")}
                      color="blue"
                      label="To"
                    />
                    {errors.dateTo && (
                      <span className="text-red-500 text-xs">
                        Please enter the correct date
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <Textarea
                    label="Reason"
                    color="blue"
                    className="border p-2 rounded"
                    rows={3}
                    {...register("reason", { required: true })}
                  ></Textarea>
                  {errors.reason && (
                    <span className="text-red-500 text-xs">
                      Please provide a reason
                    </span>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <FilledButton label="Add" type="submit"></FilledButton>
                  <CancelButton
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                    label="Cancel"
                  ></CancelButton>
                </div>
              </div>
            </form>
          )}
          {showEditForm && editEmployeeData && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
              <form
                className="bg-white p-8 rounded shadow-lg w-96"
                
              >
                <h3 className="text-lg font-semibold mb-2 text-left">
                  Edit Leave Request
                </h3>
                <div className="flex flex-col mb-4">
                  <Select
                    label="Leave Type"
                    color="blue"
                    name="Leave_Type"
                    className="border p-2 rounded"
                    value={editEmployeeData.Leave_Type}
                    onChange={(value) => handleChange(value, "Leave_Type")}
                  >
                    <Option value="">Select Leave Type</Option>
                    <Option value="Casual Leave">Casual Leave</Option>
                    <Option value="Medical Leave">Medical Leave</Option>
                    <Option value="Maternity Leave">Maternity Leave</Option>
                  </Select>
                </div>
                <div className="flex flex-col mb-4">
                  <Input
                    type="date"
                    label="From"
                    color="blue"
                    name="dateFrom"
                    className="border p-2 rounded"
                    value={editEmployeeData.dateFrom}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <Input
                    type="date"
                    label="To"
                    color="blue"
                    name="dateTo"
                    className="border p-2 rounded"
                    defaultValue={editEmployeeData.dateTo}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <Textarea
                    label="Reason"
                    color="blue"
                    name="Reason"
                    className="border p-2 rounded"
                    value={editEmployeeData.Reason}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                 
                    disabled={isSubmitting}
                    onClick={handleUpdate}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          )}
          <div
            className={` overflow-x-auto w-full ${
              showForm ? "filter blur-sm" : ""
            }`}
          >
            <div className="flex justify-center">
              <table className="text-sm w-full table-auto">
                <thead>
                  <tr className="font-extralight">
                    <th className="px-4 py-2 text-center font-medium">
                      Profile
                    </th>
                    <th className="px-4 py-2 text-center font-medium">Name</th>
                    <th className="px-4 py-2 text-center font-medium">
                      Leave Type
                    </th>
                    <th className="px-4 py-2 text-center font-medium">
                      Start Date
                    </th>
                    <th className="px-4 py-2 text-center font-medium">
                      End Date
                    </th>
                    <th className="px-4 py-2 text-center font-medium">
                      Reason
                    </th>
                    {userRole === "admin" && (
                      <th className="px-4 py-2 text-center font-medium">
                        Actions
                      </th>
                    )}
                    <th className="px-4 py-2 text-center font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee) => (
                    <EmployeeRow
                      key={employee.id}
                      employee={employee}
                      onAction={handleAction}
                      userRole={userRole}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <nav aria-label="Page navigation example">
              <ul className="list-style-none flex">
                <li>
                  <button
                    className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-black-500 transition-all duration-300"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                <li>
                  <button
                    className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-black-500 transition-all duration-300"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={indexOfLastEmployee >= state.employees.length}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAction}
        action={modalAction}
      />
    </section>
  );
}
