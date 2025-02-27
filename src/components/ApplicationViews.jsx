import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./auth/Login";
import Home from "./home/Home";
import PhotographerList from "./photographers/PhotographerList";
import BookingList from "./bookings/BookingList";
import Register from "./auth/Register";

// Authorized Route component
const Authorized = ({ loggedInUser, children, allowedRoles = [] }) => {
  const location = useLocation();

  if (!loggedInUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Simple direct comparison
  const userRole = loggedInUser.role;
  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={<Login setLoggedInUser={setLoggedInUser} />}
      />

      {/* Authorized Routes */}
      <Route
        path="/photographers"
        element={
          <Authorized loggedInUser={loggedInUser} allowedRoles={["Admin"]}>
            <PhotographerList />
          </Authorized>
        }
      />
      <Route
        path="/bookings"
        element={
          <Authorized loggedInUser={loggedInUser} allowedRoles={["Admin"]}>
            <BookingList />
          </Authorized>
        }
      />

      {/* Register Route */}
      <Route
        path="/register"
        element={<Register setLoggedInUser={setLoggedInUser} />}
      />

      {/* Catch-all route for 404s */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}
