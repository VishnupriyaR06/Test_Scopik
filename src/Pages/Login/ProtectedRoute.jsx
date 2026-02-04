import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { loginContext } from "../../App";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { login, loading } = useContext(loginContext);

  const role = (localStorage.getItem("userRole") || "").toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  if (loading) {
    return <div>Loading...</div>
  }

  if (!login) {
    return <Navigate to="/" replace />
  }

  if (!normalizedAllowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
