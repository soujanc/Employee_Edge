import React from "react";
import { gsap } from "gsap";
import { app } from "../../services/firebase";
import { SplitText } from "gsap-trial/SplitText";
import nicozn_logo_edit from "../../assets/img/nicozn_logo_edit.png"; // Import the logo image
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Fragment, useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import background from "../../assets/img/back1.jpg";
import Sidemenu from "../../components/Sidemenu";
import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";

const employees = [
  { name: "All Employee", href: "/employee", icon: PlayCircleIcon },

  { name: "Leave Requests", href: "/leave", icon: PhoneIcon },
  { name: "Attendance", href: "/attendence", icon: PhoneIcon },
];
const Payroll = [{ name: "Pay Slip", href: "/payslip", icon: PhoneIcon }];

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [startedClicked, setStartedClicked] = useState(true);

  const { currentUser } = useAuth();

  // useEffect(() => {
  //   gsap.registerPlugin(SplitText);
  //   const tl = gsap.timeline();
  //   const splitText = new SplitText("#split", { type: "chars" });

  //   tl.from(splitText.chars, {
  //     yPercent: 70,
  //     duration: 0.4,
  //     stagger: 0.07,
  //     opacity: 0,
  //     ease: "back.out",
  //     delay: 0.6,
  //   });
  //   // Cleanup
  //   return () => {
  //     splitText.revert();
  //   };
  // }, []);

  useEffect(() => {
    function handleResize() {
      // Check window width to determine if it's a large screen
      setIsLargeScreen(window.innerWidth >= 1024); // Adjust the width threshold as needed
    }
    // Initial check
    handleResize();
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Navigate = useNavigate();
  useEffect(() => {
    Navigate("/");
  }, []);
  const location = useLocation();

  const handleGoogleRedirect = () => {
    window.location.href = "https://nicozn.com/";
  };

  return (
    <>
      <header className=" shadow-default no-scrollbar fixed top-0 left-0 w-full z-[900] bg-[#4da3ff]">
        <nav
          className="  no-scrollbar mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 text-black">
              <div className="flex items-center justify-center h-[30px] w-[30px]   rounded-full bg-white uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
              onClick={handleGoogleRedirect}
              >
              <img className="w-auto" src={nicozn_logo_edit} alt="" />
              </div>
            </a>
          </div>
          <div className="flex no-scrollbar lg:hidden">
            {location.pathname !== "/login" && (
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5  text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open side menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
          </div>
        </nav>
        {/*-----------------side menu -----------------------------------*/}
        {/* Your other components */}
        <Sidemenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />{" "}
        {/* Pass mobileMenuOpen as prop */}
        {/*-----------------side menu Ends -----------------------------------*/}
      </header>
    </>
  );
}
