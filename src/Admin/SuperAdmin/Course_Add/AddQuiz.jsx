import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function AddQuiz({ onSuccess, goToChapterStep }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [chapters, setChapters] = useState([]);
  const [quizzes, setQuizzes] = useState([]); 

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;
  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.error("Expected array, received:", res.data);
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setCourses([]);
      });
  }, []);

  useEffect(() => {
    const course = courses.find((c) => c.id == selectedCourseId);
    setChapters(course?.chapters || []);
  }, [selectedCourseId, courses]);


  const bulklQuiz = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const quizsheet = XLSX.utils.sheet_to_json(worksheet);
      setQuizzes(quizsheet); 
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadbulk = () => {
    if (!quizzes.length) {
      showModal("Please select and parse an Excel file first.");
      return;
    }

    axios
      .post(
        import.meta.env.VITE_BULK_QUIZ,
        { quizzes },
        { headers: { Authorization: `Basic ${token}` } }
      )
      .then((res) => {
        showModal("Quizzes uploaded successfully!");
      })
      .catch((err) => {
        console.error("Upload error:", err);
        showModal("Failed to upload quizzes.");
      });
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-screen-xl mx-auto dark:bg-slate-900">
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 w-11/12 max-w-sm">
            <h2 className="text-xl font-semibold text-green-700">Notification</h2>
            <p className="text-gray-700">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center dark:text-orange-300">Quiz Manager</h1>

      {/* Step 1: Course Select */}
      <div className="mb-6">
        <label className="block font-medium mb-1  dark:text-white">Select Course</label>
        <select
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Bulk Upload */}
      {selectedCourseId && (
        <div className="mb-6">
          <label className="block font-medium mb-2  dark:text-white">Bulk Upload Quiz</label>
          <div className="border-2 border-dashed border-orange-500 rounded-lg p-6 text-center hover:bg-orange-50 transition">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={bulklQuiz}
              className="w-full text-center text-sm text-gray-600 file:mx-auto file:rounded-lg file:border file:border-orange-500 file:bg-orange-100 file:px-4 file:py-2 file:text-orange-700 file:cursor-pointer hover:file:bg-orange-200"
            />
            <p className="mt-2 text-sm text-gray-500">
              Upload your Excel file (.xlsx / .xls)
            </p>

            {quizzes.length > 0 && (
              <button
                onClick={uploadbulk}
                className="mt-4 px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
              >
                Upload Quizzes ({quizzes.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddQuiz;