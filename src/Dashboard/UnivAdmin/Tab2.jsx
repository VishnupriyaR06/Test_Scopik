import { useState, useEffect } from "react";
import axios from "axios";
import { FiImage } from "react-icons/fi";
import useTheme from "/src/Hooks/ThemeHook";

function FinishedCourses() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // Track deleting course
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const uniName = localStorage.getItem("univName");
  const isDarkMode = useTheme();
  const Email = localStorage.getItem("userEmail");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_UNIVERSITY_COURSE, {
        params: { email: Email },
      })
      .then((res) => {
        const courseData = Array.isArray(res.data)
          ? res.data.map((course, index) => ({
              id: course.id || index,
              image: course.course_image,
              name: course.course_name,
            }))
          : [];
        setCourses(courseData);
      })
      .catch((err) => console.error("API error:", err));
  }, [Email]);

  const filteredCourses = search
    ? courses.filter((course) =>
        course.name.toLowerCase().includes(search.toLowerCase())
      )
    : courses;

  const confirmDelete = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    setLoadingId(selectedCourse.id);

    try {
      await axios.delete(
        `${import.meta.env.VITE_DELETE_UNIVCOURSE}${encodeURIComponent(
          uniName
        )}/${encodeURIComponent(selectedCourse.name)}/`
      );

      setCourses((prev) =>
        prev.filter((c) => c.id !== selectedCourse.id)
      );
      setShowModal(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setLoadingId(null);
    }
  };

return (
      <div className={`w-full rounded-xl min-h-screen px-4 py-8 ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"}`}>
    <div
      className={`p-4 sm:p-6 rounded-2xl shadow-xl min-h-[800px] max-h-[600px] overflow-y-auto ${
        isDarkMode
          ? "bg-slate-900"
          : "bg-gradient-to-br from-blue-100 via-white to-blue-100"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">University Courses</h1>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
                isDarkMode ? "bg-slate-700" : "bg-white"
              }`}
            >
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-40 sm:h-48 object-fill"
                />
              ) : (
                <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-gray-300 dark:bg-slate-600">
                  <FiImage size={48} className="text-gray-600 dark:text-white" />
                </div>
              )}
              <div className="p-3 sm:p-4">
                <h2 className="text-md sm:text-lg font-semibold text-center truncate">
                  {course.name}
                </h2>
              </div>
              <button
                onClick={() => confirmDelete(course)}
                disabled={loadingId === course.id}
                className={`w-full py-2 text-center font-medium rounded-b-lg transition-colors duration-300 ${
                  loadingId === course.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {loadingId === course.id ? "Removing..." : "Remove Course"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-300 text-lg mt-10">
            No courses found.
          </p>
        )}
      </div>
    </div>

    {showModal && selectedCourse && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div
          className={`p-6 rounded-xl shadow-lg w-96 ${
            isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p className="mb-6">
            Are you sure you want to remove{" "}
            <span className="font-semibold">{selectedCourse.name}</span> from{" "}
            <span className="font-semibold">{uniName}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

}

export default FinishedCourses;