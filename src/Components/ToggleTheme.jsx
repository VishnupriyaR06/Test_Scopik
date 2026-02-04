import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = ({ initialWhite = false }) => {
  const [darkmode, setDarkmode] = useState(
    localStorage.getItem("theme") || "light"
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkmode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", darkmode);
  }, [darkmode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let iconColorClass = "text-black";
  if (darkmode === "dark") {
    iconColorClass = "text-white";
  } else if (!scrolled && initialWhite) {
    iconColorClass = "text-white";
  }

  return (
    <button
      onClick={() => setDarkmode(darkmode === "dark" ? "light" : "dark")}
      className={`text-xl md:text-2xl ${iconColorClass} hover:text-[#FF6A00] transition-colors duration-300`}
      title={`Switch to ${darkmode === "light" ? "dark" : "light"} mode`}
    >
      {darkmode === "dark" ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeToggle;
