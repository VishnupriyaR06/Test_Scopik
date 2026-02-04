import useTheme from "/src/Hooks/ThemeHook.js";
import logo1 from "/src/assets/ClientLogo/1.png";
import logo2 from "/src/assets/ClientLogo/2.png";
import logo3 from "/src/assets/ClientLogo/3.png";
import logo4 from "/src/assets/ClientLogo/4.png";
import logo5 from "/src/assets/ClientLogo/5.jpg";
import logo6 from "/src/assets/ClientLogo/6.png";
import logo7 from "/src/assets/ClientLogo/7.png";
import logo8 from "/src/assets/ClientLogo/8.png";
import logo9 from "/src/assets/ClientLogo/9.png";
import logo10 from "/src/assets/ClientLogo/10.png";
import logo11 from "/src/assets/ClientLogo/11.png";
import logo12 from "/src/assets/ClientLogo/12.png";
import logo13 from "/src/assets/ClientLogo/13.png";
import logo15 from "/src/assets/ClientLogo/15.png";
import logo16 from "/src/assets/ClientLogo/16.png";
import logo17 from "/src/assets/ClientLogo/17.png";
import logo18 from "/src/assets/ClientLogo/18.png";
import logo19 from "/src/assets/ClientLogo/19.png";
import logo20 from "/src/assets/ClientLogo/20.png";
import logo21 from "/src/assets/ClientLogo/21.png";
import logo22 from "/src/assets/ClientLogo/22.png";
import logo23 from "/src/assets/ClientLogo/23.png";


const allLogos = [
  logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8,
  logo9, logo10, logo11, logo12, logo13, logo15, logo16, logo17,
  logo18, logo19, logo20, logo21, logo22, logo23,
];

const firstRow = allLogos.slice(0, 8);
const secondRow = allLogos.slice(8, 16);
const thirdRow = allLogos.slice(16, 24);


function ScrollingRow({ logos, reverse }) {
  return (
    <div className="w-full overflow-hidden relative my-10">
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-base-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-base-100 to-transparent z-10 pointer-events-none" />

      <div
        className={`flex items-center gap-8 w-max ${reverse ? "scroll-reverse" : "scroll"}`}
      >
        {[...logos, ...logos].map((logo, idx) => (
          <div key={idx} className="w-[120px] h-[80px] opacity-100 transition-all duration-300">
            <img
              src={logo}
              alt={`Logo-${idx}`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Partners() {
  const isDarkMode = useTheme();

  return (
    <div
      className={`py-14 px-4 transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <h2
          className={`text-4xl md:text-5xl xl:text-5xl font-news text-center ${
            isDarkMode ? "text-[#F97316]" : "text-[#F97316]"
          }`}
        >
       <span className="text-black dark:text-white">Our</span>  Partners
      </h2>

      <ScrollingRow logos={firstRow} reverse={false} />
      <ScrollingRow logos={secondRow} reverse={true} />
      <ScrollingRow logos={thirdRow} reverse={false} />
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .scroll {
          animation: scroll 20s linear infinite; /* Slower speed */
        }
        .scroll-reverse {
          animation: scroll-reverse 20s linear infinite; /* Slower speed */
        }
      `}</style>
    </div>
  );
}