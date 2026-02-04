import axios from "axios";
import { useEffect, useState } from "react";

function Addblog() {
  const [add, setAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [blogs, setBlogs] = useState([]);

  const [addCategory, setAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [bcategory, setBcategory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  // Image upload states
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedBlogForImage, setSelectedBlogForImage] = useState("");

  const token = btoa(
    `${import.meta.env.VITE_USER_NAME || "admin"}:${
      import.meta.env.VITE_USER_PASS || "password"
    }`
  );

  const fetchBlogs = () => {
    axios
      .get(import.meta.env.VITE_BLOG_VIEW, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setBlogs(res.data || []))
      .catch(() => setPopupMessage("Failed to fetch blogs"));
  };

  const fetchCategories = () => {
    axios
      .get(import.meta.env.VITE_BLOG_CAT, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => setBcategory(res.data || []))
      .catch(() => setPopupMessage("Failed to fetch categories"));
  };

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setPopupMessage("Category name cannot be empty.");
      return;
    }
    axios
      .post(
        import.meta.env.VITE_BLOG_CAT_ADD,
        { category_name: newCategory.trim() },
        { headers: { Authorization: `Basic ${token}` } }
      )
      .then(() => {
        setPopupMessage("Category added successfully!");
        setNewCategory("");
        setAddCategory(false);
        fetchCategories();
      })
      .catch(() => setPopupMessage("Failed to add category."));
  };

  const handleSubmit = () => {
    if (!title || !category || !content) {
      setPopupMessage("Please fill in all fields.");
      return;
    }
    axios
      .post(
        import.meta.env.VITE_BLOG_UPLOAD,
        { title, content, category },
        { headers: { Authorization: `Basic ${token}` } }
      )
      .then(() => {
        setPopupMessage("Blog added successfully!");
        fetchBlogs();
        setTitle("");
        setContent("");
        setCategory("");
        setSelectedImages([]);
        setPreviewImages([]);
        setUploadProgress(0);
      })
      .catch(() => setPopupMessage("Blog upload failed. Please try again."));
  };

  const handleUpdate = () => {
    if (!title || !category || !content) {
      setPopupMessage("Please fill in all fields.");
      return;
    }
    axios
      .put(
        `${import.meta.env.VITE_BLOG_EDIT}${editTitle}`,
        { title, content, category },
        { headers: { Authorization: `Basic ${token}` } }
      )
      .then(() => {
        setPopupMessage("Blog updated successfully!");
        setTitle("");
        setContent("");
        setCategory("");
        setAdd(false);
        setEditMode(false);
        setSelectedImages([]);
        setPreviewImages([]);
        setUploadProgress(0);
        setSelectedBlogForImage("");
        fetchBlogs();
      })
      .catch(() => setPopupMessage("Failed to update blog."));
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category);
    setEditTitle(blog.title);
    setAdd(true);
    setEditMode(true);
  };

  const handleDelete = (name) => {
    axios
      .delete(`${import.meta.env.VITE_BLOG_DELETE}${name}`, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then(() => {
        fetchBlogs();
        setPopupMessage("Blog deleted successfully");
      })
      .catch(() => setPopupMessage("Failed to delete blog"));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const removeSelectedImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  const handleImageUpload = async () => {
    if (!selectedBlogForImage) {
      setPopupMessage("Please select a blog title.");
      return;
    }
    if (selectedImages.length === 0) {
      setPopupMessage("Please select at least one image.");
      return;
    }
    try {
      for (const file of selectedImages) {
        const formData = new FormData();
        formData.append("title", selectedBlogForImage);
        formData.append("image", file);

        await axios.post(
          import.meta.env.VITE_BLOG_IMAGE_UPLOAD ||
            "https://lms.scopik.in/api/createblogimage/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Basic ${token}`,
            },
            onUploadProgress: (e) => {
              const progress = Math.round((e.loaded * 100) / e.total);
              setUploadProgress(progress);
            },
          }
        );
      }
      setPopupMessage("Images uploaded successfully!");
      setSelectedImages([]);
      setPreviewImages([]);
      setUploadProgress(0);
      setSelectedBlogForImage("");
      fetchBlogs();
    } catch (error) {
      console.error(error);
      setPopupMessage("Failed to upload images. Try again.");
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto p-6 space-y-10 bg-white rounded-xl shadow dark:bg-slate-800">
      {/* Popup */}
      {popupMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {popupMessage}
            </h2>
            <button
              onClick={() => setPopupMessage("")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-orange-400">
          Blogs
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setAddCategory(!addCategory)}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 text-white rounded-lg font-medium shadow w-full sm:w-auto"
          >
            + Blog Category
          </button>
          <button
            onClick={() => {
              setAdd(true);
              setEditMode(false);
              setTitle("");
              setContent("");
              setCategory("");
            }}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 text-white rounded-lg font-medium shadow w-full sm:w-auto"
          >
            + Add Blog
          </button>
        </div>
      </div>

      {/* Add Category */}
      {addCategory && (
        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row gap-3 items-stretch max-w-md w-full">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="border border-gray-300 rounded-lg p-2 flex-1 dark:bg-slate-700 dark:text-white dark:border-slate-600"
          />
          <button
            onClick={handleAddCategory}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg"
          >
            Add
          </button>
          <button
            onClick={() => {
              setAddCategory(false);
              setNewCategory("");
            }}
            className="text-sm px-3 py-2 rounded-lg text-gray-600 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Add/Edit Blog Form */}
      {add && (
        <div className="bg-gray-100 dark:bg-slate-900 p-6 rounded-lg shadow space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 font-medium mb-1 dark:text-white">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter blog title"
                className="border border-gray-300 rounded-lg p-3 text-gray-800 dark:bg-slate-700 dark:text-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 font-medium mb-1 dark:text-white">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="border border-gray-300 rounded-lg p-3 text-gray-800 dark:bg-slate-700 dark:text-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {bcategory.map((cat, i) => (
                  <option key={i} value={cat.Category || cat.category_name}>
                    {cat.Category || cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm text-gray-600 font-medium mb-1 dark:text-white">
                Blog Content <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                placeholder="Write blog content..."
                className="border border-gray-300 rounded-lg p-3 text-gray-800 dark:bg-slate-700 dark:text-white"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end mt-4 gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 text-white rounded-lg font-semibold w-full sm:w-auto"
                >
                  Update Blog
                </button>
                <button
                  onClick={() => {
                    setAdd(false);
                    setEditMode(false);
                    setTitle("");
                    setContent("");
                    setCategory("");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 px-6 py-2 text-white rounded-lg font-semibold w-full sm:w-auto"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 text-white rounded-lg font-semibold w-full sm:w-auto"
              >
                Save Blog
              </button>
            )}
          </div>

          {/* Image Upload Section (inside Add/Edit form) */}
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg shadow mt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Upload Images for Blog
            </h3>

            <select
              value={selectedBlogForImage}
              onChange={(e) => setSelectedBlogForImage(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 text-gray-800 dark:bg-slate-700 dark:text-white w-full"
            >
              <option value="">Select blog title</option>
              {blogs.map((blog, i) => (
                <option key={i} value={blog.title}>
                  {blog.title}
                </option>
              ))}
            </select>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Click or drag images here
              </p>
            </label>

            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {previewImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative group border rounded-lg overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`preview-${i}`}
                      className="h-24 w-full object-cover"
                    />
                    <button
                      onClick={() => removeSelectedImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs opacity-80 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleImageUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Upload Images
              </button>
              <button
                onClick={() => {
                  setSelectedImages([]);
                  setPreviewImages([]);
                  setSelectedBlogForImage("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <div className="grid md:grid-cols-3 gap-6 h-[400px] overflow-y-scroll pr-2">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-lg shadow-md border p-4 flex flex-col justify-between"
            >
              {blog.images && blog.images.length > 0 ? (
                <img
                  src={
                    blog.images?.[0]?.startsWith("http")
                      ? blog.images[0]
                      : `${import.meta.env.VITE_BASE_URL}${blog.images[0]}`
                  }
                  alt={blog.title}
                  className="h-48 w-full object-cover rounded-md mb-4"
                />
              ) : (
                <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-md mb-4 flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3 text-justify">
                {blog.content || "No description available."}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
                Category: {blog.category}
              </p>
              <div className="flex justify-center gap-3 mt-auto">
                <button
                  onClick={() => handleEdit(blog)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.title)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Addblog;
