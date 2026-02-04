import { useEffect, useState } from "react";
import useTheme from "/src/Hooks/ThemeHook.js";
import { Link } from "react-router-dom";
import axios from "axios";

function Blog() {
  const isDarkMode = useTheme()
  const [blogData, setBlog] = useState([])
  const [blog_image, setBlogImage] = useState([])
  const filteredBlog = blogData.slice(0, 3);


  const user=import.meta.env.VITE_USER_NAME;
  const pass=import.meta.env.VITE_USER_PASS

  const token = btoa(`${user}:${pass}`)

  useEffect(() => {
    axios.get(import.meta.env.VITE_BLOG_VIEW,{
      headers:{Authorization:`Basic ${token}`}
    }).then((res) => {
      console.log(res.data)
      setBlog(res.data);

      res.data.forEach((blog, idx) => {
        setBlogImage(blog.images)
      });
    });
  }, []);


  return (
    <div className="py-2">
      <div className="text-center font-[Newsreader]">
        <h1
          className={`text-3xl md:text-4xl xl:text-5xl font-news text-center ${isDarkMode ? "text-orange-400" : "text-[#F97316]"
            }`}
        >
          <span className="text-black dark:text-white">Latest</span> Blogs
        </h1>
      </div>
      <div className="flex flex-wrap justify-center gap-5 mt-1 p-10 overflow-hidden">
        {filteredBlog.map((blog, index) => (
          <div
            key={index}
            className={`md:w-[400px] w-[350px] rounded-2xl transition-all duration-300 overflow-hidden ${isDarkMode
                ? "bg-white text-black hover:shadow-xl"
                : "bg-[#f1f1f1] shadow-[10px_10px_30px_#d1d1d1,_-10px_-10px_30px_#ffffff]"
              } hover:scale-105`}
          >
            <img
              className="w-full h-48 object-fit rounded-t-2xl"
              src={blog.images?.[0] ? `${import.meta.env.VITE_BASE_URL}${blog.images[0]}` : "/placeholder.jpg"}

              alt="Blog"
            />

            <div className="p-4">
              <h3
                className={`text-lg font-medium font-manrope ${isDarkMode ? "text-black" : "text-gray-900"
                  }`}
              >
                {blog.title}
              </h3>
              <p
                className={`text-sm mt-2 ${isDarkMode ? "text-gray-600" : "text-gray-500"
                  }`}
              >
                {blog.date}
              </p>
              <Link
                to={`/blogs/${blog.id}`}
                className={`text-lg font-medium mt-2 inline-block hover:underline ${isDarkMode ? "text-orange-500" : "text-blue-600"
                  }`}
              >
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;