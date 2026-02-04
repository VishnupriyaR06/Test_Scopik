
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginContext } from "../App";
import log from "../assets/Login/loginBg.jpg";
import { Eye, EyeOff } from "lucide-react";

function SuperLogin() {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setError] = useState("");
  const navigate = useNavigate();

  const { login, setLogin, setUserEmail, setUserName } = useContext(loginContext);
  useEffect(() => {
    if (login) navigate("/superadmin");
  }, [login, navigate]);

  const checkLogin = async () => {
    const login_time = new Date().toLocaleString();
    const emailPattern = /^[\w.-]+@(gmail\.com|ac\.in|yahoo\.com)$/;
    const email = username.toLowerCase();

    if (!emailPattern.test(email)) {
      setError("Only @gmail.com, @ac.in, @yahoo.com emails are allowed.");
      return;
    }

    try {
      const res = await axios.post(import.meta.env.VITE_LOGIN, {
        email,
        password,
        user_type: "Superadmin",
        login_time,
      });

      const data = res.data;
      localStorage.setItem("userRole", "Super_admin");
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("login_time", login_time);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", email.split("@")[0]);

      setLogin(true);
      setUserEmail(email);
      setUserName(email.split("@")[0]);
      navigate("/superadmin");
    } catch (err) {
      setError("Login Failed..Please Check Your Credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100"
      style={{
        backgroundImage: `url(${log})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-2xl p-10 w-[380px] sm:w-[420px] flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-3xl font-news font-bold text-[#004C91] leading-tight">
            Welcome <br /> Scopik Admin
          </h1>
          <p className="text-sm text-red-600 mt-1">{err}</p>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <div
              className="absolute top-9 right-3 text-gray-600 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <button
            className="w-full mt-2 py-3 rounded-md bg-gradient-to-r from-[#23A4DC] to-[#084E90] text-white font-semibold text-sm hover:shadow-lg transition"
            onClick={checkLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuperLogin;
