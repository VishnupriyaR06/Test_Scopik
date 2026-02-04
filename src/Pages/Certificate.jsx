import { useEffect, useState } from "react";
import Bg from "/src/assets/Certificates/certificate.png";
import Bg1 from "../assets/Certificates/certificate1.png";
import useTheme from "/src/Hooks/ThemeHook.js";
import axios from "axios";
import Header from "/src/Components/ReusableComponents/Header.jsx";
import { jsPDF } from "jspdf";

export default function Certificate() {
  const [certificateUrl, setCertificateUrl] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userEmail = localStorage.getItem("userEmail");
  const courseName = localStorage.getItem("completedCourseName")

  const isDark = useTheme();

  useEffect(() => {
    if (!userEmail || !courseName) {
      setError("User email or course name not found.");
      setLoading(false);
      return;
    }
    const directUrl = `${import.meta.env.VITE_CERTIFICATE_VIEW}?email=${userEmail}&course=${courseName}`;
    setShareLink(directUrl);
    axios
      .get(directUrl, { responseType: "blob" })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setCertificateUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch certificate.");
        setLoading(false);
      });
  }, []);

  const handleDownload = async () => {
    if (!certificateUrl) return;
    const img = new Image();
    img.src = certificateUrl;
    img.onload = () => {
      const pdf = new jsPDF("landscape", "pt", [img.width, img.height]);
      pdf.addImage(img, "JPEG", 0, 0, img.width, img.height);
      pdf.save("certificate.pdf");
    };
  };

  return (
    <>
      <Header />
      <div
        className={`min-h-screen bg-cover bg-center p-6 ${
          isDark ? "bg-black" : "bg-white"
        }`}
        style={{ backgroundImage: `url(${isDark ? Bg : Bg1})` }}
      >
        <div
          className={`max-w-5xl mx-auto mt-16 text-center py-12 ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? "text-orange-500" : "text-orange-600"
            }`}
          >
            Certificate of Completion
          </h1>
          <p
            className={`text-sm md:text-lg mb-6 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Congratulations on successfully completing your course! Below is
            your personalized certificate.
          </p>

          {loading && (
            <p className={`${isDark ? "text-orange-200" : "text-orange-600"}`}>
              Loading certificate...
            </p>
          )}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && certificateUrl && (
            <>
              <img
                src={certificateUrl}
                alt="Certificate"
                className="w-full max-w-2xl mx-auto border-4 border-orange-400 rounded-xl shadow-xl mb-6"
              />

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-orange-500 text-black font-semibold rounded-lg shadow hover:bg-orange-600 transition"
                >
                  Download Certificate
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className={`px-6 py-3 font-semibold rounded-lg shadow transition border ${
                    isDark
                      ? "bg-black text-orange-400 border-orange-400 hover:bg-orange-800 hover:text-white"
                      : "bg-white text-orange-600 border-orange-600 hover:bg-orange-100"
                  }`}
                >
                  Share on Social Media
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && certificateUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-zinc-900 text-white rounded-lg p-6 max-w-lg w-full relative border border-orange-500">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-orange-400 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold text-orange-400 text-center mb-4">
                Share Your Certificate
              </h2>
              <img
                src={certificateUrl}
                alt="Preview"
                className="w-full h-auto rounded mb-4 border border-orange-400"
              />
              <div className="space-y-2 text-center">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-2 bg-orange-500 text-black font-semibold rounded hover:bg-orange-600"
                >
                  Share on LinkedIn
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    alert("Certificate URL copied to clipboard");
                  }}
                  className="inline-block w-full py-2 bg-zinc-700 text-white font-semibold rounded hover:bg-zinc-800"
                >
                  Copy Certificate URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
