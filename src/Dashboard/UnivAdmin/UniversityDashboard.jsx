import React, { useState } from "react";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineLogout,
} from "react-icons/hi";
import { MdSettings } from "react-icons/md";
import useTheme from "/src/Hooks/ThemeHook";

import Tab1 from "/src/Dashboard/UnivAdmin/Tab1.jsx";
import Tab2 from "/src/Dashboard/UnivAdmin/Tab2.jsx";
import Tab3 from "/src/Dashboard/UnivAdmin/Tab3.jsx";
import AddTeacher from "/src/Dashboard/UnivAdmin/AddTeacher.jsx";
import Header from "/src/Components/ReusableComponents/Header.jsx";
import FacultyList from "./ViewAssigned";

function UnivAdminDashboard() {
  const [activeIcon, setActiveIcon] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const isDarkMode = useTheme();

  const sidebarItems = [
    { id: "dashboard", icon: <HiOutlineHome size={22} />, label: "Dashboard" },
    { id: "icon2", icon: <HiOutlineBookOpen size={22} />, label: "Courses" },
    { id: "icon3", icon: <HiOutlineUsers size={22} />, label: "Students" },
    { id: "icon4", icon: <HiOutlineUserAdd size={22} />, label: "Teacher" },
    { id: "icon5", icon: <HiOutlineBookOpen size={22} />, label: "View Faculty Course" }

  ];

  const renderComponent = () => {
    switch (activeIcon) {
      case "dashboard":
        return <Tab1 />;
      case "icon2":
        return <Tab2 />;
      case "icon3":
        return <Tab3 />;
      case "icon4":
        return <AddTeacher />;
      case "icon5":
        return <FacultyList />
      default:
        return <Tab1 />;
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex transition-colors duration-300 ${isDarkMode
          ? "bg-gradient-to-br from-sky-800 to-sky-800 text-white"
          : "bg-gradient-to-br from-[#084E90] to-[#23A4DC] text-gray-800"
        }`}
    >
      <div>
        <Header />
      </div>

      {/* Sidebar */}
      <div
        className={`transition-all duration-300 h-[calc(100vh-50px)] shadow-lg overflow-y-auto fixed top-12 left-0 z-40 ${sidebarExpanded ? "w-64" : "w-[70px]"
          } ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
      >
        <div className="flex flex-col items-start h-full p-3">
          {/* Toggle */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="self-end mb-4 p-1 hover:text-blue-500"
          >
            {sidebarExpanded ? (
              <HiChevronDoubleLeft size={20} />
            ) : (
              <HiChevronDoubleRight size={20} />
            )}
          </button>

          {/* Sidebar Items */}
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveIcon(item.id)}
              className={`flex items-center gap-3 p-2 my-1 rounded-md cursor-pointer w-full transition-all duration-200 hover:bg-blue-100 dark:hover:bg-slate-700 ${activeIcon === item.id
                  ? "bg-blue-100 dark:bg-slate-700 border-l-4 border-blue-500"
                  : ""
                }`}
            >
              {item.icon}
              {sidebarExpanded && <span className="text-sm">{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="transition-all duration-300 w-full mt-16"
        style={{ marginLeft: sidebarExpanded ? "256px" : "70px" }}
      >
        <div className="p-6">{renderComponent()}</div>
      </div>
    </div>
  );
}

export default UnivAdminDashboard
