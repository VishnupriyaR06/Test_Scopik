import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Super from "../../Admin/SuperAdmin/Superadmin";
import UniversityDashboard from "../../Dashboard/UnivAdmin/UniversityDashboard";
import Teacherdashboard from "../../Dashboard/Teacher/Teacherdashboard";
import StudentDashboard from "../../Dashboard/Student/StudentDashboard";

const PrivateRoute = () => {
  return (
    <Routes>
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
    </Routes>
  );
};

export default PrivateRoute;
