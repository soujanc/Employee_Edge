import React, { useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import profile from "../assets/img/profile.jpg";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
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

export default function Sidemenu({ mobileMenuOpen, setMobileMenuOpen }) {
  const { profileData } = useProfile();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarRef = useRef();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <aside
      id="sidebar"
      ref={sidebarRef}
      className={`fixed top-[24px] overflow-hidden no-scrollbar z-[999] h-full 
        lg:hidden lg:top-[24px] left-0 pt-16 flex flex-shrink-0 flex-col w-72 ${
          mobileMenuOpen ? "" : "hidden"
        }`}
      aria-label="Sidebar"
    >
      <div className="relative no-scrollbar shadow-lg bg-white flex-1 flex flex-col min-h-0 border-r border-stroke pt-2">
        <div className="lg:hidden flex px-4 bg-white justify-end">
          <button
            type="button"
            className="-m-2 rounded-md p-2 bg-white text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden no-scrollbar flex flex-col pt-2 pb-4 bg-white overflow-y-auto">
          <div className="flex-1 py-4 px-6 bg-white divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              <div
                className="flex mb-10 gap-14 hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-200 hover:duration-300 bg-gradient-to-r from-[#66b0ff] to-[#e5efff] -mx-3 px-6 py-4 rounded-md -space-x-1 overflow-hidden"
                onClick={() => {
                  navigate("/Profile");
                  setMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-6">
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
                    <div className="text-[12px] font-poppins font-thin text-[#828a8d] dark:text-gray-400">
                      {profileData.role}
                    </div>
                  </div>
                </div>
              </div>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                  className="-mx-3 text-left font-poppins block rounded-lg px-3 py-2 text-base leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Dashboard
                </a>
              </li>
              <li></li>
              <li>
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
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
                                  navigate(item.href);
                                  setMobileMenuOpen(false);
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
                                onClick={() => {
                                  navigate(item.href);
                                  setMobileMenuOpen(false);
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
                    navigate("/events");
                    setMobileMenuOpen(false);
                  }}
                >
                  Events
                </a>
              </li>
              <li>
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
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
                              navigate(item.href);
                              setMobileMenuOpen(false);
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
                    navigate("/feedback");
                    setMobileMenuOpen(false);
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
                      navigate("/logout");
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
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
