import { Link } from "react-router-dom";
import Frame from "/src/assets/newImage/AboutGirlOrange.png";

function LearnScopik() {
  return (
    <div className="w-full bg-white dark:bg-black text-black dark:text-white py-16 px-6 md:px-12 lg:px-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10 transition-colors duration-500">
      {/* Text Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center text-center">
        <h2 className="font-news text-3xl sm:text-5xl lg:text-6xl xl:text-7xl leading-snug">
          Learn in <span className="text-[#F97316]">Scopik</span>
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 pt-6 leading-relaxed text-justify max-w-xl">
          SCOPIK is deeply focused on AR/VR skill development, offering a NSQF,
          NSDC, and MESC-recognized curriculum tailored to the needs of Industry
          4.0. As an authorized Unity Education reseller, SCOPIK emphasizes
          project-based learning backed by strong industry tie-ups. The
          organization supports institutions with immersive lab setups and
          delivers AICTE-aligned undergraduate programs to ensure academic
          excellence. With robust placement support, regular guest lectures, and
          meaningful academic partnerships, SCOPIK bridges the gap between
          education and employability.
        </p>
        <div className="pt-8">
          <Link to="/course">
            <button className="bg-[#F97316] hover:bg-orange-600 text-white dark:text-black font-news text-lg px-6 py-3 rounded transition-all duration-300">
              Explore Course
            </button>
          </Link>
        </div>
      </div>

      {/* GIF/Image Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={Frame}
          alt="Course Preview"
          className="w-full max-w-sm lg:max-w-md"
        />
      </div>
    </div>
  );
}

export default LearnScopik;

