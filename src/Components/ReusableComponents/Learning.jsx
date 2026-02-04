import image1 from "/src/assets/newImage/about1.png";
import image2 from "/src/assets/newImage/about2.png";
import image3 from "/src/assets/newImage/about3.png";

function Learning() {
  const learn = [
    {
      image: image1,
      title: "Enrolling the Course",
      para: "Easily sign up for your desired course with just a few clicks. Choose your topic, register online, and start learning right away.",
    },
    {
      image: image2,
      title: "Attend Assessments",
      para: "Test your understanding with interactive assessments designed to reinforce key concepts and track your progress effectively.",
    },
    {
      image: image3,
      title: "Collect the Certificate",
      para: "Receive a digital certificate upon course completion, showcasing your skills and achievements to employers or peers.",
    },
  ];

  return (
    <div className="w-full pt-1 pb-10 px-4  sm:px-10 bg-white text-black dark:bg-black dark:text-white transition-colors duration-500">
      <h2 className="text-4xl md:text-5xl xl:text-5xl font-news text-[#F97316] dark:text-[#FF6A00] text-center mb-10">
        <span className="text-black dark:text-white">Learning </span>Process
      </h2>

      <div className="flex mt-2 justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl">
          {learn.map((l, index) => (
            <div
              key={index}
              className={`bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-purple-300/20 text-black dark:text-white backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 hover:border-orange-300 hover:shadow-[0_0_20px_4px_#FDBA74] hover:scale-105 transition-all duration-500 ${
                index === 2
                  ? "sm:col-span-2 sm:mx-auto lg:col-span-1 lg:mx-0"
                  : ""
              }`}
            >
              <img
                src={l.image}
                alt={l.title}
                className="w-20 h-20 mx-auto object-contain mb-6"
              />
              <h3 className="text-xl sm:text-2xl font-manrope font-semibold text-center text-black dark:text-white mb-3">
                {l.title}
              </h3>
              <p className="text-sm sm:text-base font-manrope text-center text-gray-700 dark:text-gray-300">
                {l.para}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Learning;