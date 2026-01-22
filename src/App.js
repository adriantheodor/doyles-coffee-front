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
import SubmitIssuePage from "./pages/SubmitIssuePage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import CustomerOrdersHistory from "./pages/CustomerOrdersHistory";
import AdminInvoiceManagementPage from "./pages/Admin/AdminInvoiceManagementPage";
import CustomerInvoicesPage from "./pages/CustomerInvoicesPage";

import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              maxWidth: "600px",
              textAlign: "center",
            }}
          >
            <h1 style={{ color: "#d32f2f", marginBottom: "20px" }}>
              ❌ Something went wrong
            </h1>
            <p style={{ color: "#666", marginBottom: "20px", fontSize: "16px" }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  textAlign: "left",
                  marginBottom: "20px",
                }}
              >
                <summary style={{ cursor: "pointer", color: "#d32f2f" }}>
                  Error details
                </summary>
                <pre
                  style={{
                    fontSize: "12px",
                    overflow: "auto",
                    marginTop: "10px",
                    color: "#333",
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppWrapper() {
  const location = useLocation();
  const { user, loading } = useAuth();
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
          <AppWrapper />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
