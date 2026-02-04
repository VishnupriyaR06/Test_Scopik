import axios from "axios";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

function CourseList({ onSuccess }) {
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [cardImage, setCardImage] = useState(null);
  const [chapter, setChapter] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [courseImage, setCourseImage] = useState(null);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);

  const [uploadingCardImage, setUploadingCardImage] = useState(false);
  const [uploadingCourseImage, setUploadingCourseImage] = useState(false);

  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;
  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_View_Category, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    if (key === "Image") setCardImage(file);
    if (key === "BackgroundImage") setCourseImage(file);
  };

const handleSubmit = async () => {
  if (!courseName || !courseDesc || !cardImage || !chapter || !duration || !price || !courseImage || category.length === 0) {
    alert("Please fill all required fields");
    return;
  }

  const formData = new FormData();
  formData.append("name", courseName);
  formData.append("description", courseDesc);
  formData.append("total_chap", chapter);
  formData.append("duration", duration);
  formData.append("price", price);

  // files
  formData.append("image", cardImage);
  formData.append("background_image", courseImage);

  // ? send each category as its own "categories" field
  category.forEach((cat) => {
    formData.append("categories", cat);
  });

  try {
    await axios.post(import.meta.env.VITE_Course, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Basic ${token}`,
      },
    });
    setSuccessMessage("Course added successfully.");
    setSuccessModal(true);
    resetForm();
    onSuccess && onSuccess();
  } catch (err) {
    console.error("Add course failed:", err.response?.data || err);
    alert("Failed to add course: " + (err.response?.data?.error || "Unknown error"));
  }
};

  const resetForm = () => {
    setCourseName("");
    setCourseDesc("");
    setCardImage(null);
    setChapter("");
    setDuration("");
    setPrice("");
    setCourseImage(null);
    setCategory([]);
  };

  const removeCategory = (catToRemove) => {
    setCategory((prev) => prev.filter((cat) => cat !== catToRemove));
  };

  const isFormComplete =
    courseName.trim() &&
    courseDesc.trim() &&
    cardImage &&
    chapter.trim() &&
    duration.trim() &&
    price.trim() &&
    courseImage &&
    category.length > 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto dark:bg-slate-900">
      {successModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center dark:bg-slate-900">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Success</h2>
            <p className="mb-6">{successMessage}</p>
            <button
              onClick={() => setSuccessModal(false)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-[#084D90] dark:text-blue-300">Add New Course</h1>

      <div className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-1 dark:text-white">
            Course Categories <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {category.map((cat) => (
              <span key={cat} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {cat}
                <button onClick={() => removeCategory(cat)} className="text-red-500 hover:text-red-700 ml-1 dark:text-black">×</button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => {
              const selected = e.target.value;
              if (selected && !category.includes(selected)) setCategory((prev) => [...prev, selected]);
            }}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 dark:bg-slate-800"
            value=""
          >
            <option value="" disabled>Select category to add</option>
            {categories.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <InputField label="Course Name" value={courseName} onChange={setCourseName} placeholder="Enter course name" required />
        <InputField label="Description" value={courseDesc} onChange={setCourseDesc} placeholder="Enter course description" textarea required />
        <InputField label="Total Chapters" value={chapter} onChange={setChapter} placeholder="Ex: 10" type="number" required />
        <InputField label="Duration" value={duration} onChange={setDuration} placeholder="Ex: 4 weeks" type="text" required />
        <InputField label="Price" value={price} onChange={setPrice} placeholder="Ex: 499" type="number" required />

        <ImageUpload title="Card Image" resolution="480x400" imageUrl={cardImage && URL.createObjectURL(cardImage)} onUpload={(e) => handleFileChange(e, "Image")} />
        <ImageUpload title="Background Image" resolution="1440x480" imageUrl={courseImage && URL.createObjectURL(courseImage)} onUpload={(e) => handleFileChange(e, "BackgroundImage")} />

        <button
          onClick={handleSubmit}
          disabled={!isFormComplete}
          className={`w-full px-5 py-3 rounded-lg text-lg font-semibold transition ${isFormComplete
              ? "bg-[#084D90] text-white hover:bg-blue-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Submit Course
        </button>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, textarea = false, required = false, type = "text" }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1 dark:text-white">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 dark:bg-slate-800" rows={4} required={required} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 dark:bg-slate-800" required={required} />
      )}
    </div>
  );
}

function ImageUpload({ title, resolution, imageUrl, onUpload }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1 dark:text-white">
        {title} <span className="text-sm text-gray-500">({resolution} px)</span>
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg w-full h-52 flex items-center justify-center hover:border-blue-400 transition relative group">
        <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        {imageUrl ? (
          <img src={imageUrl} className="h-full w-full object-cover rounded-lg" alt={title} />
        ) : (
          <p className="text-gray-500 text-center">
            Click or drag to upload <br />
            <span className="text-sm text-gray-400">Recommended: {resolution}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default CourseList;
