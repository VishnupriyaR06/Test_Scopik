import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from "../assets/Logo.png";
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const SetPassword = () => {
  const { token, email } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isValidPassword = (pwd) => {
    const length = pwd.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@#$%^&*!_]/.test(pwd);
    return length && hasLetter && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters and contain letters, numbers, and special characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(import.meta.env.VITE_USER_PASSWORD, {
        email,
        token,
        password,
      })
      console.log(response.data)

      setMessage(response.data.message || 'Password set successfully');
      setError('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/30 backdrop-blur-md shadow-lg border border-white/40">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Set Your Password</h2>
        {message && <p className="text-green-600 text-center mb-2">{message}</p>}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-4 w-full flex flex-col items-center relative">
            <label className="self-start ml-2 mb-1 font-medium">New Password</label>
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md w-[80%] p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div
              className="absolute right-10 top-[38px] cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          <div className="mb-4 w-full flex flex-col items-center relative">
            <label className="self-start ml-2 mb-1 font-medium">Confirm Password</label>
            <input
              type={showConfirmPass ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-md w-[80%] p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div
              className="absolute right-10 top-[38px] cursor-pointer"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
