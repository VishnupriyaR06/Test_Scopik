import { useEffect, useState } from "react";
import Graph from "/src/Dashboard/Student/Graph";
import StudentStatus from "/src/Dashboard/Student/StudentStatus.jsx";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook";

function Note() {
  const [course, setCourse] = useState(2);
  const [certi, setCertifi] = useState(4);
  const [completed, setCompleted] = useState(2);
  const isDarkMode = useTheme();

  const Uemail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_STUDENT_PROGRESS, {
          params: { email: Uemail },
        });
        const data = res.data?.courses || {};
        setCourse(data.total || 0);
        setCertifi(data.certificate_gained || 0);
        setCompleted(data.completed || 0);
      } catch (error) {
        console.error("Failed to fetch student progress:", error);
      }
    };

    fetchData();
  }, []);

  const cardClasses =
    "flex-1 rounded-2xl overflow-hidden p-6 sm:p-8 transition duration-300 min-w-[250px]";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const cardBg = isDarkMode ? "bg-zinc-900" : "bg-[#f7f7f7]";

  return (
    <div
      className={`p-4 sm:p-6 md:p-10 rounded-xl flex flex-col gap-6 transition duration-300 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className={`${cardClasses} ${cardBg}`}>
          <h1 className={`text-lg sm:text-xl md:text-2xl mb-2 ${textColor}`}>
            Courses Enrolled
          </h1>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600">
            {course}
          </p>
        </div>

        <div className={`${cardClasses} ${cardBg}`}>
          <h1 className={`text-lg sm:text-xl md:text-2xl mb-2 ${textColor}`}>
            Certificates Gained
          </h1>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600">
            {certi}
          </p>
        </div>

        <div className={`${cardClasses} ${cardBg}`}>
          <h1 className={`text-lg sm:text-xl md:text-2xl mb-2 ${textColor}`}>
            Courses Completed
          </h1>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600">
            {completed}
          </p>
        </div>
      </div>

      {/* Graph */}
      <div className="w-full mt-6">
        <Graph />
      </div>
    </div>
  );
}

export default Note;     
