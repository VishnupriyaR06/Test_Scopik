import axios from "axios";
import { useEffect, useState } from "react";

function Chapter({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [select, setSelect] = useState("");
  const [selectCourse, setCourse] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [onModalClose, setOnModalClose] = useState(() => () => {});

  const username=import.meta.env.VITE_USER_NAME
  const password= import.meta.env.VITE_USER_PASS

  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((data) => setCourse(data.data))
      .catch((err) => console.error("Failed to fetch courses", err));
  };

  const handleSaveChapter = () => {
    if (!title || !select) {
      showModal("Please fill in all required fields.");
      return;
    }

    axios
      .post(import.meta.env.VITE_Create__Chap, { title, course: select })
      .then(() => {
        showModal("Chapter created successfully", () => {
          setTitle("");
          setSelect("");
          if (onSuccess) onSuccess();
          fetchCourses();
        });
      })
      .catch((err) => console.error("Create failed", err));
  };

  const showModal = (message, callback) => {
    setModalMessage(message);
    setModalVisible(true);
    setOnModalClose(() => callback || (() => {}));
  };

  const closeModal = () => {
    setModalVisible(false);
    onModalClose();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-8 dark:bg-slate-900">
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
            <h2 className="text-xl font-semibold text-green-700">Success</h2>
            <p className="text-gray-700">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 text-center dark:text-white">Add Chapter</h1>

      {/* Add Chapter Form */}
      <div className="bg-gray-50 border border-gray-200 shadow rounded-lg p-6 space-y-6 dark:bg-slate-800">
        <div className="grid md:grid-cols-2 gap-6">
         <div className="flex flex-col w-full">
  <label className="text-sm text-gray-600 font-medium mb-1 dark:text-white">
    Course <span className="text-red-500">*</span>
  </label>
  <select
    className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 dark:bg-slate-700 dark:text-white dark:border-slate-600 
               focus:outline-none focus:ring-2 focus:ring-blue-400"
    value={select}
    onChange={(e) => setSelect(e.target.value)}
  >
    <option value="" disabled>
      -- Choose Course --
    </option>
    {selectCourse.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ))}
  </select>
</div>


          <div className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium mb-1 dark:text-white">
              Chapter Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter chapter title"
              className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveChapter}
            className="bg-green-600 hover:bg-green-700 transition px-6 py-2 text-white rounded-lg font-semibold"
          >
            Save Chapter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chapter;
