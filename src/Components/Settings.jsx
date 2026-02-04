import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginContext } from "/src/App";
import useTheme from "/src/Hooks/ThemeHook";

function EditProfile() {
  const isDarkMode = useTheme();
  const { userEmail } = useContext(loginContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(""); 
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [university, setUniversity] = useState("");

  useEffect(() => {
    if (!userEmail) return;
    axios
      .get(`${import.meta.env.VITE_VIEW_PROFILE}${userEmail}/`)
      .then((res) => {
        const data = res.data;
        setName(data.name || "");
        setPhone(data.phone || "");
        setAcademicYear(data.academicYear || "");
        setProfilePhoto(data.profilePhoto || "");
        setPreview(data.profilePhoto || null);
        setRole(data.role || ""); 
        setUniversity(data.university || "");
      })
      .catch((err) => console.error("Failed to load profile", err));
  }, [userEmail]);

  const handleProfileImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Scopik");
    formData.append("cloud_name", "dm8wceqw2");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dm8wceqw2/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data.url);
      setProfilePhoto(data.url);
      setPreview(data.url);
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      alert("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      userEmail,
      name,
      phone,
      profile_img: profilePhoto,
    };

     if (!(role === "Faculty" || university === "Scopik")) {
      payload.academicYear = academicYear;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_UPDATE_PROFILE}${userEmail}`,
        payload
      );
      alert("Profile updated successfully");
      navigate("/");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center rounded-lg px-4 py-10 ${
        isDarkMode ? "bg-[#111827] text-white" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-lg p-8 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover mb-3 border shadow-md"
              />
            ) : (
              <div className="w-24 h-24 mb-3 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImage}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "border-gray-300"
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "border-gray-300"
              }`}
              required
            />
          </div>
          {!(role === "Faculty" || university === "Scopik") && (
            <div>
              <label className="block mb-1 text-sm font-medium">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">Select</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FF6A00] hover:bg-orange-600"
            }`}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
