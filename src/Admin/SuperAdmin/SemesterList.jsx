import axios from "axios";
import { useEffect, useState } from "react";

function SemesterList() {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [campus, setCampus] = useState([]);

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [semesterNumber, setSemesterNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editSemId, setEditSemId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");

  const [courseToggle, setCourseToggle] = useState({});

  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;
  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    fetchCourses();
    fetchSemesters();
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (showForm && editMode) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }, [showForm, editMode]);

  const fetchCourses = () => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        showModal("Failed to fetch courses. Check console.", "error");
      });
  };

  const fetchSemesters = () => {
    axios
      .get(import.meta.env.VITE_View_Semester, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setSemesters(res.data))
      .catch((err) => {
        console.error("Failed to fetch semesters", err);
        showModal("Failed to fetch semesters. Check console.", "error");
      });
  };

  const fetchUniversities = () => {
    axios
      .get(import.meta.env.VITE_VIEW_UNIVERSITY, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCampus(res.data))
      .catch((err) => {
        console.error("Failed to fetch universities", err);
        showModal("Failed to fetch universities. Check console.", "error");
      });
  };

  const handleCourseSelection = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const resetForm = () => {
    setSemesterNumber("");
    setStartDate("");
    setDepartment("");
    setSelectedCourses([]);
    setUniversity("");
    setEditMode(false);
    setEditSemId(null);
  };

  const showModal = (message, type = "info") => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!semesterNumber || !startDate || !department || !university) {
      showModal("Please fill all required fields.", "error");
      return;
    }

    const payload = {
      course_ids: selectedCourses,
      sem: semesterNumber,
      start_date: startDate,
      department: department,
      university: university,
    };

    axios
      .post(import.meta.env.VITE_Create_Semester, payload, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then(() => {
        showModal("Semester created successfully.", "success");
        resetForm();
        setShowForm(false);
        fetchSemesters();
      })
      .catch((err) => {
        console.error("Semester creation failed:", err);
        showModal("Semester creation failed. Check console for details.", "error");
      });
  };

  const handleEdit = (semester) => {
    setSemesterNumber(semester.sem);
    setStartDate(semester.start_date || "");
    setDepartment(semester.department);
    setUniversity(semester.university);
    setSelectedCourses(semester.course_ids || []);
    setEditMode(true);
    setEditSemId(semester.id);
    setShowForm(true);
  };

  const handleEditSubmit = () => {
    if (!semesterNumber || !startDate || !department || !university) {
      showModal("Please fill all required fields.", "error");
      return;
    }

    const payload = {
      course_ids: selectedCourses,
      sem: semesterNumber,
      start_date: startDate,
      department: department,
      university: university,
    };

    axios
      .put(
        `${import.meta.env.VITE_EDIT_SEM}${university}/${department}/${semesterNumber}`,
        payload,
        {
          headers: { Authorization: `Basic ${token}` },
        }
      )
      .then(() => {
        showModal("Semester updated successfully.", "success");
        resetForm();
        setShowForm(false);
        fetchSemesters();
      })
      .catch((err) => {
        console.error("Semester update failed:", err);
        showModal("Semester update failed. Check console for details.", "error");
      });
  };

  const handleDelete = (uniName, dept, semNumber) => {
    axios
      .delete(`${import.meta.env.VITE_SEM_DELETE}${uniName}/${dept}/${semNumber}/`, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then(() => {
        showModal("Semester deleted successfully.", "success");
        fetchSemesters();
      })
      .catch((err) => {
        console.error("Failed to delete semester:", err);
        showModal("Failed to delete semester. Check console for details.", "error");
      });
  };

  const toggleCourseList = (semesterId) => {
    setCourseToggle((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }));
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:pl-6 bg-white rounded-lg shadow-lg  mx-auto dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center sm:text-left dark:text-orange-400">
            Semesters
          </h1>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
                setShowForm(false);
              } else {
                setShowForm(true);
              }
            }}
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-md hover:bg-blue-700 transition-shadow shadow-md w-full sm:w-auto text-center"
          >
            {showForm ? "Close" : "+ Create Semester"}
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 sm:p-6 lg:p-8 mb-10 shadow-inner dark:bg-slate-800">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-6 text-center sm:text-left dark:text-blue-400">
              {editMode ? "Edit Semester" : "Create New Semester"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Semester Number */}
              <div>
                <label htmlFor="semesterNumber" className="block font-semibold mb-2 text-gray-700 dark:text-white">
                  Semester Number
                </label>
                <input
                  id="semesterNumber"
                  type="text"
                  placeholder="e.g., 1"
                  value={semesterNumber}
                  onChange={(e) => setSemesterNumber(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 sm:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block font-semibold mb-2 text-gray-700 dark:text-white">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 sm:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block font-semibold mb-2 text-gray-700 dark:text-white">
                  Department
                </label>
                <input
                  id="department"
                  type="text"
                  placeholder="e.g., Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 sm:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* University */}
              <div>
                <label htmlFor="university" className="block font-semibold mb-2 text-gray-700 dark:text-white">
                  University
                </label>
                <select
                  id="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 sm:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                >
                  <option value="" disabled>Select University</option>
                  {campus.map((uni) => (
                    <option key={uni.id} value={uni.name}>{uni.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course List */}
            <div className="mt-6">
              <label className="block font-semibold mb-2 text-gray-700 dark:text-white">Select Courses</label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white dark:bg-slate-800 dark:text-white">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <div key={course.id} className="flex items-center mb-2">
                      <input
                        id={`course-${course.id}`}
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCourseSelection(course.id)}
                        className="mr-3 w-5 h-5 cursor-pointer"
                      />
                      <label htmlFor={`course-${course.id}`} className="cursor-pointer">{course.name}</label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No courses available.</p>
                )}
              </div>
            </div>

            <button
              onClick={editMode ? handleEditSubmit : handleSubmit}
              className="mt-6 sm:mt-8 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-green-700 transition-shadow shadow-md font-semibold w-full sm:w-auto"
            >
              {editMode ? "Update Semester" : "Submit Semester"}
            </button>
          </div>
        )}

        {/* Semester Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {semesters.length > 0 ? (
            semesters.map((semester) => {
              const allCourses = semester.course || [];
              const coursesToShow = courseToggle[semester.id] ? allCourses : allCourses.slice(0, 2);

              return (
                <div
                  key={semester.id}
                  className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition dark:bg-slate-800"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-2 dark:text-blue-300">
                    Semester {semester.sem}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1 dark:text-white">University: {semester.university || "N/A"}</p>
                  <p className="text-sm text-gray-600 mb-2 dark:text-white">Department: {semester.department}</p>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-1 dark:text-white">Courses:</p>
                    {allCourses.length > 0 ? (
                      <>
                        <ul className="list-disc list-inside text-gray-700 dark:text-white">
                          {coursesToShow.map((courseName, index) => (
                            <li key={index}>{courseName}</li>
                          ))}
                        </ul>
                        {allCourses.length > 2 && (
                          <p
                            className="text-blue-600 cursor-pointer mt-1 text-sm"
                            onClick={() => toggleCourseList(semester.id)}
                          >
                            {courseToggle[semester.id] ? "Show less" : "Read more"}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No syllabus available.</p>
                    )}
                  </div>

                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(semester)}
                      className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(semester.university, semester.department, semester.sem)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No semesters found.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-lg sm:text-xl font-bold mb-4 ${
              modalType === "error"
                ? "text-red-600"
                : modalType === "success"
                ? "text-green-600"
                : "text-gray-900"
            }`}>
              {modalType === "error" ? "Error" : modalType === "success" ? "Success" : "Info"}
            </h3>
            <p className="mb-6 text-sm sm:text-base">{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SemesterList;
