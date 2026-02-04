import { Route, Routes, BrowserRouter } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "/src/Components/MainLayout.jsx";
import ScrollToTop from "/src/Components/ScrolllToTop.js";
import Login from "./Pages/Login/Login";
import Register from "/src/Pages/Register.jsx";
import SuperLogin from "/src/Pages/SuperLogin.jsx";
import Home from "/src/Pages/Home.jsx";
import About from "/src/Pages/About.jsx";
import Contact from "/src/Pages/Contact.jsx";
import Courses from "/src/Pages/CoursePages/Courses.jsx";
import InnerCourse from "/src/Pages/CoursePages/InnerCourse.jsx";
import CourseContent from "/src/Pages/CoursePages/CourseContent.jsx";
import Quizzes from "/src/Components/CourseComponents/Quizzes.jsx";
import CertificatePage from "/src/Pages/Certificate.jsx";
import BlogPage from "/src/Pages/Blog/BlogPage.jsx";
import InnerBlog from "/src/Pages/Blog/InnerBlog.jsx";
import UniversityLogin from "/src/Pages/UniversityLogin";
import SetPassword from "/src/Pages/SetPassword";
import SemesterDetail from "/src/Dashboard/Student/SemesterDetails";
import AdminLogin from "../src/Pages/Login/AdminLogin";
import SemesterList from "/src/Dashboard/Student/SemesterList";
import Forbidden403 from "./Pages/Login/ForbiddenRoute";
import ProtectedRoute from "./Pages/Login/ProtectedRoute";

// dashboards
import Super from "./Admin/SuperAdmin/Superadmin";
import UniversityDashboard from "./Dashboard/UnivAdmin/UniversityDashboard";
import Teacherdashboard from "./Dashboard/Teacher/Teacherdashboard";
import StudentDashboard from "./Dashboard/Student/StudentDashboard";
import TermsAndConditions from "./Policies/Terms";
import PrivacyPolicy from "./Policies/Policy";
import RefundPolicy from "./Policies/Refund";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import NewPassword from "./Pages/Forgot";

const loginContext = createContext();
const CourseContext = createContext();
const TeacherContext = createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("")
  const [Course, setCourse] = useState([]);

  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;
  const token = btoa(`${username}:${password}`);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_Course_name, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) =>
        setCourse(res.data))
      .catch((error) => console.error("There is an Error:", error));
  }, []);



  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");
    const storedUserImage = localStorage.getItem("profileImage")


    if (storedToken) {
      setLogin(true);
      if (storedUserName) setUserName(storedUserName);
      if (storedUserEmail) setUserEmail(storedUserEmail);
      if (storedUserImage) setUserImage(storedUserImage)
    }

    setLoading(false);
  }, []);

  return (
    <loginContext.Provider
      value={{
        login,
        setLogin,
        loading,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        userImage,
        setUserImage
      }}
    >
      <CourseContext.Provider value={{ Course, setCourse }}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Pages */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/course" element={<Courses />} />
              <Route path="/course/:id" element={<InnerCourse />} />
              <Route path="/quizzes/:id" element={<Quizzes />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blogs/:id" element={<InnerBlog />} />
              <Route path="/semesters" element={<SemesterList />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund_returns" element={<RefundPolicy />} />
              <Route path="/semesters/:id" element={<SemesterDetail />} />
            </Route>

            <Route path="/individual/:id" element={<CourseContent />} />
            <Route path="/certificate" element={<CertificatePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/set-password/:token/:email" element={<SetPassword />} />
            <Route path="/forgot-password/:token/:email" element={<NewPassword />} />
            <Route path="/superadminlogin" element={<SuperLogin />} />
            <Route path="/uLogin" element={<UniversityLogin />} />
            <Route path="/forbidden" element={<Forbidden403 />} />

            {/* Protected Role-Based Routes */}
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "super_admin"]}>
                  <Super />
                </ProtectedRoute>
              }
            />
            <Route
              path="/univAdmin"
              element={
                <ProtectedRoute allowedRoles={["university", "university_admin"]}>
                  <UniversityDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty"
              element={
                <ProtectedRoute allowedRoles={["faculty"]}>
                  <Teacherdashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Forbidden403 />} />
          </Routes>
        </BrowserRouter>
      </CourseContext.Provider>
    </loginContext.Provider>
  );
}

export default App;
export { loginContext, CourseContext, TeacherContext };
