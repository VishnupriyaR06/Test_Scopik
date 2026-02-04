import { useEffect, useState } from "react";
import contactHeroImage from "/src/assets/newImage/ContactHeroimg.png";
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


  return (
    <div className="relative w-full">
      <div className="relative w-full h-[500px] overflow-hidden">
        <img
          src={contactHeroImage}
          alt="Scopik VR"
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  );
}
