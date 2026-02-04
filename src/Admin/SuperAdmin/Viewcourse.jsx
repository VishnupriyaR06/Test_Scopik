import axios from "axios";
import { useEffect, useState } from "react";
import { Edit, Plus } from "lucide-react";
import { IoClose } from "react-icons/io5"; // Close button icon
import AddChapter from "./Course_Add/AddChapter";
import Documents from "./Course_Add/Documents";
import AddQuiz from "./Course_Add/AddQuiz";
import useTheme from "/src/Hooks/ThemeHook";

function CourseList({ onSuccess }) {
  const isDarkMode = useTheme();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  // Edit Course State
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [cardImage, setCardImage] = useState("");
  const [chapter, setChapter] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploadingCardImage, setUploadingCardImage] = useState(false);
  const [uploadingCourseImage, setUploadingCourseImage] = useState(false);

  // Add Chapter Modal
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeCourseForChapter, setActiveCourseForChapter] = useState(null);

  const [courseToDelete, setCourseToDelete] = useState(null);

  const username=import.meta.env.VITE_USER_NAME
  const password= import.meta.env.VITE_USER_PASS

  const token = btoa(`${username}:${password}`);
  useEffect(() => {
    fetchCourses();
    axios
      .get(import.meta.env.VITE_View_Category,{
        headers:{
          Authorization:`Basic ${token}`
        }
      })
      .then((res) => setCategories(res.data));
  }, []);

  const fetchCourses = () => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setCourses(res.data));
  };

  const handleUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset",import.meta.VITE_CLOUD_PRESET);
    data.append("cloud_name",import.meta.env.VITE_CLOUD_NAME);

    if (key === "Image") setUploadingCardImage(true);
    if (key === "BackgroundImage") setUploadingCourseImage(true);

    try {
      const res = await fetch(
        import.meta.env.VITE_CLOUD_IMAGE,
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();

      if (key === "Image") setCardImage(result.url);
      else if (key === "BackgroundImage") setCourseImage(result.url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      if (key === "Image") setUploadingCardImage(false);
      if (key === "BackgroundImage") setUploadingCourseImage(false);
    }
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setCourseName(course.name);
    setCourseDesc(course.description);
    setCardImage(course.image);
    setChapter(course.total_chap);
    setDuration(course.duration);
    setPrice(course.price);
    setCourseImage(course.background_image);
    setCategory(course.categories || []);
  };

  const handleDelete = (course) => {
    axios
      .delete(
        `${import.meta.env.VITE_DELETE_COURSE}${encodeURIComponent(
          course.name
        )}`
      )
      .then(() => {
        fetchCourses();
        setCourseToDelete(null);
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete the course.");
      });
  };

  const handleSubmit = () => {
    if (!editingCourse) return;

    const payload = {
      name: courseName,
      description: courseDesc,
      image: cardImage,
      total_chap: chapter,
      duration,
      price,
      background_image: courseImage,
      categories: category,
    };

    axios
      .put(
        `${import.meta.env.VITE_UPDATE_COURSE}${encodeURIComponent(
          editingCourse.name
        )}`,
        payload
      )
      .then(() => {
        fetchCourses();
        cancelEdit();
      })
      .catch((err) => console.error("Update failed:", err));
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setCourseName("");
    setCourseDesc("");
    setCardImage("");
    setChapter("");
    setDuration("");
    setPrice("");
    setCourseImage("");
    setCategory([]);
  };

  const openAddChapterModal = (course) => {
    setActiveCourseForChapter(course);
    setCurrentStep(1);
    setShowAddChapterModal(true);
  };

  const closeAddChapterModal = () => {
    setShowAddChapterModal(false);
    setActiveCourseForChapter(null);
    setCurrentStep(1);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleAddChapterSuccess = () => nextStep();
  const handleDocumentsSuccess = () => nextStep();

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 rounded-lg shadow-md max-w-screen-xl mx-auto bg-white dark:bg-slate-900">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white dark:bg-slate-900 gap-3">
  <h1 className="text-3xl font-bold dark:text-orange-400">Courses</h1>
  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border bg-white  p-2 rounded shadow-sm w-full md:w-64 dark:bg-gray-600 text-white"
  />
</div>

      {/* Inline Edit Form */}
      {editingCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-5xl relative max-h-[90vh] overflow-y-auto dark:bg-slate-900">
          <div className="flex justify-between items-center mb-4 py-3 px-2 sticky top-0  z-10
             ${
        isDarkMode ? 'text-white' : 'text-gray-800'}"> 
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Edit Course - {editingCourse.name}
              </h2>
              <IoClose
                size={26}
                onClick={cancelEdit}
                className="cursor-pointer text-gray-600  dark:text-white"
              />
            </div>

            <div className="">
              <label className="font-medium text-black  dark:text-white">Course Name</label>
              <input
                placeholder="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full border p-2 mt-2 rounded mb-4"
              />
              <label className="font-medium text-black  dark:text-white">
                Course Description
              </label>
              <textarea
                placeholder="Description"
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              />
              <label className="font-medium text-black  dark:text-white">Total Chapters</label>
              <input
                placeholder="Total Chapters"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              />
              <label className="font-medium text-black  dark:text-white">Duration</label>
              <input
                placeholder="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              />
              <label className="font-medium text-black  dark:text-white">Price</label>
              <input
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              />

              {/* Categories Dropdown */}
              <div>
                <label className="block font-medium mb-1  dark:text-white">
                  Course Categories
                </label>
                <select
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected && !category.includes(selected)) {
                      setCategory([...category, selected]);
                    }
                  }}
                  className="border p-2 rounded w-full"
                  value=""
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap my-2 gap-2">
                  {category.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-1 bg-blue-200 text-sm rounded-full"
                    >
                      {cat}{" "}
                      <button
                        onClick={() =>
                          setCategory(category.filter((c) => c !== cat))
                        }
                        className="text-red-500 ml-1  dark:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Uploads */}
              {["Card Image", "Background Image"].map((label, i) => {
                const key = i === 0 ? "Image" : "BackgroundImage";
                const uploading =
                  i === 0 ? uploadingCardImage : uploadingCourseImage;
                const imageUrl = i === 0 ? cardImage : courseImage;
                return (
                  <div key={key}>
                    <label className="block font-medium mt-2 mb-1  dark:text-white">
                      {label}
                    </label>
                    <div className="border-2 border-dashed rounded-md w-full h-48 flex items-center justify-center relative group ">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpload(e, key)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                          <span className="text-sm text-blue-600 mt-2">
                            Uploading...
                          </span>
                        </div>
                      ) : imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={label}
                          className="h-full w-full object-cover rounded"
                        />
                      ) : (
                        <p className="text-gray-500">Click to upload image</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Delete Course
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the course{" "}
              <span className="font-semibold">{courseToDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(courseToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {filteredCourses.map((course) => (
         <div
            key={course.id}
            className="p-4 rounded-md flex flex-col justify-between dark:bg-slate-800"
          >
            <img
              src={course.image}
              alt={course.name}
              className="w-full h-40 object-fit rounded"
            />
            <div className="flex flex-col">
               <h2 className="text-lg font-bold text-blue-900 dark:text-blue-600">{course.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2 dark:text-white">
                {course.description}
              </p>
            </div>
            <button
              onClick={() => openAddChapterModal(course)}
              className="flex items-center justify-center gap-1 px-6 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600  mb-2"
            >
              <Plus size={16} /> Add Chapter
            </button>
            <div className="w-full flex justify-between items-center gap-4">
              <button
                className="border w-full bg-blue-600 text-sm shadow-md text-white px-6 py-2 rounded-full"
                onClick={() => editCourse(course)}
              >
                Edit Course
              </button>
              <button
                className="border w-full text-sm bg-red-400 shadow-md text-white px-6 py-2 rounded-full"
                onClick={() => setCourseToDelete(course)}
              >
                Delete Course
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Chapter Modal */}
      {showAddChapterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl h-[90vh] overflow-y-auto relative dark:bg-slate-800">
            <IoClose
              size={26}
              onClick={closeAddChapterModal}
              className="absolute top-3 right-3 text-gray-600 cursor-pointer"
            />
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Add Chapter - {activeCourseForChapter?.name}
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full ${
                  currentStep === 1
                    ? "w-1/3 bg-blue-500"
                    : currentStep === 2
                    ? "w-2/3 bg-blue-600"
                    : "w-full bg-green-500"
                }`}
              ></div>
            </div>
            <p className="mb-2 text-gray-600 dark:text-white ">Step {currentStep} of 3</p>

            <div className="border p-4 rounded-lg mb-4">
              {currentStep === 1 && (
                <AddChapter
                  course={activeCourseForChapter}
                  onSuccess={handleAddChapterSuccess}
                />
              )}
              {currentStep === 2 && (
                <Documents
                  course={activeCourseForChapter}
                  onSuccess={handleDocumentsSuccess}
                />
              )}
              {currentStep === 3 && <AddQuiz course={activeCourseForChapter} />}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded ${
                  currentStep === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <button
                onClick={currentStep === 3 ? closeAddChapterModal : nextStep}
                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
              >
                {currentStep === 3 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseList;