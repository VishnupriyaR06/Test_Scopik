import { useEffect, useState } from "react";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook";
import { FaBook } from "react-icons/fa";

function Teacherthird() {
  const isDarkMode = useTheme();

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [viewProgress, setViewProgress] = useState({});
  const teacherName = localStorage.getItem("userEmail");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_ASSIGNED_STUDENT_LIST}?email=${teacherName}`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${import.meta.env.VITE_ASSIGNED_STUDENT_LIST}?email=${teacherName}`)
      .then((res) => setAssignedCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Filter students safely
  const filteredStudents = (students || []).filter((s) => {
    const matchesName = s.name?.toLowerCase().includes(search.toLowerCase());
    const yearValue = s.academicYear || s.academic_year || s.year || "";
    const matchesYear = filterYear ? String(yearValue) === filterYear : true;
    return matchesName && matchesYear;
  });

  const fetchStudentCourseProgress = (studentEmail, courseName) => {
  axios
    .get(import.meta.env.VITE_STATUS_VIEW, {
      params: { email: studentEmail, course: courseName },
    })
    .then((res) => {
      const completedChapters = res.data.chapters?.length || 0;
      const totalChapters = res.data.total || 0;

      setProgressData((prev) => ({
        ...prev,
        [studentEmail]: {
          ...(prev[studentEmail] || {}),
          [courseName]: { completedChapters, totalChapters },
        },
      }));
    })
    .catch((err) => {
      console.error(
        `Error fetching progress for ${studentEmail} in ${courseName}:`,
        err
      );
    });
};

const handleViewProgressClick = (studentEmail, studentCourses) => {
  setViewProgress((prev) => ({
    ...prev,
    [studentEmail]: !prev[studentEmail],
  }));

  // Fetch progress only if it doesn't exist yet
  if (!progressData[studentEmail]) {
    studentCourses.forEach((course) =>
      fetchStudentCourseProgress(studentEmail, course.course_name)
    );
  }
};

  return (
    <div
      className={`w-full px-4 py-6 md:px-8 lg:px-16 rounded-lg ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1
          className={`text-3xl md:text-4xl font-semibold ${
            isDarkMode ? "text-orange-400" : "text-[#084E90]"
          }`}
        >
          Student Progress
        </h1>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-row justify-between items-center gap-3">
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="p-2 border rounded dark:bg-slate-800"
        >
          <option value="">Filter by Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`px-4 py-2 w-full md:w-80 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black"
          }`}
        />
      </div>

      {filteredStudents.length === 0 ? (
        <p
          className={`text-center ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          No student found.
        </p>
      ) : (
        filteredStudents.map((item) => {
          const studentCourses =
            assignedCourses.find((s) => s.email === item.email)?.courses || [];

          return (
            <div
              key={item.email}
              className={`shadow-md px-4 sm:px-6 py-4 rounded-md mb-4 transition-all ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {item.profile_image ? (
                    <img
                      src={item.profile_image}
                      onError={(e) =>
                        (e.currentTarget.src = "/default-student.png")
                      }
                      alt={item.name || "Student"}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  )}
                  <p className="text-lg sm:text-xl font-medium">{item.name}</p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <button
                    className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
                    onClick={() => handleViewProgressClick(item.email, studentCourses)}
                  >
                    {viewProgress[item.email] ? "Hide Progress" : "View Progress"}
                  </button>
                </div>
              </div>

              {viewProgress[item.email] && (
<div
  className="mt-4 p-4 border rounded shadow-md bg-blue-100 text-black 
             max-h-60 overflow-y-auto overflow-x-hidden 
             grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 
             dark:bg-slate-900 dark:text-white"
>
                  {studentCourses.length > 0 ? (
                    studentCourses.map((course, index) => {
const courseProgress = progressData[item.email]?.[course.course_name] || {};
const completedChapters = courseProgress.completedChapters || 0;
const totalChapters = courseProgress.totalChapters || course.total_chap || 0;

const percent =
  totalChapters > 0
    ? Math.min(100, Math.round((completedChapters / totalChapters) * 100))
    : 0;

                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                            isDarkMode
                              ? "bg-zinc-900 text-white border border-zinc-800"
                              : "bg-white text-black shadow"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-wrap">
                            {course.course_image ? (
                              <img
                                src={course.course_image}
                                alt="Course"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center text-xl">
                                <FaBook />
                              </div>
                            )}
                           <div className="flex-1 min-w-0"> {/* ensures child can shrink */}
  <p className="font-semibold text-base sm:text-lg truncate overflow-hidden whitespace-nowrap">
    {course.course_name}
  </p>
  <p className="text-sm text-gray-500 dark:text-gray-400">
    Enrolled
  </p>
</div>
                          </div>

                          {/* ✅ Progress Bar */}
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
                    })
                  ) : (
                    <p>No courses assigned.</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Teacherthird;