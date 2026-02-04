import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaUserTie,
} from "react-icons/fa";

const dataFetch = [
  {
    icon: (
      <FaUserGraduate
        className="text-orange-500 dark:group-hover:text-orange-500 transition duration-300"
        size={50}
      />
    ),
    value: 12836,
    des: "Students",
  },
  {
    icon: (
      <FaChalkboardTeacher
        className="text-orange-500 dark:group-hover:text-orange-500 transition duration-300"
        size={50}
      />
    ),
    value: "Detailed",
    des: "Classes",
  },
  {
    icon: (
      <FaBookOpen
        className="text-orange-500 dark:group-hover:text-orange-500 transition duration-300"
        size={50}
      />
    ),
    value: "35+",
    des: "Courses",
  },
  {
    icon: (
      <FaUserTie
        className="text-orange-500 dark:group-hover:text-orange-500 transition duration-300"
        size={50}
      />
    ),
    value: "Professional",
    des: "Staffs",
  },
];

function Future() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white w-full transition-colors duration-500">
      <div className="mx-4 sm:mx-10 md:mx-20 py-20">
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-news text-black dark:text-white mb-6 text-center">
          Building the <span className="text-[#FF6A00]">Future of Learning</span> 
        </h1>
        <p className="text-center mt-4 font-manrope text-base sm:text-md md:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-gray-300 max-w-6xl mx-auto leading-relaxed">
          SCOPIK LMS personalizes education by aggregating content from various
          sources and using AI to recommend and deliver learning across digital
          touchpoints. It includes a full suite of tools for designing,
          managing, and monitoring engaging and adaptive learning environments.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {dataFetch.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-[#1a1a1a] hover:bg-orange-50 dark:hover:bg-[#222] transition-all duration-300 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 group"
            >
              <div className="mb-4">{item.icon}</div>
              <p className="text-orange-500 dark:text-[#FF6A00] text-3xl font-bold font-news mb-1">
                {item.value}
              </p>
              <p className="text-gray-800 dark:text-gray-200 font-news text-lg">
                {item.des}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Future;

