
import { useEffect, useState } from "react";
import bac from "/src/assets/Teacherboard/Union.png";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook";
import { FiUser } from "react-icons/fi"; // fallback icon

function Teacherhome() {
  const isDarkMode = useTheme();

  const storedEmail = localStorage.getItem("userEmail");
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacheremail] = useState("");
  const [teacherPhoto, setTeacherPhoto] = useState("");
  const [total, setTotal] = useState("");
  const [course, setCourse] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third,setThird]=useState("")

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_TEACHER_DASHBOARD, {
        params: {
          email: storedEmail,
        },
      })
      .then((res) => {
        setTeacherName(res.data.teacher_name);
        setTeacheremail(res.data.teacher_email);
        setTeacherPhoto(res.data.teacher_img)
        setCourse(res.data.total_courses);
        setTotal(res.data.total_students);
        setFirst(res.data.first_year_students);
        setSecond(res.data.second_year_students);
        setThird(res.data.third_year_students)
      })
      .catch((err) => {
        console.error("Error fetching dashboard:", err);
      });
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Top Profile Section */}
      <div
        className={`relative h-[300px] rounded-xl shadow-md flex flex-col md:flex-row items-center justify-start px-6 md:px-10 gap-6 md:gap-10 py-6 md:py-0 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
        style={{
          backgroundImage: `url(${bac})`,
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        {/* Profile Picture or Fallback Icon */}
        {teacherPhoto ? (
          <img
            src={teacherPhoto}
            alt="Profile"
            className="w-32 h-32 md:w-44 md:h-44 rounded-full shadow object-cover"
          />
        ) : (
          <div
            className={`w-32 h-32 md:w-44 md:h-44 rounded-full shadow flex items-center justify-center ${
              isDarkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <FiUser size={60} />
          </div>
        )}

        {/* Profile Info */}
        <div className="z-10 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-[#132E65] dark:text-white">
            {teacherName}
          </h1>
          <h2 className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            {teacherEmail}
          </h2>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="space-y-5 ">
        {/* Top Two Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Card isDarkMode={isDarkMode} title="Total Courses" value={course} />
          <Card isDarkMode={isDarkMode} title="Total Students" value={total} />
        </div>

        {/* Bottom Three Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            isDarkMode={isDarkMode}
            title="First Year Students"
            value={first}
          />
          <Card
            isDarkMode={isDarkMode}
            title="Second Year Students"
            value={second}
          />
          <Card isDarkMode={isDarkMode} title="Third Year Students" value={third} />
        </div>
      </div>
    </div>
  );
}

// Reusable Card component
function Card({ isDarkMode, title, value }) {
  return (
    <div
      className={`h-[150px] rounded-lg flex flex-col justify-center items-center shadow-md ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-orange-400">
        {value}
      </h1>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
        {title}
      </p>
    </div>
  );
}

export default Teacherhome;

