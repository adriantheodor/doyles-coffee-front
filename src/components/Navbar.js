import { useState } from "react"; // Import useState
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import "./Navbar.css";

const Navbar = ({ user, setUser, activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    setIsOpen(false); // Close menu on logout
  };

  // Helper to close menu when a link is clicked
  const handleLinkClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };
  
  // Helper for admin section clicks
  const handleSectionClick = (section) => {
      if(setActiveSection) setActiveSection(section);
      setIsOpen(false);
  }

  return (
    <nav className="navbar-custom">
      {/* 1. Logo and Hamburger Row */}
      <div className="navbar-header">
        <img src={logo} alt="Doyle's Logo" className="navbar-logo" />
        
        {/* Hamburger Toggle Button (Visible only on mobile) */}
        <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      {/* 2. Links and Buttons (Collapsible) */}
      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        
        {/* Public Links */}
        {!user && (
          <>
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link to="/quote" onClick={() => setIsOpen(false)}>Get a Quote</Link>
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
          </>
        )}

        {/* Admin Links */}
        {user?.role === 'admin' && (
          <>
            <button onClick={() => { handleLinkClick('/admin'); if(setActiveSection) setActiveSection('overview'); }}>
              Admin Home
            </button>
            <button onClick={() => handleSectionClick('inventory')}>Inventory</button>
            <button onClick={() => handleSectionClick('orders')}>Orders</button>
            <button onClick={() => handleSectionClick('maintenance')}>Maintenance</button>
            <button onClick={() => handleSectionClick('invoices')}>Invoices</button>
            <button onClick={() => handleSectionClick('qrcodes')}>QR Codes</button>
          </>
        )}

        {/* Customer Links */}
        {user?.role === 'customer' && (
          <button onClick={() => handleLinkClick('/customer-dashboard')}>Customer Home</button>
        )}

        {/* User Controls (Welcome, Change PW, Logout) */}
        {user && (
          <div className="user-controls">
            <span className="welcome-text">Welcome, {user.name}</span>
            <button onClick={() => handleLinkClick('/change-password')}>Change Password</button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;