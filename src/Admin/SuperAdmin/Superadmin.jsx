import Header from "/src/Components/ReusableComponents/Header.jsx";
import {
  LayoutDashboard,
  ListFilter,
  BookOpenCheck,
  ListChecks,
  FileText,
  FileQuestion,
  Building2,
  Users2,
  User,
  Award,
  Newspaper,
  ScrollText,
  HelpCircle
} from "lucide-react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { useState } from "react";

import Element from "./Element";
import Category from "./Category";
import Course from "./Viewcourse";
import AddUniversity from "./AddUniversity";
import AddTeacher from "./AddTeacher";
import AddStudent from "./AddStudents";
import CertificateTemplate from "./CertificateTemplate";
import SemesterList from "./SemesterList";
import Addblog from "./AddBlog";
import Contact from "./Contact";
import Student_details from "./StudentDetails";
import { FaUserGraduate } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

function Super() {
  const [color, setColor] = useState("element");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Navigation Flow
  const handleCourseSuccess = () => setColor("square");
  const handleChapterSuccess = () => setColor("folder");
  const handleDocumentsSuccess = () => setColor("code");
  const handleQuizRefresh = () => setColor("element");
  const [isMobileOpen, setIsMobileOpen] = useState(false);


  const Changecomponent = () => {
    switch (color) {
      case "element":
        return <Element />;
      case "filter":
        return <Category />;
      case "note":
        return <Course onSuccess={handleCourseSuccess} />
      case "build":
        return <AddUniversity />;
      case "people":
        return <AddStudent />;
      case "setting":
        return <AddTeacher />;
      case "blog":
        return <Addblog />
      case "certificate":
        return <CertificateTemplate />
      case "syllabus":
        return <SemesterList />
      case "students Overview":
        return <Student_details />
      case "contact":
        return <Contact />
      default:
        return <Element />;
    }
  };

  const sidebarItems = [
    { id: "element", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "filter", icon: <ListFilter size={20} />, label: "Category" },
    { id: "note", icon: <BookOpenCheck size={20} />, label: "Course" },
    { id: "build", icon: <Building2 size={20} />, label: "University" },
    { id: "people", icon: <FaUserGraduate />, label: "Students" },
    { id: "setting", icon: <User size={20} />, label: "Faculty" },
    { id: "certificate", icon: <Award size={20} />, label: "Certificates" },
    { id: "blog", icon: <Newspaper size={20} />, label: "Blogs" },
    { id: "syllabus", icon: <ScrollText size={20} />, label: "Syllabus" },
    { id: "students Overview", icon: <Users2 size={20} />, label: "Students Report" },
    { id: "contact", icon: <HelpCircle size={20} />, label: "Assistance" }
  ];

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 w-full z-50">
        <Header />
      </div>

      {/* Layout */}
      <div className="flex w-full bg-gradient-to-r from-[#61CBF3] to-[#074c83] pt-[80px] min-h-screen relative">

        {/* Sidebar */}
        <div
          className={`
    fixed overflow-hidden top-11 md:top-13 left-0 h-[calc(100vh-40px)] md:h-[calc(100vh-10px)] transition-all duration-300 bg-white shadow-lg pt-16 lg:pt-5 z-30 dark:bg-black dark:text-white
    ${isMobileOpen ? "w-64" : "hidden"}   /* overlay on mobile & tab */
    lg:block
    ${sidebarExpanded ? "lg:w-64" : "lg:w-[70px]"} /* desktop expand/collapse */
  `}
        >
          <div className="flex flex-col items-start h-full p-3 overflow-y-auto">
            {/* Toggle (desktop only) */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="self-end mb-4 p-1 text-gray-600 hover:text-blue-500 hidden lg:block dark:text-gray-400"
            >
              {sidebarExpanded ? (
                <HiChevronDoubleLeft size={20} />
              ) : (
                <HiChevronDoubleRight size={20} />
              )}
            </button>

            {sidebarItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setColor(item.id);
                  if (window.innerWidth < 1024) setIsMobileOpen(false); // close sidebar on tab/mobile
                }}
                className={`flex items-center gap-3 p-2 my-1 rounded-md cursor-pointer w-full transition-all duration-200 md:flex-row hover:bg-blue-50  ${color === item.id ? "bg-blue-100 border-l-4 border-blue-500 dark:bg-orange-50 dark:hover:bg-orange-300 border-3-4 dark:border-orange-400" : ""
                  }`}
              >
                <div className="text-gray-700 dark:text-orange-400">{item.icon}</div>
                {(sidebarExpanded || window.innerWidth < 1024) && (
                  <span className="text-sm text-gray-700 dark:text-orange-400">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Button for Mobile & Tab */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-[70px] left-2 p-2 rounded-md pt-2 bg-blue-500 text-white shadow-lg lg:hidden z-30 "
        >
          {isMobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Main Content */}
        <div
          className={`
    transition-all duration-300 w-full pt-10 z-1 pr-6 pl-6 overflow-auto
    h-[calc(100vh-80px)]
    ${sidebarExpanded ? "lg:ml-64" : "lg:ml-[70px]"} 
    ml-0
  `}
        >
          {Changecomponent()}
        </div>
      </div>

    </>
  );
}

export default Super;