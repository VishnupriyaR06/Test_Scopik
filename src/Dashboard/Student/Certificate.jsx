import axios from "axios";
import { useEffect, useState } from "react";
import { FiDownload, FiImage } from "react-icons/fi";
import { jsPDF } from "jspdf";
import useTheme from "/src/Hooks/ThemeHook";

function Certificate() {
  const [certificates, setCertificates] = useState([]);
  const Uemail = localStorage.getItem("userEmail");
  const isDarkMode = useTheme();

  const CERT_DOMAIN = "https://lms.scopik.in/"

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_CERTIFICATE_USER}${Uemail}`)
      .then((res) => {
        setCertificates(res.data.certificates);
      })
      .catch((err) => console.error("Error fetching certificates:", err));
  }, [Uemail]);

  const handleDownload = (path) => {
    const imageUrl = CERT_DOMAIN + path;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [img.width, img.height],
      });

      pdf.addImage(img, "JPEG", 0, 0, img.width, img.height);
      pdf.save("certificate.pdf");
    };

    img.onerror = () => {
      alert("Failed to load certificate image for download.");
    };
  };

  return (
    <div
      className={`w-full max-w-[1200px] mx-auto p-6 rounded-xl shadow-xl h-[700px] overflow-y-auto transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-800 text-white"
          : "bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">My Certificates</h1>

      {certificates.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No certificates found.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {certificates.map((item, index) => (
            <div
              key={index}
              className={`w-72 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col items-center ${
                isDarkMode ? "bg-slate-700" : "bg-white"
              }`}
            >
              {/* Certificate Image */}
              {item.certificate ? (
                <img
                  src={CERT_DOMAIN + item.certificate}
                  alt={`Certificate ${index + 1}`}
                  className="w-full h-48 object-fill"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-slate-600">
                  <FiImage
                    size={50}
                    className="text-gray-500 dark:text-gray-300"
                  />
                </div>
              )}

              {/* Download Button */}
              <div className="w-full p-4 flex justify-center">
                <button
                  onClick={() => handleDownload(item.certificate)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium hover:opacity-90 transition"
                >
                  <FiDownload /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Certificate;
