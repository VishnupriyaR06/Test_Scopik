import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaUserTie,
} from "react-icons/fa";
import useTheme from "/src/Hooks/ThemeHook.js";

function WhatWeHave() {
  const isDarkMode = useTheme();

  const features = [
    {
      icon: <FaUserGraduate size={48} />,
      title: "12,836",
      subtitle: "Students",
    },
    {
      icon: <FaChalkboardTeacher size={48} />,
      title: "Detailed",
      subtitle: "Classes",
    },
    {
      icon: <FaBookOpen size={48} />,
      title: "35+",
      subtitle: "Courses",
    },
    {
      icon: <FaUserTie size={48} />,
      title: "Professional",
      subtitle: "Staff",
    },
  ];

  return (
    <div
      className={`p-6 font-inter ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Title & Description */}
      <div className="my-10 text-center px-4">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-400 mb-4">
          What You'll Learn
        </h3>
        <p
          className={`text-base sm:text-lg lg:text-xl max-w-4xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Learn from the best in the industry and gain lifetime access to
          premium content, deep dives, and hands-on learning.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {features.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 lg:p-8 text-center backdrop-blur-md transition duration-300 group hover:scale-105 shadow-[0_8px_30px_rgba(255,115,0,0.35)] hover:shadow-orange-500/50 ${
              isDarkMode
                ? "bg-white/10 border border-orange-400/30 text-white"
                : "bg-gray-100 border border-orange-300 text-black"
            }`}
          >
            <div className="text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold mb-1">
              {item.title}
            </h3>
            <p
              className={`text-lg lg:text-xl ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhatWeHave;
