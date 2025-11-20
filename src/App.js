import {useState} from "react";
import {BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import AdminDashPage from './pages/Admin/AdminDashPage';
import CustomerDashPage from './pages/CustomerDashPage';
import RoleBasedRoute from './components/RoleBasedRoute';
import ChangePasswordPage from "./pages/ChangePasswordPage";
import QuotePage from "./pages/QuotePage";
import HomePage from "./pages/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register']; // paths that hide navbar
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });


  const [activeSection, setActiveSection] = useState('overview'); // moved here

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
        <Route path="/" element={<HomePage onLogin={handleLogin} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage user={user} onLogin={handleLogin} />} />
        <Route path="/quote" element={<QuotePage user={user} />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashPage activeSection={activeSection} />
            </RoleBasedRoute>
          }
        />

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

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
