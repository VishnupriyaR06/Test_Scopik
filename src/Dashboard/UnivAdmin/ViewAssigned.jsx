import { useEffect, useState } from "react";
import useTheme from "/src/Hooks/ThemeHook"; 
import axios from "axios";

function FacultyList() {
  const [expandedFaculty, setExpandedFaculty] = useState(null);
  const [facultyData, setFacultyData] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [deleteInfo, setDeleteInfo] = useState(null); 

  const uniName = localStorage.getItem("univName");
  const isDarkMode = useTheme(); 
  const Email = localStorage.getItem("userEmail");

  // Fetch faculty list
  useEffect(() => {
    fetchFaculty();
  }, [Email]);

  const fetchFaculty = () => {
    axios
      .get(import.meta.env.VITE_UNIVERSITY_FACULTY, {
        params: { email: Email },
      })
      .then((res) =>
         setFacultyData(res.data))
      .catch((err) => console.error("Error fetching faculty:", err));
  };

  // Open modal before delete
  const confirmDelete = (facultyEmail, courseName) => {
    setDeleteInfo({ facultyEmail, courseName });
    setShowModal(true);
  };

  // Delete assigned course
  const handleDeleteCourse = () => {
    if (!deleteInfo) return;

    const url = `${import.meta.env.VITE_COURSE_FACDELE}${encodeURIComponent(
      uniName
    )}/${encodeURIComponent(deleteInfo.facultyEmail)}/${encodeURIComponent(
      deleteInfo.courseName
    )}/`;

    axios.delete(url).then((res) => {
        setShowModal(false);
        setDeleteInfo(null);
        fetchFaculty(); // refresh after delete
      })
      .catch((err) => console.error("Error removing course:", err));
  };

  const toggleCourses = (index) => {
    setExpandedFaculty(expandedFaculty === index ? null : index);
  };

  return (
    <div
      className={`p-6 space-y-4 min-h-screen rounded-lg ${
        isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">Faculty List</h1>

      {facultyData.length === 0 ? (
        <p className="text-center text-gray-500">No faculty data available.</p>
      ) : (
        facultyData.map((faculty, index) => (
          <div
            key={index}
            className={`border rounded-xl p-4 shadow-md ${
              isDarkMode
                ? "bg-slate-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2 className="text-lg font-semibold">{faculty.name}</h2>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              Department: {faculty.department || "Not Assigned"}
            </p>
            <button
              onClick={() => toggleCourses(index)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {expandedFaculty === index
                ? "Hide Assigned Courses"
                : "View Assigned Courses"}
            </button>

            {/* Assigned Courses */}
            {expandedFaculty === index && (
              <div className="mt-4 space-y-2">
                {faculty.course && faculty.course.length > 0 ? (
                  faculty.course.map((c) => (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between border p-3 rounded-lg ${
                        isDarkMode ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <h3 className="font-semibold">{c.name}</h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {c.description}
                          </p>
                        </div>
                      </div>
                      {/* Delete button with confirmation */}
                      <button
                        onClick={() => confirmDelete(faculty.email, c.name)}
                        className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Remove Assigned Course
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-red-500">No courses assigned</p>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 rounded-xl shadow-lg w-96 ${
              isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to remove{" "}
              <span className="font-bold">{deleteInfo?.courseName}</span> from{" "}
              <span className="font-bold">{deleteInfo?.facultyEmail}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyList;