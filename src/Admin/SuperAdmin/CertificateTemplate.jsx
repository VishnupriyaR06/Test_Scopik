import { useState, useEffect } from "react";
import axios from "axios";

function CertificateTemplate() {
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editCourse, setEditCourse] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editDefault, setEditDefault] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const [dragActive, setDragActive] = useState(false);

  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;
  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    fetchCourses();
    fetchTemplates();
  }, []);

  const fetchCourses = () => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  };

  const fetchTemplates = () => {
    axios
      .get(import.meta.env.VITE_View_Certificate_Template, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setTemplates(res.data))
      .catch((err) => console.error("Error fetching templates:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !selectedCourse) {
      setModalMessage("Please select a course and upload a template image.");
      setShowModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("course", selectedCourse);
    formData.append("default", isDefault);

    axios
      .post(import.meta.env.VITE_Create_Certificate_Template, formData, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then(() => {
        setModalMessage("Template uploaded successfully ?");
        setShowModal(true);
        fetchTemplates();
        resetForm();
      })
      .catch(() => {
        setModalMessage("Failed to upload template ?");
        setShowModal(true);
      });
  };

  const resetForm = () => {
    setFile(null);
    setSelectedCourse("");
    setIsDefault(false);
  };

  const handleEditSubmit = () => {
    if (!editCourse || !editingTemplate?.id) return;

    const formData = new FormData();
    formData.append("default", editDefault ? "true" : "false");
    if (editFile) {
      formData.append("file", editFile);
    }

    axios
      .put(
        `${import.meta.env.VITE_UPDATE_CERTIFICATE}?course=${encodeURIComponent(
          editCourse
        )}`,
        formData,
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      )
      .then(() => {
        setModalMessage("Template updated successfully ?");
        setShowModal(true);
        fetchTemplates();
        setEditModal(false);
        setEditingTemplate(null);
      })
      .catch(() => {
        setModalMessage("Failed to update template ?");
        setShowModal(true);
      });
  };

  const handleDeleteTemplate = () => {
    if (!templateToDelete?.course) return;

    axios
      .delete(
        `${import.meta.env.VITE_DELETE_CERTIFICATE}?course=${encodeURIComponent(
          templateToDelete.course
        )}`,
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      )
      .then(() => {
        setModalMessage("Template deleted successfully ?");
        setShowModal(true);
        setShowDeleteModal(false);
        fetchTemplates();
      })
      .catch(() => {
        setModalMessage("Failed to delete template ?");
        setShowModal(true);
        setShowDeleteModal(false);
      });
  };

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-orange-400">
        Certificate Templates
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block font-medium mb-1 text-gray-800 dark:text-orange-400">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Drag & Drop Upload */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-gray-600"
              : "border-gray-400 dark:border-gray-600"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <svg
              className="w-10 h-10 text-gray-500 dark:text-gray-300 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V4m0 0l-4 4m4-4l4 4m6-4v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            {file ? (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {file.name}
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                Drag & Drop your template here or{" "}
                <span className="text-blue-600 font-medium">browse</span>
              </p>
            )}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="accent-blue-600"
          />
          <label className="text-gray-800 dark:text-gray-200">
            Set as Default Template
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Upload Template
        </button>
      </form>

      {/* Existing Templates */}
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-orange-400">
        Existing Templates
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {templates.length > 0 ? (
          templates.map((temp, index) => (
            <div
              key={index}
              className="relative flex flex-col justify-between border rounded-lg p-4 shadow bg-white dark:bg-gray-700"
            >
              <div>
                <img
                  src={temp.file}
                  alt="Template"
                  className="w-full h-52 object-cover rounded"
                />
                <p className="mt-2 text-gray-700 dark:text-gray-200 font-medium">
                  Course Name : {temp.course || "N/A"}
                </p>
                {temp.is_default && (
                  <p className="text-green-600 border bg-white rounded-lg px-3 py-0.5 absolute top-0 left-0 font-bold">
                    Default
                  </p>
                )}
              </div>
              <div className="flex gap-5">
                <button
                  onClick={() => {
                    setTemplateToDelete(temp);
                    setShowDeleteModal(true);
                  }}
                  className="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            No templates found.
          </p>
        )}
      </div>

      {/* Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Notification
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {modalMessage}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && templateToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete the certificate template for "
              <span className="font-semibold">{templateToDelete.course}</span>"
            </p>

            <div className="flex gap-4 justify-end mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTemplate}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Edit Certificate Template
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                  Course
                </label>
                <select
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                  className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                  Upload New Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files[0])}
                  className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editDefault}
                  onChange={(e) => setEditDefault(e.target.checked)}
                  className="accent-blue-600"
                />
                <label className="text-gray-800 dark:text-gray-200">
                  Set as Default Template
                </label>
              </div>

              <div className="flex gap-4 justify-end mt-4">
                <button
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateTemplate;
