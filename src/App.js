import React, { useState } from "react";
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
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AdminDashPage from "./pages/Admin/AdminDashPage";
import CustomerDashPage from "./pages/CustomerDashPage";
import RoleBasedRoute from "./components/RoleBasedRoute";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import QuotePage from "./pages/QuotePage";
import QuoteConfirmation from "./pages/QuoteConfirmation";
import InvoicesPage from "./pages/InvoicesPage";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import SubmitIssuePage from "./pages/SubmitIssuePage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import CustomerOrdersHistory from "./pages/CustomerOrdersHistory";
import AdminInvoiceManagementPage from "./pages/Admin/AdminInvoiceManagementPage";
import AdminInventoryPage from "./pages/Admin/AdminInventoryPage";
import CustomerInvoicesPage from "./pages/CustomerInvoicesPage";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import useAuth from "./hooks/useAuth";
import useToast from "./hooks/useToast";
import ToastContainer from "./components/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/mobile-refinements.css";
import "./App.css";

function AppWrapper() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const toast = useToast();
  const hideNavbarPaths = ["/login", "/register", "/verify-email"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);
  const [activeSection, setActiveSection] = useState("overview");

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#1976d2", marginBottom: "10px" }}
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p style={{ color: "#666" }}>Initializing app...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        toasts={toast.toasts}
        onRemove={toast.removeToast}
        onAction={(id) => {
          const t = toast.toasts.find((item) => item.id === id);
          if (t?.action) t.action();
        }}
        position="bottom-right"
      />
      {shouldShowNavbar && (
        <Navbar
          user={user}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/quote-confirmation" element={<QuoteConfirmation />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

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

        {/* CUSTOMER ORDER TRACKING */}
        <Route
          path="/orders/:orderId"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <OrderTrackingPage />
            </RoleBasedRoute>
          }
        />

        {/* CUSTOMER ALL ORDERS */}
        <Route
          path="/orders"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <div className="page-container">
                <div className="page-card">
                  <CustomerOrdersHistory />
                </div>
              </div>
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

        {/* CUSTOMER MY INVOICES */}
        <Route
          path="/my-invoices"
          element={
            <RoleBasedRoute allowedRoles={["customer"]}>
              <CustomerInvoicesPage />
            </RoleBasedRoute>
          }
        />

        {/* CHANGE PASSWORD */}
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* ACCOUNT SETTINGS */}
        <Route
          path="/account-settings"
          element={
            <RoleBasedRoute allowedRoles={["customer", "admin"]}>
              <AccountSettingsPage />
            </RoleBasedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashPage activeSection={activeSection} />
            </RoleBasedRoute>
          }
        />

        {/* ADMIN INVOICE MANAGEMENT */}
        <Route
          path="/admin/invoices"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminInvoiceManagementPage />
            </RoleBasedRoute>
          }
        />

        {/* ADMIN INVENTORY MANAGEMENT */}
        <Route
          path="/admin/inventory"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminInventoryPage />
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
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <AppWrapper />
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
