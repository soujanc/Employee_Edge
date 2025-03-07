import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Select,
  Option,
  Textarea,
  avatar,
} from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";
import office from "../../assets/img/office.jpg";
import { FilledButton } from "../../components/FilledButton";
import { useForm } from "react-hook-form";
import { useProfile } from "../../hooks/useProfile";
import useAttendance from "../../hooks/useAttendance";



function Profile() {
  const initialFormData = {
    role: "",
    personalInfo: {
      firstName: "",
      lastName: "",
      DOB: "",
      gender: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        photo: "",
      },
    },
    professionalInfo: {
      bio: "",
      jobTitle: "",
      joiningDate: "",
      salary: "",
      department: "",
      Accountnumber: "",
      IFSC: "",
      Bankname: "",
      Bankaddress: "",
    },
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [attend,setattend]=useState()
  const contentRef = useRef(null);
  const { profileData, updateProfileImage, updateProfileData, loading, error } =
    useProfile();
    const { state, markAttendance ,getAttendanceData } =  useAttendance()
    useEffect(() => {
      const fetchAttendanceData = async () => {
        const data = await getAttendanceData();
        if (data) {
          // console.log("Attendance Data:", data[0].attendance);
          setattend(data[0].attendance)
        } else {
          // console.log("No attendance data found or an error occurred.");
        }
      };
      fetchAttendanceData(); // Correctly call the function here
    }, []); // Empty dependency 
  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  // console.log("Formdata:", formData);

  const handleChange = (value, name) => {
    // console.log(name, value);
    setIsEditing(true);

    if (name === "gender") {
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          [name]: value,
        },
      }));
    }
    if (
      name === "street" ||
      name === "city" ||
      name === "pincode" ||
      name === "state"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          address: {
            ...prevData.personalInfo.address,
            [name]: value,
          },
        },
      }));
    }
    if (name === "bio") {
      setFormData((prevData) => ({
        ...prevData,
        professionalInfo: {
          ...prevData.professionalInfo,
          [name]: value,
        },
      }));
    }
    if (
      name === "firstName" ||
      name === "lastName" ||
      name === "email" ||
      name === "DOB" ||
      name === "phone"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          [name]: value,
        },
      }));
    }
    if (
      name === "Accountnumber" ||
      name === "IFSC" ||
      name === "Bankname" ||
      name === "Bankaddress"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        bankDetails: {
          ...prevData.bankDetails,
          [name]: value,
        },
      }));
    }
  };
  const handleFormSubmit = () => {
    // console.log("updated", formData);
    updateProfileData(formData);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    updateProfileImage(file);
  };

  return (
    <>
      <section className=" bg-[#f7fbff] mt-[60px] w-full h-screen items-center  px-4 md:px-4 p-6 lg:px-8">
        <div className="font-poppins    mt-4 mb-6 text-gray-900   leading-3  text-2xl font-bold  flex py-4 text-left w-full lg:pr-0">
          Profile details
        </div>
        <div className="flex flex-col  md:flex-row font-poppins bg-[#f7fbff] gap-4 md:gap-6">
          {/* Right Section */}
          <div className="md:w-1/3 md:order-2">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md text-ellipsis overflow-hidden ">
              <div
                className="bg-cover bg-center rounded-t-lg mb-6 relative"
                style={{ backgroundImage: `url(${office})` }}
              >
                <div className="flex justify-center pt-20">
                  <div className="relative w-40 h-40 -mb-16 rounded-full border-4 border-white">
                    <img
                      src={profileData.personalInfo.photo}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="bottom-0 right-0 ">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="upload"
                        onChange={handleImageUpload}
                      />
                      <button
                        className=" absolute bottom-0 right-0 bg-white bg-opacity-80 text-blue-500 rounded-full p-2"
                        onClick={() => {
                          document.getElementById("upload").click();
                        }}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-20 ">
              <a href="#_" className="relative mt-[4px] mb-2 inline-flex items-center justify-start px-[8px] py-[2px] overflow-hidden font-medium bg-blue-200 transition-all bg-transparent backdrop-blur-md rounded bg-white group">
                                            <span className={`w-48 h-48 rounded-sm rotate-[-40deg] ${
          attend === "present" ? "bg-green-400" :
          attend === "absent" ? "bg-red-400" :
          attend === "half-day" ? "bg-yellow-600" :
          "bg-gray-400"
        } absolute bottom-0 left-0 translate-x-0 ease-out duration-500 transition-all translate-y-full mb-32 ml-0`}></span>
                                            <span className="relative w-full text-left text-sm font-extralight capitalize text-white transition-colors duration-300 ease-in-out">{attend}</span>
                                        </a>
                <div className="bottom-0 left-0 right-0 text-center px-4 pb-4">
                  <h2 className="text-2xl font-semibold ">
                    {profileData.personalInfo.firstName}{" "}
                    {profileData.personalInfo.lastName}
                  </h2>
                  <p className="p-1 text-lg">
                    {profileData.professionalInfo.jobTitle}
                  </p>
                  <p className="text-sm">
                    {profileData.personalInfo.address.city},{" "}
                    {profileData.personalInfo.address.state}
                  </p>
                  <div ref={contentRef} className="text-gray-500">
                    <p className="p-5 text-sm ">
                      {profileData.professionalInfo.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Left Section */}
          <div className="md:w-3/4 md:order-1">
            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-md p-4 min min-w-[450px]">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                {/* General Information */}
                <p className="py-3 text-gray-500">General Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div className="min-w-7">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      color="blue"
                      label="firstname"
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                      value={formData.personalInfo.firstName}
                    />
                    {formData.personalInfo.firstName.length < 3 && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        First name must be at least 3 characters long
                      </div>
                    )}
                  </div>
                  <div className="min-w-7">
                    <Input
                      className="min-w-40"
                      type="text"
                      name="lastName"
                      label="Last Name"
                      color="blue"
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                      value={formData.personalInfo.lastName}
                    />
                  </div>
                  <div className="min-w-7">
                    <Input
                      type="date"
                      name="DOB"
                      color="blue"
                      label="Date of Birth"
                      placeholder="Birthday"
                      className="w-full p-3 border rounded"
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                      value={formData.personalInfo.DOB}
                    />
                    {new Date(formData.personalInfo.DOB).getFullYear() >
                      2010 && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        Date of birth must be before 2010
                      </div>
                    )}
                  </div>
                  <div className="min-w-7">
                    <Select
                      name="gender"
                      label="gender"
                      color="blue"
                      className="w-full p-3 border rounded"
                      value={formData.personalInfo.gender}
                      onChange={(value) => handleChange(value, "gender")}
                    >
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Others">Others</Option>
                    </Select>
                  </div>
                  <div className="min-w-7">
                    <Input
                      type="email"
                      name="email"
                      label="Email"
                      color="blue"
                      placeholder="Email"
                      className="w-full p-3 border rounded"
                      value={formData.personalInfo.email}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {!/^[\w-]+(\.[\w-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(
                      formData.personalInfo.email
                    ) && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        Invalid email format
                      </div>
                    )}
                  </div>
                  <div className="min-w-7">
                    <Input
                      type="number"
                      name="phone"
                      label="Phone"
                      color="blue"
                      placeholder="Phone"
                      className="w-full p-3 border rounded"
                      value={formData.personalInfo.phone}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {!/^\d{10,15}$/.test(formData.personalInfo.phone) && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        Phone number must be between 10 and 15 digits
                      </div>
                    )}
                  </div>
                </div>
                {/* Address */}
                <p className="py-3 text-gray-500">Address </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div className="min-w-7">
                    <Input
                      type="text"
                      name="street"
                      label="House no,Street"
                      color="blue"
                      placeholder="Address"
                      className="w-full p-3 border rounded"
                      value={formData.personalInfo.address.street}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {formData.personalInfo.address.street.length < 3 && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        Address must be at least 3 characters long
                      </div>
                    )}
                  </div>
                  <div className="min-w-7">
                    <Input
                      label="City"
                      type="text"
                      name="city"
                      color="blue"
                      placeholder="City"
                      className="w-full p-3 border rounded"
                      value={formData.personalInfo.address.city}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {formData.personalInfo.address.city.length < 3 && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        City must be at least 3 characters long
                      </div>
                    )}
                  </div>
                  <div className="min-w-7">
                    <Input
                      type="text"
                      name="state"
                      label="State"
                      color="blue"
                      placeholder="State"
                      className="w-full p-3 border rounded"
                      value={formData.personalInfo.address.state}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {formData.personalInfo.address.state.length < 3 && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        City must be at least 3 characters long
                      </div>
                    )}
                  </div>
                  <div className="min-w-7">
                    <Input
                      label="Pincode"
                      type="text"
                      name="pincode"
                      color="blue"
                      placeholder="pincode"
                      className="w-full p-3 border rounded"
                      value={formData.personalInfo.address.pincode}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {formData.personalInfo.address.pincode.length === 0 && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        Pincode is required
                      </div>
                    )}

                    {formData.personalInfo.address.pincode.length > 0 &&
                      formData.personalInfo.address.pincode.length < 6 && (
                        <div className="text-red-500 flex justify-items-start text-sm">
                          Pincode must be at least 6 characters long
                        </div>
                      )}
                  </div>
                </div>
                <p className="py-3 text-gray-500">Professional Info </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <Textarea
                    label="Bio"
                    name="bio"
                    color="blue"
                    className="w-full p-3 border rounded"
                    value={formData.professionalInfo.bio}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                  />
                  <div className="flex flex-col space-y-4">
                    <Input
                      type="date"
                      name="joiningdate"
                      label="Joining Date"
                      color="blue"
                      placeholder="Joining Date"
                      //{...register("joiningDate")}
                      value={formData.professionalInfo.joiningdate}
                      //onChange={handleChange}
                      className="w-full p-3 border rounded"
                      //disabled
                      readOnly
                    />

                    <Input
                      label="Role"
                      type="text"
                      name="role"
                      color="blue"
                      placeholder="Role"
                      className="w-full p-3 border rounded"
                      //{...register("role")}
                      value={formData.professionalInfo.jobTitle}
                      //onChange={handleChange}
                      //disabled
                      readOnly
                    />
                  </div>

                  <Input
                    type="text"
                    name="salary"
                    label="Salary"
                    color="blue"
                    placeholder="Salary"
                    //{...register("salary")}
                    value={formData.professionalInfo.salary}
                    //onChange={handleChange}
                    //disabled
                    readOnly
                  />

                  <Input
                    label="Department"
                    type="text"
                    name="department"
                    color="blue"
                    placeholder="Department"
                    //{...register("department")}
                    value={formData.professionalInfo.department}
                    //onChange={handleChange}
                    readOnly
                  />
                </div>
                <p className="py-3 text-gray-500">Bank Details </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div className="min-w-7">
                    <Input
                      type="text"
                      name="Accountnumber"
                      label="Account Number"
                      color="blue"
                      className="w-full p-3 border rounded"
                      value={formData.professionalInfo.Accountnumber}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {!/^\d{9,18}$/.test(
                      formData.professionalInfo.Accountnumber
                    ) && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        Account number must be 9-18 digits long
                      </div>
                    )}
                  </div>
                  <div className="min-w-7">
                    <Input
                      label="IFSC Number"
                      type="text"
                      name="IFSC"
                      color="blue"
                      className="w-full p-3 border rounded"
                      value={formData.professionalInfo.IFSC}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
                      formData.professionalInfo.IFSC
                    ) && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        Invalid IFSC code
                      </div>
                    )}
                  </div>
                  <div className="min-w-7">
                    <Input
                      type="text"
                      name="Bankname"
                      label="Bank Name"
                      color="blue"
                      className="w-full p-3 border rounded"
                      value={formData.professionalInfo.Bankname}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {(formData?.professionalInfo?.Bankname?.length ?? 0) <
                      3 && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        Bank name must be at least 3 characters long
                      </div>
                    )}
                  </div>
                  <div className="min-w-7">
                    <Input
                      label="Bank Address"
                      type="text"
                      name="Bankddress"
                      color="blue"
                      className="w-full p-3 border rounded"
                      value={formData.professionalInfo.Bankaddress}
                      onChange={(e) =>
                        handleChange(e.target.value, e.target.name)
                      }
                    />
                    {(formData?.professionalInfo?.Bankaddress?.length ?? 0) <
                      5 && (
                      <div className="text-red-500 flex justify-items-start text-sm">
                        Bank address must be at least 5 characters long
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className={`my-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider ${
                    !isEditing && "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isEditing}
                >
                  Save Info
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
