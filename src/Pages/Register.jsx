import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "/src/assets/Login/loginBg.jpg";
import Logo from "/src/assets/logo/NewLogo.png";
import Lottie from "lottie-react";
import registerAnimation from "../assets/Login/login.json"

function Register() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [log, setLog] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showProceedModal, setShowProceedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  const navigate = useNavigate();
  const password = "Scopik@admin126!";
  const role = "student";

  useEffect(() => {
    let countdown;
    if (step === "otp" && timer > 0 && !resendEnabled) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendEnabled(true);
    }
    return () => clearInterval(countdown);
  }, [step, timer, resendEnabled]);

  const handleSendOtp = async () => {
    setEmailError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowOtpModal(true);
        setStep("otp");
        setTimer(60);
        setResendEnabled(false);
      } else {
        setEmailError(data.error || "Failed to send OTP. Try again.");
      }
    } catch (error) {
      setEmailError("Network error. Try again.");
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");

    try {
      const res = await fetch(import.meta.env.VITE_VERIFY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowProceedModal(true);
        setStep("form");
      } else {
        setOtpError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Error verifying OTP. Try again.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) newErrors.phone = "Enter a valid 10-digit phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(import.meta.env.VITE_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, password, user_type: role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ api: errorData.error || "Registration failed. Please try again." });
        return;
      }

      setLog("Registration Successful");
      setShowSuccessModal(true);
    } catch (error) {
      setErrors({ api: "An error occurred during registration. Please try again." });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 flex flex-col md:flex-row items-center justify-center xl:bg-cover bg-cover xl:bg-center min-h-screen" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:left-4 sm:transform-none sm:top-10 flex items-center justify-center">
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-12 h-12 md:size-20 cursor-pointer" />
        </Link>
      </div>

      {/* Lottie Illustration */}
      <div className="hidden md:block md:w-1/2">
        <Lottie animationData={registerAnimation} loop className="w-full h-full" />
      </div>

      <div className="w-full sm:w-[90%] md:w-[50%] lg:w-[40%] bg-white/30 backdrop-blur-md border border-white/30 rounded-xl p-5 sm:p-6 md:p-10 shadow-lg mt-6 md:mt-0">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#23A4DC] to-[#084E90] text-transparent bg-clip-text mb-6">Register</h2>

        {log && <p className="text-green-600 text-center text-sm">{log}</p>}
        {errors.api && <p className="text-red-500 text-center mt-2 text-sm">{errors.api}</p>}

        <div className="flex flex-col text-sm">
          <div className="text-center mb-4 text-blue-900 font-semibold">
            {step === "email" && " Verify Email"}
            {step === "otp" && " Enter OTP"}
            {step === "form" && " Complete Registration"}
          </div>

          {step === "email" && (
            <>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" className="p-2 mt-1 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              <button className="mt-4 bg-gradient-to-r from-blue-400 to-blue-700 text-white py-2 rounded-md" onClick={handleSendOtp}>Send OTP</button>
            </>
          )}

          {step === "otp" && (
            <>
              <label>Enter OTP sent to {email}</label>
              <input type="text" className="p-2 mt-1 border rounded-md" value={otp} onChange={(e) => setOtp(e.target.value)} />
              {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
              <button className="mt-4 bg-green-600 text-white py-2 rounded-md" onClick={handleVerifyOtp}>Verify OTP</button>
              {resendEnabled ? (
                <p className="mt-2 text-sm text-blue-700 underline cursor-pointer" onClick={handleSendOtp}>Resend OTP</p>
              ) : (
                <p className="mt-2 text-sm text-gray-600">Resend OTP in <span className="font-semibold">{timer}s</span></p>
              )}
            </>
          )}

          {step === "form" && (
            <>
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" className="p-2 mt-1 border rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              <label className="mt-3">Phone Number</label>
              <input type="tel" placeholder="Enter your phone number" maxLength={10} className="p-2 mt-1 border rounded-md" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              <button className="mt-5 bg-gradient-to-r from-blue-400 to-blue-700 text-white py-2 rounded-md" onClick={handleRegister}>Register as Student</button>
            </>
          )}

          <p className="text-center mt-4 text-sm">Already have an account? <Link to="/login" className="text-[#084E90] font-semibold">Login</Link></p>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-[#084E90] mb-4">OTP Sent</h3>
            <p className="text-gray-700 mb-6">OTP has been sent to <strong>{email}</strong>. Please check your inbox.</p>
            <button className="bg-[#084E90] hover:bg-[#0a3b6d] text-white px-4 py-2 rounded-md" onClick={() => setShowOtpModal(false)}>OK</button>
          </div>
        </div>
      )}

      {showProceedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-[#084E90] mb-4">OTP Verified</h3>
            <p className="text-gray-700 mb-6">Fill further details to complete registration.</p>
            <button className="bg-[#084E90] hover:bg-[#0a3b6d] text-white px-4 py-2 rounded-md" onClick={() => setShowProceedModal(false)}>OK</button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-[#084E90] mb-4">Check Your Email</h3>
            <p className="text-gray-700 mb-6">Further instructions have been sent to your email. Please check your inbox.</p>
            <button className="bg-[#084E90] hover:bg-[#0a3b6d] text-white px-4 py-2 rounded-md" onClick={() => { setShowSuccessModal(false); navigate("/login"); }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;