import certificateImg from "/src/assets/Certificates/certificate.png";
import { FaPlay } from "react-icons/fa";
import useTheme from "/src/Hooks/ThemeHook.js";

export default function Certificates() {
    const isDarkMode = useTheme();
    return (
        <section className={`w-full py-16 px-4 mt-0 sm:px-6 lg:px-12 transition-colors duration-300 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">Let Your{" "}
                <span className="text-orange-500">Certificates</span>{" "}Speak</h2>
            <div className="max-w-6xl mx-auto gap-10 items-center">
                <div className="flex justify-center">
                    <img
                        src={certificateImg}
                        alt="Certificate"
                        className={`max-w-full rounded-lg shadow-xl transition
${isDarkMode ? "shadow-black/60" : "shadow-gray-300"}
`} /></div></div></section>);
}