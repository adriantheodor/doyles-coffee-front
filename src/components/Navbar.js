import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import useAuth from "../hooks/useAuth";
import "./Navbar.css";

const Navbar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsOpen(false);
  };

  const handleSectionClick = (section) => {
    if (setActiveSection) setActiveSection(section);
    navigate("/admin");
    setIsOpen(false);
  };

  return (
    <nav className="navbar-custom">
      <div className="navbar-header">
        <HashLink smooth to="/#top" className="navbar-logo-link">
          {/* optional img/logo */}
        </HashLink>

        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        {/* PUBLIC NAV */}
        {!isAuthenticated && (
          <>
            <HashLink smooth to="/#top" onClick={() => setIsOpen(false)}>
              Home
            </HashLink>

            <Link to="/gallery" onClick={() => setIsOpen(false)}>
              Gallery
            </Link>

            <HashLink smooth to="/#contact" onClick={() => setIsOpen(false)}>
              Contact
            </HashLink>

            <Link to="/quote" onClick={() => setIsOpen(false)}>
              Get a Quote
            </Link>

            <Link to="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              Register
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <button
              onClick={() => {
                setActiveSection("overview");
                navigate("/admin");
                setIsOpen(false);
              }}
            >
              Admin Home
            </button>

            <button onClick={() => handleSectionClick("inventory")}>
              Inventory
            </button>

            <button onClick={() => handleSectionClick("quotes")}>Quotes</button>

            <button onClick={() => handleSectionClick("orders")}>Orders</button>

            <button onClick={() => handleSectionClick("issues")}>Issues</button>

            <button onClick={() => handleSectionClick("users")}>
              Admin Users
            </button>

            <button onClick={() => handleSectionClick("invoices")}>
              Invoices
            </button>

            <button onClick={() => handleSectionClick("qrcodes")}>
              QR Codes
            </button>

            <button onClick={() => handleSectionClick("audit")}>
              Audit Logs
            </button>
          </>
        )}

        {/* CUSTOMER NAV */}
        {user?.role === "customer" && (
          <>
            <button
              onClick={() => {
                setActiveSection("home");
                navigate("/dashboard");
                setIsOpen(false);
              }}
            >
              Customer Home
            </button>

            <button
              onClick={() => {
                setActiveSection("orders");
                navigate("/dashboard");
                setIsOpen(false);
              }}
            >
              Place Order
            </button>

            <button
              onClick={() => {
                setActiveSection("history");
                navigate("/dashboard");
                setIsOpen(false);
              }}
            >
              Past Orders
            </button>

            <button
              onClick={() => {
                setActiveSection("issues");
                navigate("/dashboard");
                setIsOpen(false);
              }}
            >
              Report Issue
            </button>

            <button
              onClick={() => {
                setActiveSection("invoices");
                navigate("/dashboard");
                setIsOpen(false);
              }}
            >
              Invoices
            </button>
          </>
        )}

        {/* LOGGED-IN USER CONTROLS */}
        {isAuthenticated && user && (
          <div className="user-controls">
            <span className="welcome-text">Welcome, {user.name}</span>

            <button onClick={() => navigate("/account-settings")}>
              Account Settings
            </button>

            <button onClick={() => navigate("/change-password")}>
              Change Password
            </button>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
