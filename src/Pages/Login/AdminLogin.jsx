import { useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/Login/login.json"
import loginBg from "/src/assets/Login/loginBg.jpg";
import { loginContext } from "/src/App";
import Logo from "/src/assets/logo/NewLogo.png";
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("Superadmin")
  const [activeTab, setActiveTab] = useState("Superadmin")
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState("")

  const navigate = useNavigate();
  const { setLogin, setUserName, setUserEmail } = useContext(loginContext)

  const validateInputs = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const login_time = new Date().toLocaleString();
      const response = await fetch(import.meta.env.VITE_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          user_type: role,
          login_time,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({
          api: errorData.error || "Login failed. Please try again.",
        });
        return;
      }

      const data = await response.json();
      setSuccessMsg("Login Successful");

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("userRole", role);
      localStorage.setItem("login_time", login_time);

      if (data.user) {
        if (data.user.name) {
          setUserName(data.user.name);
          localStorage.setItem("userName", data.user.name);
        }
        if (data.user.email) {
          setUserEmail(data.user.email);
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userId", data.user.id);
        }
      }

      setLogin(true);
      setTimeout(() => {
        if (role === "University_admin") {
          navigate("/univAdmin");
        } else if (role === "Superadmin") {
          navigate("/Superadmin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      console.error("Login Failed", err);
      setErrors({ api: "An error occurred during login. Please try again." });
    }
  };

  return (
    <div
      className="w-full px-4 sm:px-6 md:px-10 flex flex-col md:flex-row items-center justify-center xl:bg-cover bg-cover xl:bg-center min-h-screen"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 sm:left-4 sm:transform-none sm:top-10 flex items-center justify-center">
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-12 h-12 md:size-16" />
        </Link>
      </div>
      <div className="hidden md:block md:w-1/2">
        <Lottie animationData={loginAnimation} loop={true} className="w-full h-full" />
      </div>
      <div className="w-full sm:w-[90%] md:w-[50%] lg:w-[40%] bg-white/30 backdrop-blur-md border border-white/30 rounded-xl p-5 sm:p-6 md:p-10 shadow-lg mt-6 md:mt-0">
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6 font-news">
            Login
          </h2>
          <div className="md:flex border p-1 border-black rounded-full overflow-hidden mb-8 w-fit mx-auto">
            <button
              className={`px-4 py-2 font-medium transition-all rounded-3xl ${
                activeTab === "University_admin"
                  ? "bg-gradient-to-r from-[#23A4DC] to-[#084E90] text-white"
                  : "text-black"
              }`}
              onClick={() => {
                setActiveTab("University_admin");
                setRole("University_admin");
              }}
            >
              University
            </button>
            <button
              className={`px-4 py-2 font-medium transition-all rounded-3xl ${
                activeTab === "Superadmin"
                  ? "bg-gradient-to-r from-[#23A4DC] to-[#084E90] text-white"
                  : "text-black"
              }`}
              onClick={() => {
                setActiveTab("Superadmin");
                setRole("Superadmin");
              }}
            >
              Admin
            </button>
          </div>

          {errors.api && (
            <p className="text-center text-red-600 text-sm">{errors.api}</p>
          )}
          {successMsg && (
            <p className="text-center text-green-600 text-sm">{successMsg}</p>
          )}

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="Enter your email"
                className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-blue-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span
                  className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            className="w-full mt-6 bg-gradient-to-r from-[#23A4DC] to-[#084E90] text-white font-medium py-2 rounded-md shadow-md hover:opacity-90 transition"
            onClick={handleLogin}
          >
            Sign in as {role === "University_admin" ? "University" : "Scopik"}
          </button>
        </div>
        <p className="text-center mt-2"> Back to
          <Link to="/login" className="text-blue-800"> Login</Link>  </p>
      </div>
    </div>
  );
};

export default AdminLogin;