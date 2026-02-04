import React, { useState, useEffect } from "react";
import slider1 from "/src/assets/newImage/header1.jpg";
import slider2 from "/src/assets/newImage/header2.jpg";
import slider3 from "/src/assets/newImage/header3.jpg";
import { Link } from "react-router-dom";
import image from "../../assets/banner 1.png"
const slides = [
  {
    id: 1,
    image: slider1,
  },
  {
    id: 2,
    image: slider2,
  },
  {
    id: 3,
    image: slider3,
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="relative w-full h-[500px] mt-19 max-w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Background Image */}
          <img
            src={image}
            alt=""
            className="w-full h-full object-fit mt-5"
          />

          {/* Dark or Light Gradient Overlay */}
          <div className="absolute inset-0 " />

          {/* Centered Content */}
       {/* <div className="absolute left-1/2 top-[20%] transform -translate-x-1/2 z-30 px-2 sm:px-4 w-full max-w-4xl">
  <div className="flex flex-col items-center justify-center w-full bg-white/20 dark:bg-black/20 backdrop-blur-lg p-4 sm:p-6 rounded-xl border border-orange-400 shadow-md text-center space-y-4">
    
    <h1 className="text-gray-300 dark:text-white text-base sm:text-lg md:text-2xl xl:text-3xl font-news font-bold tracking-normal leading-snug">
      Welcome to <span className="text-[#F97316]">Scopik LMS Platform</span>
    </h1>

    <p className="text-gray-200 dark:text-gray-300 font-manrope text-xs sm:text-sm md:text-base xl:text-lg leading-snug tracking-normal max-w-[95%] sm:max-w-[90%] mx-auto">
      SCOPIK LMS provides businesses with tools to deliver customized,
      continuous learning experiences that support both professional
      development and the wider learning community. It includes a full
      suite of tools for designing, managing, and monitoring engaging
      and adaptive learning environments.
    </p>

    <Link to={"/course"}>
      <button className="bg-[#F97316] font-breul text-white font-semibold text-sm sm:text-base px-4 sm:px-5 py-1.5 sm:py-2 rounded-md hover:bg-orange-600 transition duration-300 tracking-wide">
        Explore Courses
      </button>
    </Link>
    
  </div>
</div> */}


        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-4 h-4 rounded-full border transition-all duration-300 ${index === current
                ? "bg-orange-500 border-orange-500 scale-110 shadow-lg"
                : "bg-gray-300/30 dark:bg-gray-700 border-gray-500 dark:border-gray-400"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider