
import { useState, useEffect } from "react";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook";

function FinishedCourses() {
  const isDarkMode = useTheme();
  const [Course, setCourse] = useState([]);
  const [search, setSearch] = useState("");
  const teacherName = localStorage.getItem("userEmail");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_FACULTY_COURSE, {
        params: {
          email: teacherName,
        },
      })
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {
        console.error("Error", err);
      });
  }, [teacherName]);

  const filteredCourses = Array.isArray(Course)
    ? Course.filter((course) =>
        course.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-6 rounded-lg flex justify-center items-start transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-7xl rounded-xl shadow-xl p-6 sm:p-8 transition-all duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header and Search */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1
            className={`text-3xl md:text-4xl font-bold ${
              isDarkMode ? "text-orange-400" : "text-[#084E90]"
            }`}
          >
            Assigned Courses
          </h1>
          <input
            type="text"
            placeholder="Search course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 w-full sm:w-auto ${
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600 focus:ring-orange-400"
                : "bg-white text-black border-gray-300 focus:ring-blue-400"
            }`}
          />
        </div>
        {/* Scrollable Course Cards */}
        <div className="max-h-[70vh] overflow-y-auto pr-2 pb-4">
          <div className="flex flex-wrap gap-6 justify-start">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`relative group rounded-xl border overflow-hidden w-full sm:w-[320px] transition-all duration-300 shadow-md ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 hover:shadow-orange-500/20"
                    : "bg-white border-gray-200 hover:shadow-lg"
                }`}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48 sm:h-52">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Hover Description */}
                <div className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out transform group-hover:max-h-52 group-hover:mt-4 px-5">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {course.description}
                  </p>
                </div>

                {/* Title */}
                <div className="px-5 pt-4 pb-6">
                  <h3
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {course.name}
                  </h3>
                </div>
              </div>
            ))}

            {filteredCourses.length === 0 && (
              <p
                className={`text-lg mt-10 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No courses found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinishedCourses;

