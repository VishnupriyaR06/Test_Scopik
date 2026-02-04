

import axios from "axios";
import { useEffect, useState } from "react";

function Documents({ onSuccess }) {
  const [document, setDocument] = useState("");
  const [materials, setMaterials] = useState(false);
  const [uploadvideo, setUploadVideo] = useState(false);
  const [content, setContent] = useState(false);
  const [text, setText] = useState("");
  const [value, setValue] = useState("");
  const [course, setCourse] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [video, setVideo] = useState("");
  const [viewDocForm, setViewDocForm] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");


  const username=import.meta.env.VITE_USER_NAME
  const password= import.meta.env.VITE_USER_PASS

  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCourse(res.data));
  }, []);

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", type === "video" ? import.meta.env.VITE_CLOUD_PRESET : import.meta.env.VITE_CLOUD_DOC);
    formData.append("cloud_name",import.meta.env.VITE_CLOUD_NAME);

    const endpoint =
      type === "video"
        ? import.meta.env.VITE_CLOUD_VIDEO
        : import.meta.env.VITE_CLOUD_AUTO;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      type === "video" ? setVideo(data.url) : setDocument(data.url);
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      showModal("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (materials && document) {
        await axios.post(import.meta.env.VITE_Document, {
          document,
          document_name: text,
          chapter_name: chapterName,
        });
      } else if (uploadvideo && video) {
        await axios.post(import.meta.env.VITE_VIDEO, {
          video,
          video_name: text,
          chapter_name: chapterName,
        });
      } else if (content && value) {
        await axios.post(import.meta.env.VITE_TEXT, {
          text_content: value,
          chapter_name: chapterName,
        });
      }

      showModal("Resources added Successfully");
    } catch (err) {
      console.error("Upload failed:", err);
      showModal("Upload failed. Please try again.");
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    if (modalMessage === "Resources added Successfully") {
      setViewDocForm(false);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 w-11/12 max-w-sm">
            <h2 className="text-xl font-semibold text-green-700">Success</h2>
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

      {/* Header */}
      <div className="bg-white p-5 rounded-md shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-black">Chapter Resources</h1>
        <button
          onClick={() => setViewDocForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto"
        >
          Add Resource
        </button>
      </div>

      {/* Form */}
      {viewDocForm && (
        <div className="mt-6 bg-white p-6 rounded-md shadow-md space-y-6">
          {/* Chapter Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="w-full sm:w-40 font-medium text-black">Chapter:</label>
            <select
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              className="w-full sm:w-96 p-2 border rounded focus:outline-blue-400"
            >
              <option value="">Select Chapter</option>
              {course.flatMap((courseItem) =>
                courseItem.chapters?.map((ch) => (
                  <option key={ch.id} value={ch.title}>
                    {ch.title}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Content Name */}
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="w-full sm:w-40 font-medium text-black">Content Name:</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full sm:w-96 p-2 border rounded focus:outline-blue-400"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="w-full sm:w-40 font-medium text-black">Content Type:</label>
            <div className="flex flex-wrap gap-5">
              <label className="flex gap-2 items-center">
                <input type="checkbox" onChange={(e) => setMaterials(e.target.checked)} />
                <span>Document</span>
              </label>
              <label className="flex gap-2 items-center">
                <input type="checkbox" onChange={(e) => setUploadVideo(e.target.checked)} />
                <span>Video</span>
              </label>
              <label className="flex gap-2 items-center">
                <input type="checkbox" onChange={(e) => setContent(e.target.checked)} />
                <span>Text</span>
              </label>
            </div>
          </div>

          {/* Upload Document */}
          {materials && (
            <div className="flex flex-col gap-3">
              <label className="text-black font-semibold text-md">Upload Document (PDF/DOCX):</label>
              <input
                type="file"
                accept=".pdf,.docx,.ppt"
                onChange={(e) => handleUpload(e, "document")}
                className="border p-2 rounded w-full max-w-md"
              />
            </div>
          )}

          {/* Upload Video */}
          {uploadvideo && (
            <div className="flex flex-col gap-3">
              <label className="text-black font-semibold text-md">Upload Video:</label>
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => handleUpload(e, "video")}
                className="border p-2 rounded w-full max-w-md"
              />
            </div>
          )}

          {/* Text Content */}
          {content && (
            <div className="flex flex-col gap-3">
              <label className="text-black font-semibold text-md">Add Text Content:</label>
              <textarea
                placeholder="Enter your text content"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={5}
                className="border p-3 w-full max-w-2xl rounded focus:outline-blue-400"
              />
            </div>
          )}

          {/* Loader */}
          {isUploading && (
            <div className="text-center text-blue-600 font-medium">Uploading to Cloudinary...</div>
          )}

          {/* Save Button */}
          {!isUploading && (
            <div className="pt-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
                onClick={handleSave}
              >
                Save Resource
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Documents;
