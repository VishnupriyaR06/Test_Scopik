import { useEffect, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import axios from "axios";
import learnBGDark from "../../assets/newImage/newBg2.png";
import learnBGLight from "../../assets/newImage/newBg.png";
import useTheme from "/src/Hooks/ThemeHook.js";

export default function DarkCourseCard() {
  const isDarkMode = useTheme();
  const [category, setCategory] = useState([]);

  const user=import.meta.env.VITE_USER_NAME;
  const pass=import.meta.env.VITE_USER_PASS

  const token = btoa(`${user}:${pass}`)



  useEffect(() => {
    axios
      .get(import.meta.env.VITE_View_Category,{
        headers:{Authorization:`Basic ${token}`}
      })
      .then((res) => setCategory(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    const tiltElements = document.querySelectorAll(".tilt-card");
    if (tiltElements.length > 0) {
      VanillaTilt.init(tiltElements, {
        max: 15,
        speed: 1000,
        glare: true,
        "max-glare": 0.4,
      });
    }
    return () => {
      tiltElements.forEach((el) => el.vanillaTilt?.destroy());
    };
  }, [category]);

  const cards = category.slice(0, 4);
  const bgImage = isDarkMode ? learnBGDark : learnBGLight;

  return (
    <div
      className="relative flex flex-col items-center justify-center px-4 py-16 transition-colors duration-500"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ? Glassmorphism Container */}
      <div className="absolute inset-0 z-0 flex justify-center px-2 sm:px-4 pointer-events-none">
        <div className={`
          w-full max-w-[1440px] mt-8 sm:mt-10 mb-5 p-5 rounded-3xl min-h-[80%]
          shadow-lg backdrop-blur-md border
          ${isDarkMode ? "bg-white/10 border-white/10" : "bg-white/10 border-white/10"}
        `} />
      </div>

      <h1 className="text-3xl md:text-4xl mt-3 xl:text-5xl z-10 font-news text-black dark:text-white text-center mb-12">
        Choose By <span className="text-[#F97316]">Category</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl z-10">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="tilt-card group relative h-[450px] min-w-[250px]
            bg-white/60 dark:bg-white/10
            backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden flex items-end text-center transition-all duration-500"
          >
            <img
              src={card.image}
              alt={card.name}
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/60 dark:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <div className="relative z-20 w-full px-6 py-8 text-white transform translate-y-32 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
              <h2 className="text-2xl font-bold font-manrope mb-4">
                {card.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
