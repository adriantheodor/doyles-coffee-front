import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link"; // Import this!
import logo from "../assets/logo.jpg";
import "./Navbar.css";

const Navbar = ({ user, setUser, activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    setIsOpen(false);
  };

  // Helper to close menu
  const handleLinkClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSectionClick = (section) => {
    if (setActiveSection) setActiveSection(section);
    setIsOpen(false);
  };

  return (
    <nav className="navbar-custom">
      <div className="navbar-header">
        {/* We use HashLink for the logo too, so it scrolls to top */}
        <HashLink smooth to="/#top" className="navbar-logo-link">
        </HashLink>

        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        {!user && (
          <>
            {/* Use HashLink with 'smooth' prop */}
            <HashLink smooth to="/#top" onClick={() => setIsOpen(false)}>
              Home
            </HashLink>
            <HashLink smooth to="/#about" onClick={() => setIsOpen(false)}>
              About
            </HashLink>
            <HashLink smooth to="/#contact" onClick={() => setIsOpen(false)}>
              Contact
            </HashLink>
            <HashLink smooth to="/#quote" onClick={() => setIsOpen(false)}>
              Get a Quote
            </HashLink>

            {/* Login/Register are still separate pages, so use standard Link */}
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
                handleLinkClick("/admin");
                if (setActiveSection) setActiveSection("overview");
              }}
            >
              Admin Home
            </button>
            <button onClick={() => handleSectionClick("inventory")}>
              Inventory
            </button>
            <button onClick={() => handleSectionClick("orders")}>Orders</button>
            <button onClick={() => handleSectionClick("maintenance")}>
              Maintenance
            </button>
            <button onClick={() => handleSectionClick("invoices")}>
              Invoices
            </button>
            <button onClick={() => handleSectionClick("qrcodes")}>
              QR Codes
            </button>
          </>
        )}

        {user?.role === "customer" && (
          <button onClick={() => handleLinkClick("/customer-dashboard")}>
            Customer Home
          </button>
        )}

        {user && (
          <div className="user-controls">
            <span className="welcome-text">Welcome, {user.name}</span>
            <button onClick={() => handleLinkClick("/change-password")}>
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
