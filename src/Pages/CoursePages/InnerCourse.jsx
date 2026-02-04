import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseContext, loginContext } from "/src/App";
// import WhatWeHave from "/src/Components/CourseComponents/WhatWeHave.jsx";
import Syllabus from "/src/Components/CourseComponents/Syllabus.jsx";
import Learning from "/src/Components/ReusableComponents/Learning.jsx";
import Certificate from "../../Components/CourseComponents/Certificates";
import FAQ from "../../Components/HomeComponents/FAQ";
import axios from "axios";
import { FaRupeeSign } from "react-icons/fa";
import BGOverlay from "/src/assets/newImage/BGOverlay.png";
import useTheme from "/src/Hooks/ThemeHook.js";
import QRCode from "react-qr-code";
import {
  IoBriefcase,
  IoInfinite,
  IoLaptop,
  IoLaptopOutline,
  IoRibbon,
} from "react-icons/io5";

function InnerCourse() {
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [pay, setPay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrResponse, setQrResponse] = useState(null);
  const [timer, setTimer] = useState(300);
  const [loadingTimer, setLoadingTimer] = useState(false);
  const [showModal, setShowModal] = useState({
    visible: false,
    message: "",
    action: null,
  });
  const { id } = useParams();
  const [name, SetName] = useState("");
  const [last_name, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();
  const { Course } = useContext(CourseContext);
  const { login } = useContext(loginContext);
  const sutdent_email = localStorage.getItem("userEmail") || "";
  const user = import.meta.env.VITE_USER_NAME;
  const pass = import.meta.env.VITE_USER_PASS;
  const token = btoa(`${user}:${pass}`);
  const isDarkMode = useTheme();
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const [hideSidebar, setHideSidebar] = useState(false);

  const individual = Course?.find((c) => c.id === Number(id)) || null;
  const chapters = individual?.chapters || [];
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState("whatwehave");

  useEffect(() => {
    const sections = [
      "whatwehave",
      "syllabus",
      "learning",
      "certificate",
      "faq",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            if (entry.target.id === "faq") {
              setHideSidebar(true);
            } else {
              setHideSidebar(false);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleValidateAndPay = () => {
    if (!name || !last_name || !email || !number) {
      setError("All fields are required.");
      return;
    }
    if (last_name.length < 4) {
      setError("Enter Last Name atleast 3");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(number)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    handlePayment();
  };

  //  // ✅ DERIVED DATA
  // const individual =
  //   Course?.find((cor) => cor.id === Number(id)) || null;

  // const chapters = individual?.chapters || [];

  useEffect(() => {
    if (!qrResponse?.payload?.order_id) return;

    let isActive = true;
    let attempts = 0;
    const maxAttempts = 40;

    const interval = setInterval(async () => {
      if (!isActive) return;
      try {
        attempts++;

        const res = await axios.post(
          "https://lms.scopik.in/api/payment_callback/",
          {
            order_id: qrResponse.payload.order_id,
            email: qrResponse.payload.customer_details.email,
            course: qrResponse.payload.product_name,
          },
          { headers: { Authorization: `Basic ${token}` } },
        );

        const subStatus = res.data?.gateway_response?.data?.subStatus;

        if (subStatus === "101") {
          setEnrolled(true);
          setPay(false);
          setQrResponse(null);
          clearInterval(interval);
          setShowModal({
            visible: true,
            message: "Payment Successfull",
            action: () => navigate(`/individual/${individual.id}`),
          });
          isActive = false;
        } else if (subStatus === "100" || subStatus === "105") {
          clearInterval(interval);
          setShowModal({
            visible: true,
            message: "Payment Failed or Rejected. Please try again.",
          });
          setPay(false);
          setQrResponse(null);
          isActive = false;
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setShowModal({
            visible: true,
            message: "Payment not confirmed. Please try again.",
          });
          setPay(false);
          setQrResponse(null);
          isActive = false;
        }
      } catch (err) {
        console.error("Polling error:", err.message);
      }
    }, 3000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [qrResponse, token, individual, navigate]);

  function handleEnroll() {
    setPay(true);
    setTimer(300);
    setLoadingTimer(false);
  }

  async function handlePayment() {
    if (!name || !email || !number) {
      setShowModal({
        visible: true,
        message: "Please fill in all the details.",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        email: email,
        first_name: name,
        last_name: last_name,
        number: number,
        amount: Number(individual?.price || 0),
        id: id,
      };

      const response = await axios.post(
        "https://lms.scopik.in/api/courseenrollment/",
        payload,
        { headers: { Authorization: `Basic ${token}` } },
      );

      if (response.data.upi_string) {
        setQrResponse(response.data);
        setTimer(300);
      } else {
        setShowModal({
          visible: true,
          message: "Payment initiation failed. Try again.",
        });
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      setShowModal({
        visible: true,
        message: "Something went wrong during payment initiation.",
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!qrResponse) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setLoadingTimer(true);
          setTimeout(async () => {
            try {
              if (qrResponse?.payload?.order_id) {
                await axios.post(
                  "https://lms.scopik.in/api/payment_callback/",
                  { order_id: qrResponse.payload.order_id, cancel: true },
                  { headers: { Authorization: `Basic ${token}` } },
                );
              }
            } catch (err) {
              console.error("QR cancel error:", err.message);
            }
            setPay(false);
            setQrResponse(null);
            setLoadingTimer(false);
          }, 60000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [qrResponse, token]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!Course || !individual) {
    return <div className="text-center mt-10">Loading Course Details…</div>;
  }

  return (
    <div className={isDarkMode ? "bg-black text-white" : "bg-white text-black"}>
      {/* Modal */}
      {showModal.visible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div
            className={`p-6 rounded shadow-md max-w-md w-full text-center ${
              isDarkMode ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-900"
            }`}
          >
            <p className="text-lg mb-4">{showModal.message}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setShowModal({ visible: false, message: "", action: null });
                if (showModal.action) showModal.action();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="relative w-full min-h-screen overflow-hidden">
        <img
          src={individual.background_image}
          alt="Course"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          src={BGOverlay}
          alt="Overlay"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        <div className="relative z-10 pt-24 sm:pt-28 px-4 sm:ml-12 max-w-xl space-y-6">
          <div
            className={`p-6 rounded-2xl backdrop-blur shadow-lg ${
              isDarkMode ? "bg-black/50 text-white" : "bg-white/50 text-black"
            }`}
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              {individual.name}
            </h1>

            <p
              className={`text-sm sm:text-base lg:text-lg leading-relaxed
    overflow-hidden text-ellipsis
    [display:-webkit-box]
    [-webkit-line-clamp:2]
    [-webkit-box-orient:vertical]
    ${isDarkMode ? "text-gray-300" : "text-black"}`}
            >
              {individual.description}
            </p>

            {/* Course Price */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm sm:text-base font-medium text-orange-500">
                Course Fee:
              </span>
              <span className="text-lg sm:text-xl font-bold text-orange-500">
                ₹{individual.price}
              </span>
            </div>
          </div>
          <div
            className={`flex flex-wrap sm:flex-nowrap rounded-lg shadow px-4 py-3 justify-between gap-4 sm:gap-0 ${
              isDarkMode ? "bg-black/50 text-white" : "bg-white/70 text-black"
            }`}
          >
            <div className="text-center flex-1">
              <p className="font-semibold">{chapters.length}</p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Modules
              </p>
            </div>

            <div
              className={`w-px ${isDarkMode ? "bg-gray-600" : "bg-gray-400"}`}
            />

            <div className="text-center flex-1">
              <p className="font-semibold">06</p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Duration
              </p>
            </div>

            <div
              className={`w-px ${isDarkMode ? "bg-gray-600" : "bg-gray-400"}`}
            />

            <div className="text-center flex-1">
              <p className="font-semibold">English</p>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Language
              </p>
            </div>
          </div>
        </div>
      </div>
      <nav
        className={`sticky top-0 z-20 w-full pt-0 ${
          isDarkMode ? "bg-black/80" : "bg-white/95"
        }`}
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex gap-6 sm:gap-10 text-sm sm:text-lg font-medium overflow-x-auto whitespace-nowrap">
          {[
            { id: "whatwehave", label: "About" },
            { id: "syllabus", label: "Course" },
            { id: "learning", label: "Related" },
            { id: "certificate", label: "Certificate" },
            { id: "faq", label: "FAQ" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const el = document.getElementById(item.id);
                if (!el) return;
                const y =
                  el.getBoundingClientRect().top + window.pageYOffset - 140;
                window.scrollTo({ top: y, behavior: "smooth" });
              }}
              className={`relative px-2 transition ${
                activeSection === item.id
                  ? "text-orange-500"
                  : "hover:text-orange-500"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-orange-500" />
              )}
            </button>
          ))}
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-10 z-10 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 space-y-10">
          <section id="whatwehave">
            <div className="my-10 text-center px-4">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-400 mb-4">
                Course Overview
              </h3>
              <p
                className={`text-base sm:text-lg lg:text-xl max-w-4xl mx-auto ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {individual.description}
              </p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-400 mb-10 text-center">
                Key Features
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                  <IoRibbon size={24} color="#f97316" />
                  <p className="text-base sm:text-lg">
                    Globally recognised certification
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <IoLaptopOutline size={24} color="#f97316" />
                  <p className="text-base sm:text-lg">
                    100% online and self-paced learning
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <IoInfinite size={24} color="#f97316" />
                  <p className="text-base sm:text-lg">
                    Full lifetime access to all content
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <IoBriefcase size={24} color="#f97316" />
                  <p className="text-base sm:text-lg">
                    Real-world projects for hands-on experience
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="syllabus">
            <Syllabus />
          </section>

          <section id="learning" className="w-full lg:w-[115%]">
            <Learning />
          </section>

          <section id="certificate">
            <Certificate />
          </section>
        </div>

        <aside
          className={`block lg:fixed w-full lg:w-1/4 z-20 lg:mt-40 lg:right-10 lg:top-28 mt-10 lg:mt-0`}
        >
          <div
            className={`relative rounded-2xl p-6 shadow-xl border ${isDarkMode ? "bg-[#111] text-white border-gray-700" : "bg-white text-black border-gray-200"}`}
          >
            <div
              className={`absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-semibold px-4 py-1 rounded-full ${individual.price > 0 ? "bg-orange-500" : "bg-orange-500"}`}
            >
              {individual.price > 0 ? "Paid Course" : "Free Course"}
            </div>
            <h2 className="text-2xl font-bold text-center mt-4 mb-6">
              Learn this course for{" "}
              {individual.price > 0 ? (
                <span className="text-orange-500 font-extrabold">
                  ₹{individual.price}
                </span>
              ) : (
                <span className="text-orange-500 font-extrabold">FREE!</span>
              )}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2
${
  isDarkMode
    ? "bg-[#1a1a1a] text-white border-gray-600 focus:ring-green-500"
    : "bg-white text-black border-gray-300 focus:ring-green-500"
}`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <div className="flex">
                <span
                  className={`px-3 flex items-center rounded-l-md border${
                    isDarkMode
                      ? "bg-[#1a1a1a] border-gray-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  placeholder="Enter your Mobile No"
                  className={`w-full px-4 py-2 rounded-r-md border focus:outline-none focus:ring-2${
                    isDarkMode
                      ? "bg-[#1a1a1a] text-white border-gray-600 focus:ring-green-500"
                      : "bg-white text-black border-gray-300 focus:ring-green-500"
                  }`}
                />
              </div>
            </div>
            <button
              onClick={() =>
                individual.price > 0
                  ? handleEnroll()
                  : navigate(`/individual/${individual.id}`)
              }
              className={`w-full py-3 font-bold rounded-md transition
  ${
                individual.price > 0
                  ? "bg-[#FF700A] hover:bg-orange-600 text-white"
                  : "bg-[#FF700A] hover:bg-orange-600 text-white"
              }`}
            >
              {individual.price > 0 ? "Enroll Now" : "Start Learning"}
            </button>
          </div>
        </aside>
      </div>
      <section
        id="faq"
        className={`relative z-50 w-full py-20 lg:mb-0 md:mb-20 sm:mb-20 px-6 ${
          isDarkMode ? "bg-black" : "bg-white"
        }`}
      >
        <FAQ />
      </section>
      {pay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center px-4">
          <div
            className={`rounded-xl shadow-lg w-full max-w-lg px-6 sm:px-10 py-6 relative transition-all duration-300 ${
              isDarkMode
                ? "bg-[#0c0c0c] text-white border border-gray-800"
                : "bg-white text-gray-900 border border-gray-300"
            }`}
          >
            <button
              onClick={() => {
                setPay(false);
                setQrResponse(null);
                setTimer(300);
                setLoadingTimer(false);
              }}
              className="absolute top-3 right-4 text-2xl font-bold hover:text-orange-600 transition"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-center mb-2">Payment</h2>
            <p
              className={`text-sm text-center mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Enter correct details for your course completion certificate.
            </p>

            {loadingTimer ? (
              <div className="flex flex-col items-center justify-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                <p className="text-center text-sm mt-2">
                  Processing payment...
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <p className="text-red-500 text-center text-sm mb-4 z-80">
                    {error}
                  </p>
                )}

                {!qrResponse ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => SetName(e.target.value)}
                        className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
                          isDarkMode
                            ? "bg-[#1a1a1a] text-white border-gray-700 focus:ring-orange-400"
                            : "bg-white text-black border-gray-300 focus:ring-blue-400"
                        }`}
                      />
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={last_name}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
                          isDarkMode
                            ? "bg-[#1a1a1a] text-white border-gray-700 focus:ring-orange-400"
                            : "bg-white text-black border-gray-300 focus:ring-blue-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
                          isDarkMode
                            ? "bg-[#1a1a1a] text-white border-gray-700 focus:ring-orange-400"
                            : "bg-white text-black border-gray-300 focus:ring-blue-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={number}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 10) setNumber(value);
                        }}
                        className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 ${
                          isDarkMode
                            ? "bg-[#1a1a1a] text-white border-gray-700 focus:ring-orange-400"
                            : "bg-white text-black border-gray-300 focus:ring-blue-400"
                        }`}
                      />
                    </div>

                    <div className="mt-4">
                      <h3 className="font-semibold">{individual.name}</h3>
                      <div className="flex justify-between text-lg mt-1">
                        <span>Cost</span>
                        <span>-</span>
                        <span className="text-orange-500">
                          &#8377;{individual.price}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleValidateAndPay}
                      disabled={loading}
                      className="w-full py-2 mt-4 rounded-md transition font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {loading ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <h3 className="text-lg font-semibold">Scan & Pay</h3>
                    <p className="text-center mb-2">
                      Time left:{" "}
                      <span className="font-bold">{formatTime(timer)}</span>
                    </p>
                    <div className="bg-white p-2 rounded-md">
                      <QRCode value={qrResponse.upi_string} size={208} />
                    </div>
                    <p className="text-sm text-gray-500 break-all text-center mt-2">
                      Transaction ID: {qrResponse.transaction_id}
                    </p>
                    {isMobile && (
                      <a
                        href={qrResponse.upi_string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-600"
                      >
                        Pay via UPI App
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InnerCourse;
