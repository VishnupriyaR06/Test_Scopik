import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CourseContext } from "/src/App";
import { FaBook, FaUserCircle, FaCertificate, FaCheckCircle } from "react-icons/fa";
import useTheme from "/src/Hooks/ThemeHook";

function StudentHome() {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [total, setTotal] = useState(0);
  const [gained, setGained] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [registered, setRegistered] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const usedata=localStorage.getItem("user_type")

  const { Course } = useContext(CourseContext);
  const isDarkMode = useTheme();

  const Uemail = localStorage.getItem("userEmail");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_student_progress, {
        params: { email: Uemail },
      })
      .then((json) => {
        setName(json.data.student.name);
        setRegistered(json.data.courses.course_details);
        setGained(json.data.courses.certificate_gained);
        setCompleted(json.data.courses.completed);
        setMail(json.data.student.email);
        setTotal(json.data.courses.total);
        setImage(json.data.student.profile_img);
        json.data.courses.course_details.forEach((course) => {
          fetchProgress(course.course_name);
        });
      })
      .catch((err) => {
        console.error("Error fetching student progress:", err);
      });
  }, []);

  const fetchProgress = (courseName) => {
    axios
      .get(import.meta.env.VITE_STATUS_VIEW, {
        params: {
          email: Uemail,
          course: courseName,
        },
      })
      .then((res) => {
        const completedChapters = res.data.chapters?.length || 0;
        const totalChapters = res.data.total || 0;

        setProgressData((prev) => ({
          ...prev,
          [courseName]: {
            completedChapters,
            totalChapters,
          },
        }));
      })
      .catch((err) => {
        console.error(`Error fetching progress for course ${courseName}:`, err);
      });
  };

  const stats = [
    {
      value: total,
      label: "Courses Enrolled",
      icon: <FaBook className="text-blue-500 text-xl mb-1" />,
    },
    {
      value: gained,
      label: "Certificates Gained",
      icon: <FaCertificate className="text-yellow-500 text-xl mb-1" />,
    },
    {
      value: completed,
      label: "Courses Completed",
      icon: <FaCheckCircle className="text-green-500 text-xl mb-1" />,
    },
  ];

  return (
    <div className="w-full px-0 md:px-4">
      <div
        className={`mt-5 flex flex-col gap-6 ${isDarkMode ? "text-white" : "text-black"}`}
      >
        <div
          className={`w-full rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl ${
            isDarkMode ? "bg-zinc-900" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 relative">
            <div className="relative">
              {image && !imageError ? (
                <img
                  src={image}
                  alt="User"
                  className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-full border-4 border-transparent neon-glow"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-7xl text-gray-400 neon-glow p-2 rounded-full border-4 border-transparent">
                  <FaUserCircle />
                </div>
              )}
            </div>

            <div className="text-center md:text-start">
              <p className="text-2xl font-bold gradient-text">{name}</p>
              <p className="text-gray-500 dark:text-gray-300">{mail}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-4 mt-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex-1 min-w-[100px] text-center rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isDarkMode ? "bg-zinc-800" : "bg-gray-100"
                }`}
              >
                <div className="flex flex-col items-center">
                  <p className="text-xl font-semibold text-blue-500">{stat.value}</p>
                  <p className="mt-1 text-sm sm:text-base">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-10">
        <h1 className={`text-2xl sm:text-3xl lg:text-4xl mt-10 mb-5 font-semibold ${isDarkMode ? "text-white" : "text-black"}`}>
          Your Courses
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {registered.map((item, index) => {
            const courseProgress = progressData[item.course_name] || {};
            const completedChapters = courseProgress.completedChapters || 0;
            const totalChapters = courseProgress.totalChapters || item.total_chap || 0;

            const percent =
              totalChapters > 0
                ? Math.min(100, Math.round((completedChapters / totalChapters) * 100))
                : 0;

            return (
              <div
                key={index}
                className={`p-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  isDarkMode ? "bg-zinc-900 text-white border border-zinc-800" : "bg-white text-black shadow"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.course_image ? (
                    <img
                      src={item.course_image}
                      alt="Course"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center text-xl">
                      <FaBook />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-base text-wrap sm:text-lg truncate">
                      {item.course_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span>{percent}% Completed</span>
                  </div>
                  <div className="w-full h-2 bg-gray-300 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
