import { useEffect, useState } from "react";

export default function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(null); 

  useEffect(() => {
 
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme(); 

  
    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}
