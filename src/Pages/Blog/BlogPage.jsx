import { useEffect, useState } from "react";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook.js";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import blogAnimation from "/src/assets/blogs/Blogs.json";

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogData, setBlog] = useState([]);
  const [categories, setCategory] = useState([]);
  const isDarkMode = useTheme();


  const user=import.meta.env.VITE_USER_NAME
  const pass=import.meta.env.VITE_USER_PASS

  const token = btoa(`${user}:${pass}`)



  useEffect(() => {
    axios.get(import.meta.env.VITE_BLOG_CAT,{
      headers:{
        Authorization:`Basic ${token}`
      }
    })
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : res.data.categories || [];
        const normalized = raw.map((item) => item.Category);
        setCategory(normalized);
      })
      .catch((err) => console.error("Category API Error:", err));
  }, []);

  // Fetch blogs
  useEffect(() => {
    axios.get(import.meta.env.VITE_BLOG_VIEW,{
      headers:{
        Authorization:`Basic ${token}`
      }
    })
      .then((res) => {
        const blogList = Array.isArray(res.data) ? res.data : res.data.blogs || [];
        setBlog(blogList);
      })
      .catch((err) => console.error("Blog API Error:", err));
  }, []);

  // Filter blogs by selected category
  const filteredBlogs = blogData
    .filter((blog) => {
      if (selectedCategory === "All") return true;
      return blog.category === selectedCategory || blog.categoryName === selectedCategory;
    })
    .sort((a, b) => a.title?.localeCompare(b.title));

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 min-h-screen">

      {/* ---------- Lottie Banner ---------- */}
      <div className="text-center py-10 relative">
        <h1 className="text-[120px] md:text-[240px] lg:text-[350px] xl:text-[400px] font-extrabold text-orange-500 opacity-40 absolute inset-0 flex items-center justify-center z-0">
          BLOGS
        </h1>
        <div className="relative z-10">
          <Lottie
            animationData={blogAnimation}
            loop
            className="mx-auto w-2/3 max-w-md md:max-w-lg rounded-xl"
          />
        </div>
      </div>

      {/* ---------- Category Buttons (Always visible) ---------- */}
      <div className="sticky top-[62px] z-30 backdrop-blur-md bg-white/80 dark:bg-black/10 rounded-xl mx-4 px-4 py-3 flex justify-center flex-wrap gap-4 mb-10 shadow-lg">
        {["All", ...categories].map((cat, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(cat)}
            className={`text-sm md:text-base px-5 py-2 rounded-full border-2 font-semibold transition duration-300 ${
              selectedCategory === cat
                ? "bg-orange-500 border-orange-500 text-white dark:text-black"
                : "border-gray-300 dark:border-gray-700 text-black dark:text-white bg-white dark:bg-transparent hover:border-orange-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---------- Blog Cards ---------- */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-6 pb-20 max-w-6xl mx-auto">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl overflow-hidden shadow hover:shadow-orange-500/40 transition duration-300"
            >
             <img
  src={
    blog.images && blog.images.length > 0
      ? blog.images[0].startsWith("http")
        ? blog.images[0]
        : `${import.meta.env.VITE_BASE_URL}${blog.images[0]}`
      : "/default-image.jpg"
  }
  alt={blog.title || "Blog Image"}
  className="h-48 w-full object-fill rounded-md mb-4"
  onError={(e) => (e.target.src = "/default-image.jpg")}
/>

              <div className="p-6 flex flex-col justify-between">
                <h2 className="text-xl font-bold text-orange-500 mb-2">
                  {blog.title || "Untitled Blog"}
                </h2>

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                  {(blog.content || blog.description || "")
                    .split(" ")
                    .slice(0, 10)
                    .join(" ")}...
                </p>

                <div className="flex justify-end">
                  <Link
                    to={`/blogs/${blog.id}`}
                    className={`text-lg font-medium mt-2 inline-block hover:underline ${
                      isDarkMode ? "text-orange-500" : "text-blue-600"
                    }`}
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No blogs found for this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
