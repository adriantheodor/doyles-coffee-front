import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
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

  const handleSectionClick = (section) => {
    if (setActiveSection) setActiveSection(section);
    navigate("/admin");
    setIsOpen(false);
  };

  const handleCustomerNav = () => {
    navigate("/dashboard");
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
            <svg width="24" height="24" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        {/* PUBLIC NAV */}
        {!user && (
          <>
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

            <button onClick={() => handleSectionClick("inventory")}>Inventory</button>

            <button onClick={() => handleSectionClick("quotes")}>Quotes</button>

            <button onClick={() => handleSectionClick("orders")}>Orders</button>

            <button onClick={() => handleSectionClick("issues")}>Issues</button>

            <button onClick={() => handleSectionClick("invoices")}>Invoices</button>

            <button onClick={() => handleSectionClick("qrcodes")}>QR Codes</button>
          </>
        )}

        {/* CUSTOMER NAV */}
        {user?.role === "customer" && (
          <button onClick={handleCustomerNav}>Customer Home</button>
        )}

        {/* LOGGED-IN USER CONTROLS */}
        {user && (
          <div className="user-controls">
            <span className="welcome-text">Welcome, {user.name}</span>

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
