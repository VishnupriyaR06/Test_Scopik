import axios from "axios";
import { useEffect, useState } from "react";

function Documents({ onSuccess }) {
  const [materials, setMaterials] = useState(false);
  const [uploadvideo, setUploadVideo] = useState(false);
  const [content, setContent] = useState(false);

  const [text, setText] = useState("");
  const [value, setValue] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [chapters, setChapters] = useState([]);

  const [documentFile, setDocumentFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;
  const token = btoa(`${username}:${password}`);

  // fetch all courses
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          setCourses([]);
        }
      })
      .catch(() => setCourses([]));
  }, []);

  // fetch chapters when course changes
  useEffect(() => {
    const course = courses.find((c) => String(c.id) === String(selectedCourse));
    setChapters(course?.chapters || []);
  }, [selectedCourse, courses]);

  // ================= Upload handler =================
  const handleSave = async () => {
    try {
      setIsUploading(true);

      if (materials && documentFile) {
        const formData = new FormData();
        formData.append("document", documentFile);
        formData.append("document_name", text);
        formData.append("chapter_name", chapterName);

        await axios.post(import.meta.env.VITE_Document, formData, {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (uploadvideo && videoFile) {
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("video_name", text);
        formData.append("chapter_name", chapterName);

        await axios.post(import.meta.env.VITE_VIDEO, formData, {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (content && value) {
        await axios.post(
          import.meta.env.VITE_TEXT,
          {
            text_content: value,
            chapter_name: chapterName,
          },
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
      } else {
        showModal("Please fill all required fields");
        setIsUploading(false);
        return;
      }

      showModal("Resources added successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      showModal("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    if (modalMessage.includes("successfully")) {
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 dark:bg-slate-900">
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center space-y-4 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-green-600 dark:text-white">
              {modalMessage.includes("?") ? "Success" : "Error"}
            </h2>
            <p className="text-gray-700">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-[#084D90] mb-4 dark:text-blue-300">
        Add Chapter Resources
      </h1>

      <div className="space-y-5">
        {/* Select Course */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1 dark:text-white">
            Select Course
          </label>
          <select
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select Chapter */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1 dark:text-white">
            Select Chapter
          </label>
          <select
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            disabled={!selectedCourse}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          >
            <option value="">-- Choose a Chapter --</option>
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.title}>
                {ch.title}
              </option>
            ))}
          </select>
        </div>

        {/* Content Name */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1 dark:text-white">
            Content Name
          </label>
          <input
            type="text"
            placeholder="-- Enter content name --"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Content Type */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-1 dark:text-white">
            Content Type
          </label>
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 dark:text-white">
              <input
                type="checkbox"
                checked={materials}
                onChange={(e) => setMaterials(e.target.checked)}
              />
              <span>Document</span>
            </label>
            <label className="flex items-center gap-2 dark:text-white">
              <input
                type="checkbox"
                checked={uploadvideo}
                onChange={(e) => setUploadVideo(e.target.checked)}
              />
              <span>Video</span>
            </label>
            <label className="flex items-center gap-2 dark:text-white">
              <input
                type="checkbox"
                checked={content}
                onChange={(e) => setContent(e.target.checked)}
              />
              <span>Text</span>
            </label>
          </div>
        </div>

        {/* Upload Document */}
        {materials && (
          <div className="flex flex-col">
            <label className="text-gray-800 font-medium mb-1">
              Upload Document (PDF/DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.ppt"
              onChange={(e) => setDocumentFile(e.target.files[0])}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {/* Upload Video */}
        {uploadvideo && (
          <div className="flex flex-col">
            <label className="text-gray-800 font-medium mb-1">
              Upload Video (MP4)
            </label>
            <input
              type="file"
              accept="video/mp4"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {/* Text Content */}
        {content && (
          <div className="flex flex-col">
            <label className="text-gray-800 font-medium mb-1">Text Content</label>
            <textarea
              placeholder="Enter your text content here..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Uploading state */}
        {isUploading && (
          <div className="text-blue-600 font-medium">
            Uploading... Please Wait
          </div>
        )}

        {/* Save button */}
        {!isUploading && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-[#084D90] text-white rounded-lg hover:bg-blue-800 transition font-medium"
            >
              Save Resource
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Documents;
