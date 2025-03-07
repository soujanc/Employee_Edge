import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FilledButton } from "../../components/FilledButton";
import { Input, Select, Option, Textarea } from "@material-tailwind/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEmployee } from "../../hooks/useEmployee";
import { v4 } from "uuid";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import { Alert, Button } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { functions } from "../../services/firebase";
import { httpsCallable } from "firebase/functions";
import bcrypt from 'bcryptjs';


const schemaa = z.object({
  firtsname: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
  emaile: z.string().email("Invalid email address"),
  password: z.string().min(8).max(20),
  DOB: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) {
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date;
      }
      return undefined;
    },
    z.date().refine((date) => date < new Date("2015-01-01"), {
      message: "Date of birth must be before 2015",
    })
  ),
  joindate: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) {
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date;
      }
      return undefined;
    },
    z.date().refine((date) => date < new Date(), {
      message: "Date of join must not be in the future",
    })
  ),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, { message: "Phone number must be at least 10 digits long" })
    .max(10, { message: "Phone number cannot exceed 10 digits" }),
  adress: z.string().min(2),
  states: z.string().min(2),
  city: z.string().min(2),
  role: z.string().min(2),

  department: z.string().min(1, { message: "Please select a department" }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  pincode: z.string().min(6),
  salary: z.string().min(2),
  jobtitle: z.string().min(4),
  accountnumber: z.string().min(12).max(14),
  IFSCcode: z
    .string()
    .max(11)
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code" }),
  bankaddress: z.string().min(2),
  bankname: z.string().min(2),
});
export default function AllEmployee() {

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schemaa) });

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Mark",
      email: "mark@example.com",
      phone: "123-456-7890",
      salary: 80000,
      department: "Web Development",
      gender: "male",
      address: "adress",
      city: "city",
      pincode: "pincode",
      state: "state",
      DOB: "DOB",
      role: "role",
      joiningdate: "joindate",
      profilePicture:
        "https://images.pexels.com/photos/6112353/pexels-photo-6112353.jpeg?auto=compress&cs=tinysrgb&w=600",
      active: false,
    },
    {
      id: 2,
      name: "Jacob",
      email: "jacob@example.com",
      phone: "987-654-3210",
      salary: 80000,
      gender: "male",
      address: "adress",
      city: "city",
      pincode: "pincode",
      state: "state",
      DOB: "DOB",
      role: "role",
      joiningdate: "joindate",
      department: "Accounts",
      profilePicture:
        "https://images.pexels.com/photos/7366286/pexels-photo-7366286.jpeg?auto=compress&cs=tinysrgb&w=600",
      active: false,
    },
    {
      id: 3,
      name: "Larry",
      email: "larry@example.com",
      phone: "111-222-3333",
      salary: 80000,
      gender: "male",
      address: "adress",
      city: "city",
      pincode: "pincode",
      state: "state",
      DOB: "DOB",
      role: "role",
      joiningdate: "joindate",
      department: "Support",
      profilePicture:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
      active: false,
    },
  ]);

  const initialformadta = {
    id: "",
    personalInfo: {
      DOB: "2001-02-22",
      address: {
        street: "sdgjkhgfdsfhg",
        city: "zxngbd",
        pincode: "12345",
        state: "SRzdhtjgm",
      },
      email: "asedrtfgyu",
      firstName: "zxzxyh",
      lastName: "aegsrh",
      gender: "aetsghr",
      phone: "1234567",
      photo: "",
    },
    professionalInfo: {
      department: "Marketing",
      joiningdate: "2001-12-22",
      salary: "12345",
      jobTitle: "wsedfg",
      Accountnumber: "accountnumber",
      IFSC: "IFSCcode",
      Bankname: "bankname",
      Bankaddress: "bankaddress",
    },
    role: "admin",
  };

  const [editedEmployee, setEditedEmployee] = useState(null);
  const [formData, setFormData] = useState(initialformadta);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [firtsname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [emaile, setemail] = useState("");
  const [department, setdepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setimage] = useState();
  const [open, setOpen] = useState(false);
  const [salary, setsalary] = useState();
  const [gender, setgender] = useState("");
  const [adress, setadress] = useState("");
  const [city, setcity] = useState("");
  const [states, setstates] = useState("");
  const [pincode, setpincode] = useState("");
  const [joindate, setjoindate] = useState("");
  const [accountnumber, setaccountnumber] = useState("");
  const [bankname, setbankname] = useState("");
  const [IFSCcode, setIFSCcode] = useState("");
  const [bankaddress, setbankaddress] = useState("");
  const [password, setpassword] = useState("");
  const [DOB, setDOB] = useState("");
  const [role, setrole] = useState("");
  const [jobtitle, setjobtitle] = useState("");
  const [message, setmessage] = useState(""); 

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

  const { empl, addEmp, deleteEmp, updateEmp, loading, error } = useEmployee();
  // console.log(empl);

  // const { state, addEmp, updateEmp, deleteEmp } = useEmployee();
  const addNewData = async (data) => {
    let uid;
    let employeeData;
    // console.log(image);
    const {
      firtsname,
      lastname,
      emaile,
      phone,
      salary,
      gender,
      department,
      adress,
      password,
      city,
      pincode,
      states,
      DOB,
      jobtitle,
      joindate,
      accountnumber,
      bankname,
      bankaddress,
      IFSCcode,
      role,
    } = data;

    //firecast //
    try {
      employeeData = await httpsCallable(
        functions,
        "createEmployee"
      )({
        email: emaile,
        password: password,
      });
      console.log("Employee data:", employeeData.data);
      uid = employeeData.data.uid;
      console.log("Employee UID:", uid);
      addNewData(employeeData.data); // Assuming addNewData is a function to handle further processing
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle error if needed
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };
    const formattedjoindate = formatDate(joindate);
    const formattedDOB = formatDate(DOB);

    // Create a new employee object
    const newEmployee = {
      personalInfo: {
        DOB: formattedDOB,
        address: {
          street: adress,
          city: city,
          pincode: pincode,
          state: states,
        },
        email: emaile,
        password: password,
        firstName: firtsname,
        lastName: lastname,
        gender: gender,
        phone: phone,
        photo: image,
      },
      professionalInfo: {
        department: department,
        joiningdate: formattedjoindate,
        salary: salary,
        jobTitle: jobtitle,
        Accountnumber: accountnumber,
        IFSC: IFSCcode,
        Bankname: bankname,
        Bankaddress: bankaddress,
      },
      role: role,
    };
    await addEmp(newEmployee, uid);
    setShowForm(false);
    reset();
    // Add the new employee to the employees array
    setmessage("Employee added sucesfully!");
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  const deleteEmployee = (id) => {
    deleteEmp(id);
  };


  //fetchdbstarthere
  const fetchCollectionAsArray = async (collectionName) => {
    try {
      // Reference to the collection
      const collectionRef = collection(firestore, collectionName);

      // Fetch all documents in the collection
      const querySnapshot = await getDocs(collectionRef);

      // Initialize an empty array to store the documents
      const documentsArray = [];

      // Iterate over each document in the snapshot
      querySnapshot.forEach((doc) => {
        // Push the document data into the array, including the document ID
        documentsArray.push({ id: doc.id, ...doc.data() });
      });

      // Return the array of documents
      return documentsArray;
    } catch (error) {
      console.error("Error fetching collection: ", error);
      return [];
    }
  };

  // Usage example:
  fetchCollectionAsArray("employee")
    .then((data) => {
      // console.log("Fetched data:", data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  //fetchdb endhere

  const handleCancel = () => {
    setEditedEmployee(null);
  };
  const onEditemp = async (id) => {
    // console.log(id);
    // console.log(empl);
    setIsEditing(true);
    // Find the employee with the matching id
    const employeeToEdit = empl.find((employee) => employee.id === id);

    if (employeeToEdit) {
      setFormData({
        ...employeeToEdit,
        id: id, // Ensure id is set
      });
    } else {
      // console.error("Employee not found");
    }

    // console.log(formData);
  };
  const updateEmpImage = async (file) => {
    const storageInstance = getStorage();
    const photoRef = ref(storageInstance, `Emp_photo/${file.name + v4()}`);
    const uploadTask = uploadBytesResumable(photoRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setimage(downloadURL);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };
  
  const handleChange1 = (value, name) => {
    setIsEditing(true);

    setFormData((prevData) => {
      // Copy the previous state to avoid mutations
      const newFormData = { ...prevData };

      // Check which part of the state needs updating
      if (
        name === "street" ||
        name === "city" ||
        name === "pincode" ||
        name === "state"
      ) {
        newFormData.personalInfo.address[name] = value;
      } else if (
        name === "department" ||
        name === "joiningdate" ||
        name === "salary" ||
        name === "jobtitle" ||
        name === "Accountnumber" ||
        name === "Bankname" ||
        name === "IFSC" ||
        name === "Bankaddress"
      ) {
        newFormData.professionalInfo[name] = value;
      } else if (name === "role") {
        newFormData[name] = value;
      } else {
        newFormData.personalInfo[name] = value;
      }

      return newFormData;
    });
  };

  const handleChange = (id) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        if (employee.id === id) {
          return {
            ...employee,
            active: !employee.active,
          };
        }
        return employee;
      })
    );
  };

  const handlesubmit1 = () => {
    // console.log(formData);
    setmessage("Employee edited sucesfully!");
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  
    const index = formData.id;
    // console.log(index);
    updateEmp(formData, index);
    setIsEditing()

  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    updateEmpImage(file)
      .then((downloadURL) => {
        console.log("Image uploaded and accessible at:", downloadURL);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  return (
    <section className=" bg-[#f7fbff]  mt-[70px] max-w-[1230px]  w-screen h-fit md:h-screen  items-center  px-4 md:px-4 p-6 lg:px-8">
      <div className=" max-h-screen ">
      <div className="font-poppins mb-2 text-gray-900 leading-3 text-2xl font-bold flex items-center py-4 text-left w-full lg:pr-0">
        <div className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] flex justify-center items-center">
          <FaUsers size={17} />
        </div>
        <span className="ml-2">All Employees</span>
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
          {message}
          </Alert>
        </div>

        <div
          className="font-poppins border shadow-default
       border-stroke rounded-lg  w-full bg-white p-4 md:p-8"
        >
          <div className="flex justify-end items-center mb-4">
            <FilledButton
              onClick={() => {
                setShowForm(true);
              }}
              label="Add new Data"
            ></FilledButton>
            {showForm && (
              <div className=" overflow-y-auto fixed inset-0   bg-black bg-opacity-50 flex items-center justify-center z-[999]">
                <div className="bg-white p-6 mt-24 rounded-lg shadow-lg w-full md:max-w-md">
                  {/* General Information */}
                  <p className="py-3 text-gray-500">General Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        color="blue"
                        label="firstname"
                        {...register("firtsname")}
                        //   value={firtsname}
                        //   onChange={(e) => {
                        //     setfirstname(e.target.value);
                        //   }}
                        //
                      />
                      {errors.firtsname && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.firtsname.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="lastName"
                        label="Last Name"
                        color="blue"
                        className="w-full p-3 border rounded"
                        {...register("lastname")}
                        // onChange={(e) => {
                        //   setlastname(e.target.value);
                        //}}
                      />
                      {errors.lastname && (
                        <div className="text-red-500 text-xs font-poppins flex justify-center  ">
                          {errors.lastname.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="date"
                        name="birthday"
                        color="blue"
                        label="Date of Birth"
                        placeholder="Birthday"
                        className="w-full p-3 border rounded"
                        {...register("DOB")}
                        // onChange={(e) => {
                        //   setDOB(e.target.value);
                        // }}
                      />
                      {errors.DOB && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.DOB.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <Controller
                        name="gender"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div>
                            <Select
                              label="gender"
                              color="blue"
                              className="border p-2 rounded"
                              {...field}
                            >
                              <Option value="">Select gender</Option>
                              <Option value="Male">Male</Option>
                              <Option value="Female">Female</Option>
                              <Option value="Others">Others</Option>
                            </Select>
                            {errors.gender && (
                              <div className="text-red-500 text-xs  font-poppins flex   ">
                                {errors.gender.message}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        name="email"
                        label="Email"
                        color="blue"
                        placeholder="Email"
                        className="w-full p-3 border rounded"
                        {...register("emaile")}
                        // value={emaile}
                        // onChange={(e) => {
                        //   setemail(e.target.value);
                        // }}
                      />
                      {errors.emaile && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.emaile.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="phone"
                        label="Phone"
                        color="blue"
                        placeholder="Phone"
                        className="w-full p-3 border rounded"
                        {...register("phone")}
                        // value={phone}
                        // onChange={(e) => {
                        //   setPhone(e.target.value);
                        // }}
                      />
                      {errors.phone && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.phone.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-2">
                    <div>
                      <Input
                        type="password"
                        name="password"
                        label="password"
                        color="blue"
                        placeholder="password"
                        {...register("password")}
                        className="w-full p-2 border mb-2 rounded"
                      />
                      {errors.password && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="jobtitle"
                        label="jobtitle"
                        color="blue"
                        placeholder="State"
                        className="w-full p-3 border rounded"
                        {...register("jobtitle")}
                        // value={state}
                        // onChange={(e) => {
                        //   setstate(e.target.value);
                        // }}
                      />
                      {errors.jobtitle && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.jobtitle.message}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Address */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-2">
                    <div>
                      <Input
                        type="text"
                        name="address"
                        label="Address"
                        color="blue"
                        placeholder="Address"
                        className="w-full p-3 border rounded"
                        {...register("adress")}
                      />
                      {errors.adress && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.adress.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        label="City"
                        type="text"
                        name="city"
                        color="blue"
                        placeholder="City"
                        className="w-full p-3 border rounded"
                        {...register("city")}
                        // value={city}
                        // onChange={(e) => {
                        //   setcity(e.target.value);
                        // }}
                      />
                      {errors.city && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.city.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="state"
                        label="State"
                        color="blue"
                        placeholder="State"
                        className="w-full p-3 border rounded"
                        {...register("states")}
                        // value={state}
                        // onChange={(e) => {
                        //   setstate(e.target.value);
                        // }}
                      />
                      {errors.states && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.states.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <Input
                        label="Pincode"
                        type="text"
                        name="zip"
                        color="blue"
                        placeholder="Zip"
                        className="w-full p-3 border rounded"
                        {...register("pincode")}
                        // value={pincode}
                        // onChange={(e) => {
                        //   setpincode(e.target.value);
                        // }}
                      />
                      {errors.pincode && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.pincode.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Controller
                        name="department"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div>
                            <Select
                              label="Department"
                              color="blue"
                              className="border p-2 rounded"
                              {...field}
                            >
                              <Option value="">Select Department</Option>
                              <Option value="IT">IT</Option>
                              <Option value="Human resource">
                                Human resource
                              </Option>
                              <Option value="Marketing">Marketing</Option>
                              <Option value="Finance">Finance</Option>
                            </Select>
                            {errors.department && (
                              <div className="text-red-500 text-xs  font-poppins flex   ">
                                {errors.department.message}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <Controller
                        name="role"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div>
                            <Select
                              label="role"
                              color="blue"
                              className="border p-2 rounded"
                              {...field}
                            >
                              <Option value="">Select role</Option>
                              <Option value="admin">Admin</Option>
                              <Option value="employee">Employee</Option>
                            </Select>
                            {errors.role && (
                              <div className="text-red-500 text-xs  font-poppins flex   ">
                                {errors.role.message}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Input
                        type="date"
                        name="DOB"
                        label="Joining Date"
                        color="blue"
                        placeholder="Joining Date"
                        {...register("joindate")}
                        // value={joindate}
                        // onChange={(e) => {
                        //   setjoindate(e.target.value);
                        // }}
                        className="w-full p-3 border rounded"
                      />
                      {errors.joindate && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.joindate.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="number"
                        name="salary"
                        label="salary"
                        color="blue"
                        placeholder="salary"
                        {...register("salary")}
                        // value={salary}
                        // onChange={(e) => {
                        //   setsalary(e.target.value);
                        // }}
                        className="w-full p-3 border rounded"
                      />{" "}
                      {errors.salary && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.salary.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Input
                        type="number"
                        name="accountnumber"
                        label="accountnumber"
                        color="blue"
                        placeholder="accountnumber"
                        {...register("accountnumber")}
                        // value={salary}
                        // onChange={(e) => {
                        //   setsalary(e.target.value);
                        // }}
                        className="w-full p-3 border rounded"
                      />{" "}
                      {errors.accountnumber && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.accountnumber.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="IFSCcode"
                        label="IFSCcode"
                        color="blue"
                        placeholder="IFSCcode"
                        {...register("IFSCcode")}
                        // value={salary}
                        // onChange={(e) => {
                        //   setsalary(e.target.value);
                        // }}
                        className="w-full p-3 border rounded"
                      />{" "}
                      {errors.IFSCcode && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.IFSCcode.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <Input
                        type="text"
                        name="bankname"
                        label="bankname"
                        color="blue"
                        placeholder="bankname"
                        {...register("bankname")}
                        // value={salary}
                        // onChange={(e) => {
                        //   setsalary(e.target.value);
                        // }}
                        className="w-full p-3 border rounded"
                      />{" "}
                      {errors.bankname && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.bankname.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="bankaddress"
                        label="bankaddress"
                        color="blue"
                        placeholder="bankaddress"
                        {...register("bankaddress")}
                        // value={salary}
                        // onChange={(e) => {
                        //   setsalary(e.target.value);
                        // }}
                        className="w-full p-3 border rounded"
                      />{" "}
                      {errors.bankaddress && (
                        <div className="text-red-500 text-xs  font-poppins flex   ">
                          {errors.bankaddress.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <Input
                    type="file"
                    name="image"
                    label="image"
                    color="blue"
                    placeholder="image"
                    onChange={handleImageUpload}
                    className="w-full p-3 border mb-2 rounded"
                  />
                  <button
                    onClick={handleSubmit(addNewData)}
                    className={`my-3 mr-[16px] bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider 
                    }`}
                  >
                    Add new data
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="my-3 bg-gray-600 hover:bg-gray-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider opacity-50 "
                  >
                    Cancel
                  </button>

                </div>
              </div>
            )}
      
            {isEditing && (
              <div className=" overflow-y-auto fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                <div className="bg-white p-6 mt-24 rounded-lg shadow-lg w-full md:max-w-md">
                  <form onSubmit={handlesubmit1}>
                    {/* General Information */}
                    <p className="py-3 text-gray-500">General Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <Input
                        type="text"
                        name="name"
                        placeholder="First Name"
                        color="blue"
                        label="firstname"
                        value={formData.personalInfo.firstName}
                        onChange={(e) =>
                          handleChange1(e.target.value, "firstName")
                        }
                        //  onChange={console.log(formData.name)}
                      />
                      <Input
                        type="text"
                        name="lastName"
                        label="Last Name"
                        color="blue"
                        className="w-full p-3 border rounded"
                        value={formData.personalInfo.lastName}
                        onChange={(e) =>
                          handleChange1(e.target.value, "lastName")
                        }
                      />
                      <Input
                        type="date"
                        name="DOB"
                        color="blue"
                        label="Date of Birth"
                        placeholder="Birthday"
                        className="w-full p-3 border rounded"
                        value={formData.personalInfo.DOB}
                        onChange={(e) => handleChange1(e.target.value, "DOB")}
                      />
                      <Select
                        name="gender"
                        label="gender"
                        color="blue"
                        className="w-full p-3 border rounded"
                        value={formData.personalInfo.gender}
                        onChange={(value) => handleChange1(value, "gender")}
                      >
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Others">Others</Option>
                      </Select>
                      <Input
                        type="email"
                        name="email"
                        label="Email"
                        color="blue"
                        placeholder="Email"
                        className="w-full p-3 border rounded"
                        value={formData.personalInfo.email}
                        onChange={(e) => handleChange1(e.target.value, "email")}
                      />
                      <Input
                        type="text"
                        name="phone"
                        label="Phone"
                        color="blue"
                        placeholder="Phone"
                        className="w-full p-3 border rounded"
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleChange1(e.target.value, "phone")}
                      />
                    </div>
                    {/* Address */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <Input
                        type="text"
                        name="address"
                        label="Address"
                        color="blue"
                        placeholder="Address"
                        className="w-full p-3 border rounded"
                        value={formData.personalInfo.address.street}
                        onChange={(e) =>
                          handleChange1(e.target.value, "street")
                        }
                      />
                      <Input
                        label="City"
                        type="text"
                        name="city"
                        color="blue"
                        placeholder="City"
                        className="w-full p-3 border rounded"
                        value={formData.personalInfo.address.city}
                        onChange={(e) => handleChange1(e.target.value, "city")}
                      />
                      <Input
                        type="text"
                        name="state"
                        label="State"
                        color="blue"
                        placeholder="State"
                        className="w-full p-3 border rounded"
                        value={formData.personalInfo.address.state}
                        onChange={(e) => handleChange1(e.target.value, "state")}
                      />
                      <Input
                        label="Pincode"
                        type="text"
                        name="pincode"
                        color="blue"
                        placeholder="Zip"
                        className="w-full p-3 border rounded"
                        value={formData.personalInfo.address.pincode}
                        onChange={(e) =>
                          handleChange1(e.target.value, "pincode")
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <Select
                        name="department"
                        label="Department"
                        color="blue"
                        className="border p-2 rounded"
                        value={formData.professionalInfo.department}
                        onChange={(value) => handleChange1(value, "department")}
                      >
                        <Option value="">Select Department</Option>
                        <Option value="IT">IT</Option>
                        <Option value="Human resource">Human resource</Option>
                        <Option value="Marketing">Marketing</Option>
                        <Option value="Finance">finance</Option>
                      </Select>

                      <Select
                        name="role"
                        label="role"
                        color="blue"
                        className="border p-2 rounded"
                        value={formData.role}
                        onChange={(value) => handleChange1(value, "role")}
                      >
                        <Option value="">Select Department</Option>
                        <Option value="admin">Admin</Option>
                        <Option value="employee">Employee</Option>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <Input
                        type="date"
                        name="joiningdate"
                        label="Joining Date"
                        color="blue"
                        placeholder="Joining Date"
                        value={formData.professionalInfo.joiningdate}
                        onChange={(value) =>
                          handleChange1(value, "joiningdate")
                        }
                        className="w-full p-3 border rounded"
                      />

                      <Input
                        type="number"
                        name="salary"
                        label="salary"
                        color="blue"
                        placeholder="salary"
                        value={formData.professionalInfo.salary}
                        onChange={(e) =>
                          handleChange1(e.target.value, "salary")
                        }
                        className="w-full p-3 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <Input
                          type="number"
                          name="accountnumber"
                          label="accountnumber"
                          color="blue"
                          placeholder="accountnumber"
                          value={formData.professionalInfo.Accountnumber}
                          onChange={(e) =>
                            handleChange1(e.target.value, "Accountnumber")
                          }
                          className="w-full p-3 border rounded"
                        />{" "}
                      </div>
                      <div>
                        <Input
                          type="text"
                          name="IFSCcode"
                          label="IFSCcode"
                          color="blue"
                          placeholder="IFSCcode"
                          value={formData.professionalInfo.IFSC}
                          onChange={(e) =>
                            handleChange1(e.target.value, "IFSC")
                          }
                          className="w-full p-3 border rounded"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <Input
                          type="text"
                          name="bankname"
                          label="bankname"
                          color="blue"
                          placeholder="bankname"
                          value={formData.professionalInfo.Bankname}
                          onChange={(e) =>
                            handleChange1(e.target.value, "Bankname")
                          }
                          className="w-full p-3 border rounded"
                        />{" "}
                      </div>
                      <div>
                        <Input
                          type="text"
                          name="bankaddress"
                          label="bankaddress"
                          color="blue"
                          placeholder="bankaddress"
                          value={formData.professionalInfo.Bankaddress}
                          onChange={(e) =>
                            handleChange1(e.target.value, "Bankaddress")
                          }
                          className="w-full p-3 border rounded"
                        />{" "}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handlesubmit1}
                      className={`my-3 mr-[16px] bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider ${
                        !isEditing && "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={!isEditing}
                    >
                      Save Info
                    </button>
                    <button
                      onClick={() => setIsEditing()}
                      className="my-3 bg-gray-600 hover:bg-gray-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider opacity-50 "
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-sm font-extralight">
                  <th className="  px-4 py-2 font-medium">Profile</th>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Dob </th>
                  <th className="px-4 py-2 font-medium">Email Id</th>
                  <th className="px-4 py-2 font-medium">Phone</th>
                  <th className="px-4 py-2 font-medium">Salary</th>
                  <th className="px-4 py-2 font-medium">Gender</th>
                  <th className="px-4 py-2 font-medium">Department</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {empl.map(
                  (
                    employee //here use the employees from the firebase
                  ) => (
                    <tr
                      key={employee.id}
                      className="border-b text-sm text-center"
                    >
                      <td className="px-4 py-2">
                        <img
                          src={employee.personalInfo.photo}
                          alt="Profile"
                          className="w-10 h-10 rounded-full mx-auto"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {employee.personalInfo.firstName +
                          " " +
                          employee.personalInfo.lastName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {employee.personalInfo.DOB}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {employee.personalInfo.email}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {employee.personalInfo.phone}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {employee.professionalInfo.salary}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {employee.personalInfo.gender}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {employee.professionalInfo.department}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          onClick={() => handleChange(employee.id)}
                          className={`py-1 px-2 w-full rounded text-xs ${
                            employee.role == "employee"
                              ? "bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center  text-white"
                              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center  text-white"
                          }`}
                        >
                          {employee.role == "admin" ? "Admin" : "employee"}
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex justify-center">
                          <button
                            onClick={() => onEditemp(employee.id)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded mr-2"
                          >
                            <FaRegEdit size={21} />
                          </button>
                          <button
                            onClick={() => deleteEmployee(employee.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded"
                          >
                            <MdOutlineDeleteOutline size={21} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <nav aria-label="Page navigation example">
              <ul className="list-style-none flex">
                <li>
                  <a className="pointer-events-none relative block rounded bg-transparent px-3 py-1.5 text-sm text-black-500 transition-all duration-300 dark:text-black-400">
                    Previous
                  </a>
                </li>
                {Array.from(
                  { length: Math.ceil(employees.length / employeesPerPage) },
                  (_, i) => (
                    <li key={i + 1}>
                      <a
                        className={`relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 hover:bg-blue-600 dark:text-black dark:hover:bg-blue-700 dark:hover:text-white ${
                          currentPage === i + 1
                            ? "bg-primary-100 text-primary-700"
                            : "text-neutral-600"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                        {currentPage === i + 1 && (
                          <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
                            (current)
                          </span>
                        )}
                      </a>
                    </li>
                  )
                )}
                <li>
                  <a
                    className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-blue-600 dark:text-black dark:hover:bg-blue-700 dark:hover:text-white"
                    href="#!"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
