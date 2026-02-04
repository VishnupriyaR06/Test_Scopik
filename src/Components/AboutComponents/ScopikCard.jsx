import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "/src/assets/AboutPage/AboutBanner.png";

export default function ScopikBanner() {
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
    <div className="relative w-full overflow-hidden">
      {/* Top Curve */}
      <div className="absolute top-0 left-0 w-full z-0">
        <svg
          className="block w-full h-[120px] transition-colors duration-500"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={isDark ? "#000000" : "#ffffff"}
            d="M0,0 C360,100 1080,-100 1440,0 L1440,0 L0,0 Z"
          />
        </svg>
      </div>

      {/* Main Banner */}
      <div className="relative z-10">
        {/* Banner Image */}
        <div className="w-full h-[500px] overflow-hidden">
          <img
            src={heroImage}
            alt="Scopik VR"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* About Section */}
        <div className="w-full bg-white dark:bg-black text-black dark:text-white py-16 px-6 md:px-12 flex items-center justify-center transition-colors duration-500">
          <div className="max-w-5xl mx-auto text-center">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-semibold font-serif drop-shadow-lg ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Learn From{" "}
              <span
                className={`${isDark ? "text-orange-400" : "text-[#FF6A00]"}`}
              >
                Scopik
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 pt-6 leading-relaxed text-center">
              SCOPIK is one of India's leading Customer Focused VR, AR and
              Industry 4.0 solutions companies that helps businesses in their
              Digital-Transformation journeys. We handhold companies deploying
              the Industry 4.0 suite of Virtual Reality (VR), Augmented Reality
              (AR), Mixed Reality (MR) and Digital Twins (DT) technologies.
               <br /> <br />
              SCOPIK provides solutions for multiple verticals to enhance
              production efficiencies, eliminate Safety-Incidents, increase
              profitability and lead on the path to becoming a Smart Factory.
              Our goal as an AR & VR development company is to turn every idea
              into an exciting XR Product. We help in deploying AR and VR
              technology that ultimately delivers great Experiential-Learning
              and outstanding Return-On-Investment (ROI) benefits to our clients.
            </p>

            <div className="pt-8">
              <Link to="/course">
                <button className="bg-[#F97316] hover:bg-orange-600 text-white dark:text-black font-news text-lg px-6 py-3 rounded-lg transition-all duration-300 border-2 border-transparent hover:border-orange-500 dark:hover:border-orange-400">
                  Explore Course
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
