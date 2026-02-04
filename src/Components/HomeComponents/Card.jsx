import { useRef, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  EffectCoverflow,
  Keyboard,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

import { CourseContext } from "/src/App";
import useTheme from "/src/Hooks/ThemeHook.js";

// Background images
import bgDark from "../../assets/newImage/new_bg2.png";
import bgLight from "../../assets/newImage/new_bg.png";

export default function NewsSlider() {
  const bgRef = useRef(null);
  const { Course } = useContext(CourseContext);
  const isDarkMode = useTheme();

  const updateBackground = (el) => {
    if (!bgRef.current || !el) return;
    const parentRect = bgRef.current.parentElement.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const left = elRect.left - parentRect.left;
    const top = elRect.top - parentRect.top;

    bgRef.current.style.width = `${elRect.width}px`;
    bgRef.current.style.height = `${elRect.height}px`;
    bgRef.current.style.transform = `translate(${left}px, ${top}px)`;
  };

  const backgroundImage = isDarkMode ? bgLight : bgDark;

  return (
    <div className="relative w-full pb-20 overflow-hidden transition-colors duration-500">
      {/* Background */}
      <div className="absolute w-full h-full z-0">
        <img
          src={backgroundImage}
          className="w-full h-full object-fit select-none pointer-events-none opacity-100"
          alt="background"
        />
      </div>

      {/* Highlight background */}
      <div
        ref={bgRef}
        className="item-bg absolute bg-white rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.4)] z-0 transition-all duration-500 opacity-90"
      ></div>

      <div className="relative z-10 max-w-[1300px] mx-auto mt-4">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl xl:text-5xl mb-6 text-center text-[#F97316] font-news">
          <span className="text-black dark:text-white">Our</span> Courses
        </h1>

        <div className="relative flex items-center justify-between gap-10">
          {/* Left Arrow */}
          <button className="news-slider__arrow news-slider-prev left-8 bg-white hover:bg-orange-500 transition-all w-12 h-12 md:w-[50px] md:h-[50px] rounded-full shadow-xl flex justify-center items-center z-20">
            <svg className="w-4 h-4 text-black group-hover:text-white transition-colors duration-300" viewBox="0 0 32 32">
              <path d="M0.704 17.696l9.856 9.856c0.896 0.896 2.432 0.896 3.328 0s0.896-2.432 0-3.328l-5.792-5.856h21.568c1.312 0 2.368-1.056 2.368-2.368s-1.056-2.368-2.368-2.368h-21.568l5.824-5.824c0.896-0.896 0.896-2.432 0-3.328-0.48-0.48-1.088-0.704-1.696-0.704s-1.216 0.224-1.696 0.704l-9.824 9.824c-0.448 0.448-0.704 1.056-0.704 1.696s0.224 1.248 0.704 1.696z" />
            </svg>
          </button>

          {/* Swiper */}
          <Swiper
            className="w-full px-4"
            modules={[Navigation, Pagination, EffectCoverflow, Keyboard]}
            effect="coverflow"
            grabCursor
            loop={Course.length >= 4}
            centeredSlides
            keyboard
            slidesPerView={3}
            spaceBetween={30}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 0,
              modifier: 1,
              slideShadows: false,
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{
              nextEl: ".news-slider-next",
              prevEl: ".news-slider-prev",
            }}
            pagination={{
              el: ".news-slider__pagination",
              clickable: true,
            }}
            onInit={(swiper) => {
              const slide = swiper.slides?.[swiper.activeIndex];
              if (slide) {
                const el = slide.querySelector(".news__item");
                if (el) {
                  updateBackground(el);
                  bgRef.current?.classList.add("opacity-100");
                }
              }
            }}
            onSlideChangeTransitionEnd={(swiper) => {
              const slide = swiper.slides?.[swiper.activeIndex];
              if (slide) {
                const el = slide.querySelector(".news__item");
                if (el) updateBackground(el);
              }
            }}
          >
            {Course.map((item, idx) => (
              <SwiperSlide key={idx}>
                {({ isActive, isNext, isPrev }) => (
                  <div
                    className={`news__item p-8 z-20 rounded-xl transition-all duration-500 h-[600px] flex flex-col justify-between border group ${
                      isActive
                        ? "bg-black/50 backdrop-blur-xl text-white border border-white/20 shadow-2xl"
                        : `${
                            isDarkMode ? "text-white" : "text-black"
                          } bg-white/10 border-white/30 backdrop-blur-md hover:bg-white/20 hover:backdrop-blur-lg`
                    } ${
                      isActive || isNext || isPrev
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {/* Title & Description */}
                    <div>
                      <h2 className="text-2xl md:text-3xl font-semibold mb-4 font-bruel transition-colors">
                        {item.name}
                      </h2>
                      <p className="text-base md:text-lg opacity-70 leading-relaxed font-news transition-colors line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Image */}
                    <div
                      className={`news__img h-[200px] mt-8 rounded-xl overflow-hidden shadow-xl transform transition-transform duration-500 ${
                        isActive ? "scale-110 -translate-y-12" : "scale-100"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt="news"
                        className="w-full h-full object-fit rounded-xl"
                      />
                    </div>

                    {/* View Course Button */}
                    <Link to={`/course/${item.id}`}>
                      <button
                        className={`w-full mt-6 py-3 px-6 border font-semibold text-lg rounded-xl shadow-md transition duration-300 ease-in-out ${
                          isActive
                            ? "bg-[#F97316] text-black shadow-xl scale-105 border-transparent"
                            : "bg-black/30 text-white border-white/30 hover:bg-[#FF8011] hover:text-black"
                        }`}
                      >
                        View Course
                      </button>
                    </Link>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right Arrow */}
          <button className="news-slider__arrow news-slider-next bg-white hover:bg-orange-500 transition-all w-12 h-12 md:w-[50px] md:h-[50px] rounded-full shadow-xl flex justify-center items-center z-20">
            <svg className="w-4 h-4 text-black group-hover:text-white transition-colors duration-300" viewBox="0 0 32 32">
              <path d="M31.296 14.336l-9.888-9.888c-0.896-0.896-2.432-0.896-3.328 0s-0.896 2.432 0 3.328l5.824 5.856h-21.536c-1.312 0-2.368 1.056-2.368 2.368s1.056 2.368 2.368 2.368h21.568l-5.856 5.824c-0.896 0.896-0.896 2.432 0 3.328 0.48 0.48 1.088 0.704 1.696 0.704s1.216-0.224 1.696-0.704l9.824-9.824c0.448-0.448 0.704-1.056 0.704-1.696s-0.224-1.248-0.704-1.664z" />
            </svg>
          </button>
        </div>

        {/* Pagination */}
        <div className="news-slider__pagination mt-12 text-center"></div>
      </div>
    </div>
  );
}
