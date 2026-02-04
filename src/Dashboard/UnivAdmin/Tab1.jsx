import { FaUniversity } from "react-icons/fa";
import bac from "/src/assets/Teacherboard/Union.png";
import axios from "axios";
import { useEffect, useState } from "react";
import useTheme from "/src/Hooks/ThemeHook";

function Teacherhome() {
  const [universityName, setUniversity] = useState("");
  const [uniAddress, setUniAddress] = useState("");
  const [uniLogo, setUniLogo] = useState("");
  const [course, setCourse] = useState("");
  const [student, setStudent] = useState("");
  const [faculty, setFaculty] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const isDarkMode = useTheme();

  const userEmail = localStorage.getItem("userEmail");
  localStorage.setItem("univName", universityName);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_UNIVERSITY_DASHBOARD, {
        params: { email: userEmail },
      })
      .then((res) => {
        setUniversity(res.data.university_name);
        setUniLogo(res.data.university_logo);
        setUniAddress(res.data.university_address);
        setCourse(res.data.total_course);
        setStudent(res.data.total_student);
        setFaculty(res.data.total_faculty);
        setFirst(res.data.student_first_year);
        setSecond(res.data.student_second_year);
        setThird(res.data.student_third_year);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const logoToShow = uniLogo && uniLogo.trim() !== "";

  return (
    <div
      className={`space-y-6 px-4 sm:px-6 md:px-10 lg:px-20 py-5 min-h-screen transition-colors duration-300 ${
        isDarkMode ? "text-white" : "text-gray-800"
      }`}
    >
<div
  className="relative min-h lg:h-[300px] rounded-xl bg-white dark:bg-slate-800 backdrop-blur-md 
             border border-white/30 shadow-md flex flex-col lg:flex-row 
             items-center justify-start gap-0 lg:gap-6 p-6"
  style={{
    backgroundImage: `url(${bac})`,
    backgroundPosition: "right",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }}
>
  {logoToShow ? (
    <div className="flex justify-center flex-shrink-0">
      <img
        src={uniLogo}
        alt="University Logo"
        className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] object-contain"
      />
    </div>
  ) : (
    <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-200 rounded-full flex-shrink-0">
      <FaUniversity size={50} className="text-[#132E65]" />
    </div>
  )}

  <div className="text-center lg:text-left mt-4 lg:mt-0">
    <h1 className="text-2xl sm:text-3xl md:text-5xl font-news text-[#132E65] dark:text-white">
      {universityName}
    </h1>
    <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-[#132E65] dark:text-gray-300">
      {uniAddress}
    </h2>
  </div>
</div>
     
      <div className="bg-white/30 dark:bg-slate-900/50 backdrop-blur-md border border-white/30 shadow-md rounded-xl p-6 flex flex-col gap-6">
        <div className="flex flex-col flex-wrap sm:flex-row justify-between w-full gap-4">
          {[{ label: "Courses", value: course }, { label: "Students", value: student }, { label: "Faculties", value: faculty }].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 flex-1 h-[150px] flex items-center justify-center rounded-xl shadow flex-col"
            >
              <h1 className="font-manrope text-3xl sm:text-4xl text-[#084D90] dark:text-orange-400">{item.value}</h1>
              <h2 className="font-manrope text-xl sm:text-2xl text-gray-500 dark:text-gray-300">{item.label}</h2>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {[{ label: "1st Year Students", value: first }, { label: "2nd Year Students", value: second }, { label: "3rd Year Students", value: third }].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 flex-1 h-[100px] flex flex-col items-center justify-center rounded-xl shadow"
            >
              <h1 className="font-manrope text-3xl sm:text-4xl text-[#084D90] dark:text-orange-400">{item.value}</h1>
              <h2 className="font-manrope text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-300 text-center">
                {item.label}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Teacherhome;