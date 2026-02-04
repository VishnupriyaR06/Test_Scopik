import React, { useContext, useRef, useEffect } from "react";
import { CourseContext } from "/src/App";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function DigitalDreamsCard() {
  const { Course = [] } = useContext(CourseContext);

  const baseCourses = Course.slice(0, 5);
  const marqueeRef = useRef(null);
const isPausedRef = useRef(false);

 const handleMouseEnter = () => {
  isPausedRef.current = true;
};

const handleMouseLeave = () => {
  isPausedRef.current = false;
};

 useEffect(() => {
  const el = marqueeRef.current;
  if (!el) return;

  let raf;
  const speed = 0.5;
  let initialized = false;

  const animate = () => {
    // Wait until layout is ready
    if (!initialized) {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = el.scrollWidth / 2;
        initialized = true;
      }
    } else if (!isPausedRef.current) {
      el.scrollLeft += speed;

      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half;
      }
    }

    raf = requestAnimationFrame(animate);
  };

  animate();
  return () => cancelAnimationFrame(raf);
}, [baseCourses.length]);

  return (
    <div className="w-full bg-white dark:bg-black flex flex-col items-center  justify-center px-4 py-16 transition-colors duration-500">
      {/* Title */}
      <h1 className="text-2xl md:text-4xl xl:text-5xl mb-2 text-center text-[#F97316] font-news">
        <span className="text-black dark:text-white">Trending</span> Courses
      </h1>

      {/* Infinite marquee wrapper */}
      <div
        ref={marqueeRef}
         onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
className="w-full overflow-x-scroll overflow-y-visible scrollbar-hide mt-4 pb-10 cursor-grab active:cursor-grabbing"
      >
        <div className="flex gap-10 w-max items-center">
          {[...baseCourses, ...baseCourses].map((course, index) => (
            <div
              key={`course-${index}-${course.id}`}
              className="relative group w-[300px] h-[150px] sm:w-[300px] rounded-3xl overflow-hidden transition-all duration-500 hover:h-[340px] text-[#F97316] dark:text-white bg-white dark:bg-transparent
        hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {/* Image */}
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-[180px] object-cover rounded-2xl shadow-md"
              />

              {/* Hidden Content */}
              <div className="absolute top-[160px] px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-200 w-full">
                <div className="flex flex-col items-center text-center">
                  <span className="inline-block bg-[#F97316] text-xs font-semibold px-3 py-1 rounded-full mb-2 text-white">
                    TRENDING
                  </span>
<div className="flex flex-col items-center justify-center text-center ">
                  {/* Ratings */}
                   <div className="flex items-center space-x-1 mb-1">
                     {[1, 2, 3, 4, 5].map((star) => star <= Math.round(course.ratings) 
                     ?
                    (<Star key={star} size={14} 
                     className="text-yellow-400 fill-yellow-400" 
                     strokeWidth={1.5} />) 
                     : 
                     (<Star key={star} size={14} 
                     className="text-gray-400"
                      strokeWidth={1.5} fill="none"
                       />))}
                        </div>
                  <h2 className="text-lg xl:text-xl font-bold font-news">
                    {course.name}
                  </h2>

                  <Link to={`/course/${course.id}`} className="mt-2">
                    <button className="py-1 px-4 border-2 border-[#F97316] text-[#F97316] rounded-full text-sm font-semibold hover:bg-[#F97316] hover:text-white transition">
                      View Course
                    </button>
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}