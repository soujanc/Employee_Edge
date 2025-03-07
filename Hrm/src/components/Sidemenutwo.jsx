import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Disclosure } from "@headlessui/react";
import profile from "../assets/img/profile.jpg";
import { IoHomeSharp } from "react-icons/io5";
import { XMarkIcon } from "@heroicons/react/24/outline";

import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { useProfile } from "../hooks/useProfile";

const admin = [
  { name: "All Employee", href: "/employee", icon: PlayCircleIcon },
  { name: "Leave Requests", href: "/leave", icon: PhoneIcon },
  { name: "Attendance", href: "/attendence", icon: PhoneIcon },
];
const employees = [{ name: "Leave Requests", href: "/leave", icon: PhoneIcon }];
const Payroll = [{ name: "Pay Slip", href: "/payslip", icon: PhoneIcon }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidemenutwo() {
  const { currentUser, logout } = useAuth(); // Importing logout function
  const { profileData } = useProfile();
  const Navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout(); // Logging out the current user
      Navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // useEffect(() => {
  //     console.log(location.pathname)
  //     // Navigate(location.pathname);
  // }, [location])

  return (
    <aside
      id="sidebar"
      className={`overflow-hidden overscroll-none no-scrollbar h-[100vh] hidden
        lg:flex lg:top-[24px] left-0 pt-20 flex-shrink-0 flex-col w-72`}
      aria-label="Sidebar"
    >
      <div className="relative no-scrollbar shadow-lg bg-white flex-1 flex flex-col min-h-0 border-r border-stroke pt-2">
        <div className="lg:hidden flex px-4 bg-white justify-end">
          <button
            type="button"
            className="-m-2 rounded-md p-2 bg-white text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden no-scrollbar flex flex-col pt-2 pb-4 bg-white overflow-y-auto">
          <div className="flex-1 py-4 px-6 bg-white divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              <div className="flex mb-10 gap-14 hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-200 hover:duration-300 bg-gradient-to-r from-[#66b0ff] to-[#e5efff] -mx-3 px-6 py-4 rounded-md -space-x-1 overflow-hidden">
                <div
                  className="flex items-center gap-6"
                  onClick={() => {
                    Navigate("/Profile");
                  }}
                >
                  <img
                    className="object-cover p-1 ring-2 ring-white dark:ring-blue-400 w-12 h-12 rounded-full"
                    src={profileData.personalInfo.photo}
                    alt=""
                  />
                  <div className="font-poppins text-[16px] dark:text-white">
                    <div>
                      {profileData.personalInfo.firstName +
                        " " +
                        profileData.personalInfo.lastName}
                    </div>
                    <a
                      href="#_"
                      className="relative mt-[4px] inline-flex items-center justify-start px-[8px] py-[2px] overflow-hidden font-medium bg-blue-200 transition-all bg-transparent backdrop-blur-md rounded bg-white group"
                    >
                      <span className="w-48 h-48 rounded-sm rotate-[-40deg] bg-blue-400 absolute bottom-0 left-0 translate-x-0 ease-out duration-500 transition-all translate-y-full mb-32 ml-0"></span>
                      <span className="relative w-full text-left text-sm font-extralight capitalize text-white transition-colors duration-300 ease-in-out">
                        {profileData.role}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    Navigate("/");
                  }}
                  className="flex items-center -mx-3 text-left font-poppins block rounded-lg px-3 py-2 text-base leading-7 text-gray-900 hover:bg-gray-50"
                >
                  
                  Dashboard
                </a>
              </li>
              <li></li>
              <li>
                <Disclosure as="div" className="-mx-3">
                  {(
                    { open } //if the dropdown is open
                  ) => (
                    <>
                      <Disclosure.Button className="flex font-poppins w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 leading-7 text-gray-900 hover:bg-gray-100">
                        Employees
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "h-8 w-8 flex-none"
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {profileData.role === "admin"
                          ? admin.map((item) => (
                              <Disclosure.Button
                                key={item.name}
                                as="a"
                                onClick={() => {
                                  Navigate(item.href);
                                }}
                                className="block text-left rounded-lg py-2 pl-6 pr-3 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                              >
                                {item.name}
                              </Disclosure.Button>
                            ))
                          : employees.map((item) => (
                              <Disclosure.Button
                                key={item.name}
                                as="a"
                                onClick={(event) => {
                                  event.preventDefault();
                                  Navigate(item.href);
                                }}
                                className="block text-left rounded-lg py-2 pl-6 pr-3 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                              >
                                {item.name}
                              </Disclosure.Button>
                            ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </li>
              <li>
                <a
                  href="#"
                  className="-mx-3 text-left font-poppins block rounded-lg px-3 py-2 text-base leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => {
                    Navigate("/events");
                  }}
                >
                  Events
                </a>
              </li>
              <li>
                <Disclosure as="div" className="-mx-3">
                  {(
                    { open } //if the dropdown is open
                  ) => (
                    <>
                      <Disclosure.Button className="flex font-poppins w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base leading-7 text-gray-900 hover:bg-gray-100">
                        Payroll
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "h-8 w-8 flex-none"
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...Payroll].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            onClick={() => {
                              Navigate(item.href);
                            }}
                            className="block text-left rounded-lg py-2 pl-6 pr-3 text-sm leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </li>
              <li>
                <a
                  href="#"
                  className="-mx-3 text-left block font-poppins rounded-lg px-3 py-2 text-base leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => {
                    Navigate("/feedback");
                  }}
                >
                  FeedBack
                </a>
              </li>
              <li>
                <div className="-mx-3 py-2">
                  <a
                    href="#_"
                    className="relative w-full justify-center inline-flex items-center px-12 py-3 overflow-hidden text-lg text-blue-400 border-[2px] border-blue-400 rounded-md hover:text-white group hover:bg-gray-50"
                    onClick={() => {
                      Navigate("/logout");
                    }}
                  >
                    <span className="absolute left-0 block w-full h-0 transition-all bg-blue-400 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                    <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </span>
                    <span className="font-poppins relative">
                      {currentUser ? "Logout" : "Login"}
                    </span>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
