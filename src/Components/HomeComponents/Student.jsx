import student from "/src/assets/profile/pic.png";
import darkBG from "/src/assets/bg/BlackMap.png";
import lightBG from "/src/assets/bg/WhiteMap.png";
import { FaQuoteLeft } from "react-icons/fa";
import useTheme from "/src/Hooks/ThemeHook.js";
import { useEffect, useState } from "react";
import axios from "axios";

const TestimonialCarousel = () => {
  const isDarkMode = useTheme();
  const [testimonials, setTestimonials] = useState([]);
  const backgroundImage = isDarkMode ? darkBG : lightBG;

  const user = import.meta.env.VITE_USER_NAME;
  const pass = import.meta.env.VITE_USER_PASS;

  const token = btoa(`${user}:${pass}`);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_STUDENT_REVIEW, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        // Ensure testimonials is always an array
        if (Array.isArray(res.data)) {
          setTestimonials(res.data);
        } else if (res.data?.results) {
          setTestimonials(res.data.results);
        } else {
          console.warn("Unexpected data format for testimonials", res.data);
          setTestimonials([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
        setTestimonials([]);
      });
  }, []);

  return (
    <div
      className="overflow-x-hidden bg-no-repeat bg-cover py-20 dark:bg-black transition-colors duration-500"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="text-center px-4">
        <h2
          className={`text-4xl md:text-5xl xl:text-5xl font-news text-center ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          What our <span className="text-[#F97316]">Students</span> Say!
        </h2>
      </div>

      <div className="relative w-full mt-20">
        <div
          className="flex animate-scroll whitespace-nowrap gap-6 sm:gap-8 px-6 sm:px-12"
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {Array.isArray(testimonials) &&
            testimonials.map((t, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[90%] sm:w-[65%] md:w-[50%] lg:w-[38%] xl:w-[30%] 2xl:w-[28%] ${
                  isDarkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-black/5 border-black/10"
                } backdrop-blur-sm border rounded-2xl shadow-md p-6 sm:p-8 text-start transition-all duration-300 hover:scale-105`}
              >
                <div className="text-[#FF8922] text-4xl font-serif mb-3">
                  <FaQuoteLeft />
                </div>

                <p
                  className={`italic text-sm font-manrope text-wrap sm:text-base mb-6 line-clamp-5 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {t.feedback}
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={student}
                    alt="Student"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3
                      className={`font-semibold text-base ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {t.student}
                    </h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t.course}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          <style>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-scroll {
              animation: scroll 20s linear infinite;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
