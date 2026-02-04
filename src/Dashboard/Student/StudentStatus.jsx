import { useEffect, useState } from "react";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook";
import { FaBook } from "react-icons/fa";

function StudentStatus() {
  const isDarkMode = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await axios.get(import.meta.env.VITE_STUDENT_PROGRESS, {
          params: { email: userEmail },
        });
        const courseDetails = res.data?.courses?.course_details || [];
        setCourses(courseDetails);
      } catch (err) {
        console.error("? Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="p-6 sm:p-10 text-center text-orange-500">
        Loading courses...
      </div>
    );
  }

  return (
    <div
      className={`w-full p-4 sm:p-6 md:p-10 rounded-xl border transition duration-300 ${
        isDarkMode
          ? "bg-zinc-900 border-zinc-700 text-white"
          : "bg-[#f7f7f7] border-gray-300 text-black"
      }`}
    >
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Enrolled Courses
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courses.map((course) => (
          <div
            key={course.course_id}
            className={`rounded-xl p-4 sm:p-5 transition shadow hover:shadow-xl ${
              isDarkMode
                ? "bg-zinc-800 border border-zinc-700"
                : "bg-white border border-gray-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              {course.course_image ? (
                <img
                  src={course.course_image}
                  alt={course.course_name}
                  className="w-20 h-20 object-cover rounded border"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 flex items-center justify-center rounded text-gray-600 text-2xl">
                  <FaBook />
                </div>
              )}
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold truncate">
                  {course.course_name}
                </h2>
                <p className="text-sm text-gray-500">ID: {course.course_id}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500 line-clamp-3 text-center sm:text-left">
              {course.course_description || "No description provided."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentStatus;
