
import React, { useState, useEffect } from "react";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiOutlineHome,
  HiMenu,
} from "react-icons/hi";
import { MdAssignment, MdBarChart, MdSettings } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook";
import { GiProgression } from "react-icons/gi";

import Header from "/src/Components/ReusableComponents/Header.jsx";
import Teacherhome from "/src/Dashboard/Teacher/TeacherHome.jsx";
import Courses from "/src/Dashboard/Teacher/AssignedCourse.jsx";
import Students from "/src/Dashboard/Teacher/AssignedStudents.jsx";
import Settings from "../../Components/Settings"
import StudentsProgress from "./StudentProgress";
import { Settings2, SettingsIcon } from "lucide-react";

function Teacherdashboard() {
  const isDarkMode = useTheme();

  const [activeIcon, setActiveIcon] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const storedEmail = localStorage.getItem("userEmail");
  const [dashboardData, setDashboardData] = useState(null);

  const handleIconClick = (icon) => {
    setActiveIcon(icon);
    setMobileSidebarOpen(false); // Close drawer on mobile
  };

  useEffect(() => {
    // Fetch dashboard data
    axios
      .get(import.meta.env.VITE_TEACHER_DASHBOARD, {
        params: { email: storedEmail },
      })
      .then((res) => setDashboardData(res.data))
      .catch((err) => console.error("Error fetching dashboard:", err));
  }, []);

  // Collapse sidebar on small screens
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

  const sidebarItems = [
    { id: "dashboard", icon: HiOutlineHome, label: "Dashboard" },
    { id: "icon2", icon: MdAssignment, label: "Assigned Courses" },
    { id: "icon3", icon: MdBarChart, label: "Assigned Students" },
    {id:"icon5",icon:GiProgression, label:"Student Progress"},
    {id:"icon4",icon:SettingsIcon, label:"Settings"}
  ];

  const renderComponent = () => {
  switch (activeIcon) {
    case "dashboard":
      return <Teacherhome />;
    case "icon2":
      return <Courses />;
    case "icon3":
      return <Students />;
    case "icon4":
      return <Settings />;
    case "icon5":
      return <StudentsProgress />;
    default:
      return <Teacherhome />;
  }
};

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-sky-800 to-sky-800 text-white"
          : "bg-gradient-to-br from-[#084E90] to-[#23A4DC] text-black"
      }`}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="md:hidden fixed top-16 left-4 z-50 p-2 rounded-full bg-blue-600 text-white shadow-lg"
      >
        {mobileSidebarOpen ? <IoMdClose size={24} /> : <HiMenu size={24} />}
      </button>

      <div className="flex pt-[80px] w-full">
        {/* Sidebar */}
        <div
          className={`fixed top-12 left-0 h-[calc(100vh-50px)] transition-transform duration-300 shadow-lg z-40 flex-shrink-0 overflow-y-auto
            ${sidebarExpanded ? "w-64" : "w-[70px]"} 
            ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          <div
            className={`flex flex-col items-start h-full p-3 ${
              mobileSidebarOpen ? "mt-14" : ""
            }`}
          >
            {/* Collapse / Expand Button */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className={`hidden md:block self-end mb-4 p-1 ${
                isDarkMode
                  ? "text-gray-300 hover:text-orange-400"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {sidebarExpanded ? (
                <HiChevronDoubleLeft size={20} />
              ) : (
                <HiChevronDoubleRight size={20} />
              )}
            </button>

            {/* Sidebar Items */}
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeIcon === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleIconClick(item.id)}
                  className={`flex items-center gap-3 p-2 my-1 rounded-md cursor-pointer w-full transition-all duration-200
                    ${
                      isActive
                        ? "border-l-4 border-blue-500 bg-blue-100 dark:bg-gray-700"
                        : "hover:bg-blue-50 dark:hover:bg-gray-800"
                    }`}
                >
                  <Icon
                    className={`text-xl ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  />
                  {sidebarExpanded && (
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`transition-all duration-300 w-full px-4 md:px-6 flex justify-center ${
            sidebarExpanded ? "md:ml-64" : "md:ml-[70px]"
          }`}
        >
          <div className="pt-4 max-w-7xl w-full">{renderComponent()}</div>
        </div>
      </div>
    </div>
  );
}

export default Teacherdashboard;
