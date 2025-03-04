import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./auth/Login";
import Home from "./home/Home";
import PhotographerList from "./photographers/PhotographerList";
import BookingList from "./bookings/UserBookingList";
import Register from "./auth/Register";
import InquiryList from "./inquiries/InquiryList";
import AdminPhotographerList from "./admin/AdminPhotographerList";
import AdminBookingList from "./admin/AdminBookingList";
import { toast } from "react-hot-toast";
import FirstLogin from "./auth/FirstLogin";
import ChangePassword from "./auth/ChangePassword";
import AdminUserList from "./admin/AdminUserList";
import Profile from "./profile/Profile";

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

const AdminRoute = ({ loggedInUser, children }) => {
  const location = useLocation();

  if (!loggedInUser || loggedInUser.role !== "Admin") {
    toast.error("Unauthorized access");
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
          <Authorized
            loggedInUser={loggedInUser}
            allowedRoles={["Admin", "Photographer", "User"]}
          >
            <PhotographerList />
          </Authorized>
        }
      />
      <Route
        path="/bookings"
        element={
          <Authorized
            loggedInUser={loggedInUser}
            allowedRoles={["Admin", "Photographer", "User"]}
          >
            <BookingList />
          </Authorized>
        }
      />

      {/* Register Route */}
      <Route
        path="/register"
        element={<Register setLoggedInUser={setLoggedInUser} />}
      />

      {/* Inquiry Route */}
      <Route
        path="/inquiries"
        element={
          <Authorized
            loggedInUser={loggedInUser}
            allowedRoles={["Admin", "Photographer", "User"]}
          >
            <InquiryList />
          </Authorized>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/users"
        element={
          <Authorized loggedInUser={loggedInUser} allowedRoles={["Admin"]}>
            <AdminUserList />
          </Authorized>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminRoute loggedInUser={loggedInUser}>
            <AdminBookingList />
          </AdminRoute>
        }
      />

      {/* First Login Route */}
      <Route path="/first-login" element={<FirstLogin />} />

      {/* Change Password Route */}
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Profile Route */}
      <Route
        path="/profile"
        element={
          <Profile
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          />
        }
      />

      {/* Catch-all route for 404s */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}
