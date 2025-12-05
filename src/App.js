import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

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
