import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import "./Navbar.css";

const Navbar = ({ user, setUser, activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <nav className="navbar-custom">
      <div>
        <img src={logo} alt="Doyle's Logo" style={{ height: "40px", marginRight: "1rem" }} />

        {!user && (
          <>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/quote">Get a Quote</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <button onClick={() => { navigate('/admin'); setActiveSection && setActiveSection('overview'); }}>
              Admin Home
            </button>
            <button onClick={() => setActiveSection('inventory')}>Inventory</button>
            <button onClick={() => setActiveSection('orders')}>Orders</button>
            <button onClick={() => setActiveSection('maintenance')}>Maintenance</button>
            <button onClick={() => setActiveSection('invoices')}>Invoices</button>
            <button onClick={() => setActiveSection('qrcodes')}>QR Codes</button>
          </>
        )}

        {user?.role === 'customer' && (
          <button onClick={() => navigate('/customer-dashboard')}>Customer Home</button>
        )}
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Welcome, {user.name}</span>
          <button onClick={handleChangePassword}>Change Password</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
