import Header from "/src/Components/ReusableComponents/Header.jsx";
import { useState, useEffect } from "react";
import StudentHome from "/src/Dashboard/Student/StudentHome.jsx";
import StudentStatistics from "/src/Dashboard/Student/StudentStatistics.jsx";
import Settings from "/src/Components/Settings.jsx";
import Certificate from "./Certificate";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiMenu,
} from "react-icons/hi";
import { MdDashboard, MdInsertChart, MdSettings } from "react-icons/md";
import { FaCertificate } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import useTheme from "/src/Hooks/ThemeHook";
import SemesterList from "../Student/SemesterList";
import { FaRegNoteSticky } from "react-icons/fa6";
import axios from "axios";

function StudentDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [university, setUniversity] = useState(""); 
  const isDarkMode = useTheme();
  const Uemail = localStorage.getItem("userEmail");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_STUDENT_PROGRESS}?email=${Uemail}`)
      .then((res) => {
        setUniversity(res.data.student.university);
      })
      .catch((err) => {
        console.error("Error fetching student university:", err);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      } else {
        setSidebarExpanded(true);
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ? Menu items
  const items = [
    { id: "dashboard", icon: <MdDashboard />, label: "Dashboard" },
    { id: "statistics", icon: <MdInsertChart />, label: "Statistics" },
    { id: "settings", icon: <MdSettings />, label: "Settings" },
    { id: "certificates", icon: <FaCertificate />, label: "Certificates" },
    { id: "Semesters", icon: <FaRegNoteSticky />, label: "Semester Details" },
  ];
  const filteredItems =
    university === "Scopik"
      ? items.filter((item) => item.id !== "Semesters")
      : items;

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <StudentHome />;
      case "statistics":
        return <StudentStatistics />;
      case "settings":
        return <Settings />;
      case "certificates":
        return <Certificate />;
      case "Semesters":
        return <SemesterList />;
      default:
        return <StudentHome />;
    }
  };

  return (
    <>
      <Header />
      <div
        className={`flex w-full min-h-screen pt-20 relative transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-sky-800 to-sky-800"
            : "bg-gradient-to-br from-[#084E90] to-[#23A4DC]"
        }`}
      >
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="md:hidden fixed top-16 left-4 z-40 p-2 rounded-full bg-blue-600 text-white shadow-lg"
        >
          {mobileSidebarOpen ? <IoMdClose size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed top-12 left-0 h-[calc(100vh-50px)] transition-all duration-300 shadow-lg z-30 flex-shrink-0 ${
            sidebarExpanded ? "w-64" : "w-[70px]"
          } ${isDarkMode ? "bg-zinc-900" : "bg-white"} 
          ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div
            className={`flex flex-col items-start h-full p-3 ${
              mobileSidebarOpen ? "mt-14" : ""
            }`}
          >
            {/* Collapse Button (Desktop only) */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="hidden md:block self-end mb-4 p-1 text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              {sidebarExpanded ? (
                <HiChevronDoubleLeft size={20} />
              ) : (
                <HiChevronDoubleRight size={20} />
              )}
            </button>

            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-3 p-2 my-1 rounded-md cursor-pointer w-full transition-all duration-200 hover:bg-blue-100 dark:hover:bg-zinc-700 ${
                  active === item.id
                    ? "bg-blue-200 dark:bg-zinc-700 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="text-xl text-gray-700 dark:text-gray-200">
                  {item.icon}
                </div>
                {sidebarExpanded && (
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`transition-all duration-300 w-full px-4 md:px-6 flex justify-center ${
            sidebarExpanded ? "md:ml-64" : "md:ml-[70px]"
          }`}
        >
          <div className="w-full">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard
