import { useState } from "react";
import { Link } from "react-router-dom";
import loginBg from "/src/assets/Login/loginBg.jpg";
import Logo from "/src/assets/logo/NewLogo.png";
import Lottie from "lottie-react";
import loginAnimation from "/src/assets/Login/login.json";

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [user_type, SetUser_type] = useState("student")

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,user_type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error || "Something went wrong.");
        return;
      }

      setMessage("Password reset link has been sent to your email.");
    } catch (err) {
      console.error(err);
      setMessage("Error sending reset link.");
    }
  };

  return (
   <div
      className="w-full px-4 sm:px-6 md:px-10 flex flex-col md:flex-row items-center justify-center xl:bg-cover bg-cover xl:bg-center min-h-screen"
      style={{ backgroundImage: `url(${loginBg})` }}
    >

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:left-4 sm:transform-none sm:top-10 flex items-center justify-center">
        <Link to="/"><img src={Logo} alt="Logo" className="w-12 h-12 md:size-16" />
        </Link>  </div>


      <div className="hidden md:block md:w-1/2">
        <Lottie animationData={loginAnimation} loop={true} className="w-full h-full" />
      </div>

      <div className="w-full sm:w-[90%] md:w-[50%] lg:w-[40%] bg-white/30 backdrop-blur-md border border-white/30 rounded-xl p-5 sm:p-6 md:p-10 shadow-lg mt-6 md:mt-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
          Forgot Password
        </h2>

        {message && (
          <p className="text-center text-sm mb-4 text-red-700">{message}</p>
        )}

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-blue-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleForgotPassword}
          className="w-full bg-gradient-to-r from-[#23A4DC] to-[#084E90] text-white font-medium py-2 rounded-md shadow-md hover:opacity-90 transition"
        >
          Send Reset Link
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Back to{" "}
          <Link to="/login" className="text-[#084E90] font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default ForgotPassword;