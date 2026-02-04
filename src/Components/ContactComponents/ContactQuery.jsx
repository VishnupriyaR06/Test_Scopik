import { useState } from "react";
import useTheme from "/src/Hooks/ThemeHook";
import pic from "/src/assets/newImage/contactUs.png";
import axios from "axios";

function AnyQuery() {
  const isDarkMode = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [showModal, setShowModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.includes("@")) newErrors.email = "Email must contain '@'.";
    if (phone.length !== 10) newErrors.phone = "Phone must be 10 digits.";
    if (!message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendMessage = () => {
    if (validateForm()) {
      axios
        .post(import.meta.env.VITE_CONTACT, {
          name: name,
          email: email,
          phone: phone,
          message: message,
        })
        .then(() => {
          setShowModal(true)
        })
        .catch(() => {
          console.error("Error in sending Data");
        });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setErrors({});
    }
  };

  return (
    <section
      className={`py-16 px-6 sm:px-10 transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        <div className="md:w-2/3 space-y-4">
          <h4 className="text-orange-500 text-lg font-semibold uppercase">
            Any Queries?
          </h4>
          <h3 className="text-3xl sm:text-4xl font-bold leading-tight">
            Have any questions? Don't hesitate to contact us
          </h3>
          <p
            className={`text-base sm:text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Whether you're looking for more information, need assistance, or
            just want to connect, our team is ready to support you. Let's start
            the conversation and explore how we can help.
          </p>

          <img
            src={pic}
            alt="question mark"
            className="w-80 sm:w-[22] lg:w-[26rem] xl:w-[28rem] -mt-6 mb-4"
          />
        </div>
        <div
          className={`md:w-1/2 xl:w-1/3 w-full p-6 sm:p-8 rounded-xl shadow-lg border transition-colors duration-300 ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-700"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <h3 className="text-2xl font-bold mb-6 text-orange-400">
            Get in Touch
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-black"
                } ${
                  errors.name ? "border-red-500" : "border-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-black"
                } ${
                  errors.email ? "border-red-500" : "border-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-1">
                Phone No.
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    setPhone(value);
                  }
                }}
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-black"
                } ${
                  errors.phone ? "border-red-500" : "border-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full p-3 rounded-lg border resize-none ${
                  isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-black"
                } ${
                  errors.message ? "border-red-500" : "border-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.message && (
                <p className="text-red-400 text-sm mt-1">{errors.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleSendMessage}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white dark:bg-zinc-900 text-black dark:text-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full text-center`}
          >
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Thank You!
            </h2>
            <p className="text-base sm:text-lg mb-6">
              Thank you for contacting us. Our team will reach out to you
              shortly.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default AnyQuery;
