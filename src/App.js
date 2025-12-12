import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import AdminDashPage from "./pages/Admin/AdminDashPage";
import CustomerDashPage from "./pages/CustomerDashPage";
import RoleBasedRoute from "./components/RoleBasedRoute";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import QuotePage from "./pages/QuotePage";
import InvoicesPage from "./pages/InvoicesPage";
import HomePage from "./pages/HomePage";
import SubmitIssuePage from "./pages/SubmitIssuePage";
import PlaceOrderPage from "./pages/PlaceOrderPage";

import { API_BASE } from "./utils/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [activeSection, setActiveSection] = useState("overview");

  // 🔁 SILENT REFRESH on first load
  useEffect(() => {
    const trySilentRefresh = async () => {
      try {
        const resp = await axios.post(
          `${API_BASE}api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = resp.data.token;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
        }

        // If user lost, restore from backend (optional)
        if (!user) {
          const me = await axios.get(`${API_BASE}api/auth/me`, {
            headers: { Authorization: `Bearer ${newToken}` },
          });

          localStorage.setItem("user", JSON.stringify(me.data));
          setUser(me.data);
        }
      } catch (err) {
        console.log("Silent refresh failed — user stays logged out.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    trySilentRefresh();
  }, []);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
  };

  return (
    <>
      {shouldShowNavbar && (
        <Navbar
          user={user}
          setUser={setUser}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage onLogin={handleLogin} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} user={user} />}
        />
        <Route path="/register" element={<RegisterPage />} />

        {/* CUSTOMER SUBMIT ISSUE */}
        <Route
          path="/submit-issue"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <SubmitIssuePage />
            </RoleBasedRoute>
          }
        />

        {/* CUSTOMER PLACE ORDER */}
        <Route
          path="/place-order"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <PlaceOrderPage />
            </RoleBasedRoute>
          }
        />

        {/* CUSTOMER INVOICES */}
        <Route
          path="/invoices"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <InvoicesPage />
            </RoleBasedRoute>
          }
        />

        {/* CHANGE PASSWORD */}
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashPage activeSection={activeSection} />
            </RoleBasedRoute>
          }
        />

        {/* CUSTOMER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <CustomerDashPage activeSection={activeSection} />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
