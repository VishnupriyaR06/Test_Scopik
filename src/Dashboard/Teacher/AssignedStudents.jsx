import { useEffect, useState } from "react";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook";

function Teacherthird() {
  const isDarkMode = useTheme();

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [showAssignInput, setShowAssignInput] = useState({});
  const [viewCourseCard, setViewCourseCard] = useState({});
  const [selectedCourseId, setSelectedCourseId] = useState({});
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const teacherName = localStorage.getItem("userEmail");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_ASSIGNED_STUDENT_LIST}?email=${teacherName}`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${import.meta.env.VITE_FACULTY_COURSE}?email=${teacherName}`)
      .then((res) => setCourseList(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${import.meta.env.VITE_ASSIGNED_STUDENT_LIST}?email=${teacherName}`)
      .then((res) => setAssignedCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAssignClick = (studentId) => {
    setShowAssignInput((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleCourseChange = (studentId, courseId) => {
    setSelectedCourseId((prev) => ({
      ...prev,
      [studentId]: courseId,
    }));
  };

  const handleViewCourseClick = (studentId) => {
    setViewCourseCard((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const assignCourse = (stuId) => {
    const courseId = selectedCourseId[stuId];
    if (!courseId) {
      alert("Please select a course.");
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_ASSIGN_COURSE_TO_STUDENT}?course_id=${courseId}&student_id=${stuId}`,
        {}
      )
      .then(() => {
        setModalMessage("Course has been successfully assigned!");
        setShowModal(true);
        setShowAssignInput((prev) => ({ ...prev, [stuId]: false }));

        axios
          .get(`${import.meta.env.VITE_ASSIGNED_STUDENT_LIST}?email=${teacherName}`)
          .then((res) => {
            setStudents(res.data);
          })
          .catch((err) => console.error(err));
      })
      .catch((error) => {
        console.error("Failed", error);
        setModalMessage("Course has been already assigned.");
        setShowModal(true);
      });
  };
  const filteredStudents = (students || []).filter((s) => {
    const matchesName = s.name?.toLowerCase().includes(search.toLowerCase());

    const yearValue = s.academicYear || s.academic_year || s.year || ""; 
    const matchesYear = filterYear ? String(yearValue) === filterYear : true;

    return matchesName && matchesYear;
  });

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
          Assign Course to Student
        </h1>
      </div>

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
          const assigned = item.assigned;
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
                    className={`px-4 py-2 rounded text-white ${
                      assigned
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={() => handleAssignClick(item.email)}
                    disabled={assigned}
                  >
                    {assigned
                      ? "Assigned"
                      : showAssignInput[item.email]
                      ? "Cancel"
                      : "Assign Course"}
                  </button>

                  <button
                    className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
                    onClick={() => handleViewCourseClick(item.email)}
                  >
                    {viewCourseCard[item.email] ? "Hide Course" : "View Course"}
                  </button>
                </div>
              </div>

              {showAssignInput[item.email] && !assigned && (
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <select
                    className={`px-3 py-2 rounded border w-full sm:w-1/3 ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-black"
                    }`}
                    value={selectedCourseId[item.email] || ""}
                    onChange={(e) =>
                      handleCourseChange(item.email, e.target.value)
                    }
                  >
                    <option value="">Select Course</option>
                    {courseList.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => assignCourse(item.email)}
                  >
                    Save
                  </button>
                </div>
              )}

              {viewCourseCard[item.email] && (
                <div className="mt-4 p-4 border rounded shadow-md bg-blue-100 text-black max-h-60 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 dark:bg-slate-900 dark:text-white">
                  {studentCourses.length > 0 ? (
                    studentCourses.map((course) => (
                      <div
                        key={course.course_id}
                        className="bg-white shadow rounded p-2 flex flex-col items-center dark:bg-slate-800 dark:text-white"
                      >
                        <img
                          src={course.course_image}
                          alt={course.course_name}
                          className="w-24 h-24 object-cover rounded mb-2"
                        />
                        <p className="text-center font-medium">
                          {course.course_name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No courses assigned.</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-80 p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-medium text-gray-800 mb-4">
              {modalMessage}
            </p>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teacherthird