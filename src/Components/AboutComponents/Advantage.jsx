
import { useEffect, useState } from "react";

const items = [
  "NSQF, NSDC, and MESC-recognized curriculum",
  "AICTE-aligned UG programs",
  "Immersive lab setup in colleges",
  "Focused on AR/VR skill development",
  "Strong placement support",
  "Project-based learning with industry tie-ups",
  "Authorized Unity Education reseller",
  "Guest lectures and academic partnerships",
];

const ScopikAdvantages = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(localStorage.getItem("theme") || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className={`relative w-full min-h-screen flex items-center justify-center py-10 px-4 pt-10 md:pb-20 lg:pb-10 sm:px-6 md:px-10 overflow-hidden ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Orange Gradient Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Horizontal Lines */}
        <div className="absolute top-[33.33%] left-[5%] w-[90%] h-[2px] bg-gradient-to-r from-transparent via-[#FF700A] to-transparent" />
        <div className="absolute top-[66.66%] left-[5%] w-[90%] h-[2px] bg-gradient-to-r from-transparent via-[#FF700A] to-transparent" />
        {/* Vertical Lines */}
        <div className="absolute left-[33.33%] top-[5%] h-[90%] w-[2px] bg-gradient-to-b from-transparent via-[#FF700A] to-transparent" />
        <div className="absolute left-[66.66%] top-[5%] h-[90%] w-[2px] bg-gradient-to-b from-transparent via-[#FF700A] to-transparent" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-3 w-full max-w-7xl z-10 gap-6 sm:gap-8 md:gap-20">
        {/* Top Row */}
        <div className="flex items-center md:pr-5 justify-center">
          <AdvantageBox text={items[0]} isDark={isDark} />
        </div>
        <div className="flex items-center justify-center">
          <AdvantageBox text={items[1]} isDark={isDark} />
        </div>
        <div className="flex items-center md:pl-5 justify-center">
          <AdvantageBox text={items[2]} isDark={isDark} />
        </div>

        {/* Middle Row */}
        <div className="flex items-center md:pr-5 justify-center">
          <AdvantageBox text={items[3]} isDark={isDark} />
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4 py-4">
          <h2 className="text-4xl sm:text-3xl md:text-4xl font-news font-bold">
            SCOPIK
          </h2>
          <h3 className="text-lg sm:text-xl md:text-2xl text-[#F97316] font-semibold">
            Advantages
          </h3>
        </div>
        <div className="flex items-center md:pl-5 justify-center">
          <AdvantageBox text={items[4]} isDark={isDark} />
        </div>

        {/* Bottom Row */}
        <div className="flex items-center md:pr-5 justify-center">
          <AdvantageBox text={items[5]} isDark={isDark} />
        </div>
        <div className="flex items-center justify-center">
          <AdvantageBox text={items[6]} isDark={isDark} />
        </div>
        <div className="flex items-center md:pl-5 justify-center">
          <AdvantageBox text={items[7]} isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

function AdvantageBox({ text, isDark }) {
  return (
    <div
      className={`border rounded-2xl px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12 text-center w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] min-h-[160px] z-10 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:border-orange-400 ${
        isDark
          ? "bg-[#1a1a1a] border-gray-600 text-gray-100 shadow-md"
          : "bg-white border-gray-300 text-gray-900 shadow-sm"
      }`}
    >
      {text}
    </div>
  );
}

export default ScopikAdvantages;
